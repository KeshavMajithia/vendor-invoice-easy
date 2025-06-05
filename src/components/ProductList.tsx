
import React from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Package, AlertTriangle } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductList = ({ products, onEdit, onDelete }: ProductListProps) => {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Products Found</h3>
          <p className="text-gray-500">Start by adding your first product to the inventory.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-32 object-cover rounded-md mb-4"
              />
            )}
            
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                {product.quantity_in_stock <= product.min_stock_level && (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
              </div>

              {product.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              )}

              <div className="flex flex-wrap gap-2">
                {product.category && (
                  <Badge variant="secondary">{product.category}</Badge>
                )}
                {product.brand && (
                  <Badge variant="outline">{product.brand}</Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Price:</span>
                  <div className="font-semibold">₹{product.price}</div>
                </div>
                <div>
                  <span className="text-gray-500">Stock:</span>
                  <div className={`font-semibold ${
                    product.quantity_in_stock <= product.min_stock_level ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {product.quantity_in_stock} {product.unit}
                  </div>
                </div>
              </div>

              {product.sku && (
                <div className="text-sm">
                  <span className="text-gray-500">SKU:</span>
                  <span className="ml-2 font-mono">{product.sku}</span>
                </div>
              )}

              {product.barcode && (
                <div className="text-sm">
                  <span className="text-gray-500">Barcode:</span>
                  <span className="ml-2 font-mono">{product.barcode}</span>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(product)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(product.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;
