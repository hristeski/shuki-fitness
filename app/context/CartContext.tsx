"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  totalItems: number;
  
  // НОВО ЗА ПРОМО КОДОВИ
  subtotal: number;
  discountAmount: number;
  totalPrice: number;
  appliedPromoCode: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // State за промо кодот
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (newItem: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === newItem.id);
      if (existing) {
        return prev.map(item => item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item);
      }
      return [...prev, newItem];
    });
    openCart();
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // ЛОГИКА ЗА ПРОМО КОДОВИ
  const applyPromoCode = (code: string) => {
    const uppercaseCode = code.trim().toUpperCase();
    
    if (uppercaseCode === "SHUKI20") {
      setAppliedPromoCode("SHUKI20");
      setDiscountPercent(20);
      return { success: true, message: "20% OFF Discount Applied!" };
    }
    
    // Ако сакаш понатаму можеш да додадеш и други кодови овде (пр. SHUKI50)
    
    return { success: false, message: "Invalid or expired promo code." };
  };

  const removePromoCode = () => {
    setAppliedPromoCode(null);
    setDiscountPercent(0);
  };

  // ПРЕСМЕТКА НА ЦЕНИТЕ
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Колку изнесува попустот во пари
  const discountAmount = subtotal * (discountPercent / 100);
  
  // Конечна цена
  const totalPrice = subtotal - discountAmount;

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      isCartOpen, 
      openCart, 
      closeCart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      totalItems, 
      subtotal,
      discountAmount,
      totalPrice,
      appliedPromoCode,
      applyPromoCode,
      removePromoCode
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart мора да се користи внатре во CartProvider");
  return context;
}