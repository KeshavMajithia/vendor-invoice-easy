
import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const ProductForm = ({ product, onSave, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    price: 0,
    cost_price: 0,
    quantity_in_stock: 0,
    min_stock_level: 0,
    unit: 'pcs',
    sku: '',
    barcode: '',
    image_url: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        category: product.category || '',
        brand: product.brand || '',
        price: product.price,
        cost_price: product.cost_price,
        quantity_in_stock: product.quantity_in_stock,
        min_stock_level: product.min_stock_level,
        unit: product.unit,
        sku: product.sku || '',
        barcode: product.barcode || '',
        image_url: product.image_url || ''
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const units = ['pcs', 'kg', 'liters', 'meters', 'grams', 'boxes', 'pairs', 'sets'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">
            {product ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    placeholder="e.g., Electronics, Clothing"
                  />
                </div>

                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    placeholder="Product brand"
                  />
                </div>

                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleChange('sku', e.target.value)}
                    placeholder="Stock Keeping Unit"
                  />
                </div>

                <div>
                  <Label htmlFor="price">Selling Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cost_price">Cost Price (₹) *</Label>
                  <Input
                    id="cost_price"
                    type="number"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={(e) => handleChange('cost_price', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="quantity_in_stock">Current Stock *</Label>
                  <Input
                    id="quantity_in_stock"
                    type="number"
                    value={formData.quantity_in_stock}
                    onChange={(e) => handleChange('quantity_in_stock', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="min_stock_level">Minimum Stock Level</Label>
                  <Input
                    id="min_stock_level"
                    type="number"
                    value={formData.min_stock_level}
                    onChange={(e) => handleChange('min_stock_level', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <select
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => handleChange('unit', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => handleChange('barcode', e.target.value)}
                    placeholder="Will be auto-generated if empty"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  placeholder="Product description..."
                />
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleChange('image_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {product ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductForm;
