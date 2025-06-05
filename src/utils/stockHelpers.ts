
import { supabase } from '@/integrations/supabase/client';

export const updateProductStock = async (productId: string, quantityChange: number, userId: string) => {
  try {
    // Get current stock
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('quantity_in_stock')
      .eq('id', productId)
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    // Update stock
    const newQuantity = Math.max(0, product.quantity_in_stock + quantityChange);
    
    const { error: updateError } = await supabase
      .from('products')
      .update({ quantity_in_stock: newQuantity })
      .eq('id', productId)
      .eq('user_id', userId);

    if (updateError) throw updateError;
    
    return { success: true };
  } catch (error) {
    console.error('Stock update error:', error);
    return { success: false, error };
  }
};
