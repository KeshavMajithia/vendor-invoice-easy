
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Search, Package, AlertTriangle } from 'lucide-react';
import ProductForm from '@/components/ProductForm';
import ProductList from '@/components/ProductList';

interface InventoryManagementProps {
  onBack: () => void;
  user: User | null;
}

const InventoryManagement = ({ onBack, user }: InventoryManagementProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Failed to load products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            ...productData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProduct.id)
          .eq('user_id', user.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Product updated successfully!"
        });
      } else {
        // Generate barcode if not provided
        const barcode = productData.barcode || await generateBarcode();
        
        const { error } = await supabase
          .from('products')
          .insert({
            ...productData,
            user_id: user.id,
            barcode
          });

        if (error) throw error;
        toast({
          title: "Success",
          description: "Product created successfully!"
        });
      }

      loadProducts();
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error: any) {
      console.error('Failed to save product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive"
      });
    }
  };

  const generateBarcode = async () => {
    const { data, error } = await supabase.rpc('generate_barcode');
    if (error) {
      console.error('Failed to generate barcode:', error);
      return `BC${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
    return data;
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product deleted successfully!"
      });
      
      loadProducts();
    } catch (error: any) {
      console.error('Failed to delete product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const lowStockProducts = products.filter(p => p.quantity_in_stock <= p.min_stock_level);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (showProductForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSave={handleSaveProduct}
        onCancel={() => {
          setShowProductForm(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
          </div>
          <Button onClick={() => setShowProductForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{lowStockProducts.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{products.reduce((sum, p) => sum + (p.price * p.quantity_in_stock), 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lowStockProducts.slice(0, 5).map(product => (
                  <Badge key={product.id} variant="destructive">
                    {product.name} ({product.quantity_in_stock} {product.unit})
                  </Badge>
                ))}
                {lowStockProducts.length > 5 && (
                  <Badge variant="outline">+{lowStockProducts.length - 5} more</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name, SKU, or barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="min-w-[200px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product List */}
        <ProductList
          products={filteredProducts}
          onEdit={(product) => {
            setEditingProduct(product);
            setShowProductForm(true);
          }}
          onDelete={handleDeleteProduct}
        />
      </div>
    </div>
  );
};

export default InventoryManagement;
