export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  fabric: string;
  color: string;
  image_url: string;
  images?: string[];
  in_stock: boolean;
  featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('pk_cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem('pk_cart', JSON.stringify(cart));
}

export function addToCart(product: Product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.product.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: number) {
  const cart = getCart().filter((item) => item.product.id !== productId);
  saveCart(cart);
  return cart;
}

export function updateQuantity(productId: number, quantity: number) {
  const cart = getCart().map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );
  saveCart(cart);
  return cart;
}

export function clearCart() {
  localStorage.removeItem('pk_cart');
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
