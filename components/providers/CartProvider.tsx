"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
  deviceId: string;
}

const CartContext = createContext<CartContextType | null>(null);

const DEVICE_ID_KEY = "woodgrain-device-id";

function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    setDeviceId(getDeviceId());
  }, []);

  const cart = useQuery(
    api.cart.getCart,
    deviceId.length > 0 ? { deviceId } : "skip"
  );
  const addToCartMutation = useMutation(api.cart.addToCart);
  const updateQuantityMutation = useMutation(api.cart.updateQuantity);
  const removeFromCartMutation = useMutation(api.cart.removeFromCart);
  const clearCartMutation = useMutation(api.cart.clearCart);

  const items = cart?.items ?? [];
  const isLoading = !deviceId || cart === undefined;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const addItem = useCallback(
    async (product: Omit<CartItem, "quantity">, quantity?: number): Promise<void> => {
      if (!deviceId) return;
      await addToCartMutation({ deviceId, ...product, quantity });
    },
    [deviceId, addToCartMutation]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number): Promise<void> => {
      if (!deviceId) return;
      await updateQuantityMutation({ deviceId, productId, quantity });
    },
    [deviceId, updateQuantityMutation]
  );

  const removeItem = useCallback(
    async (productId: string): Promise<void> => {
      if (!deviceId) return;
      await removeFromCartMutation({ deviceId, productId });
    },
    [deviceId, removeFromCartMutation]
  );

  const clearCart = useCallback(async (): Promise<void> => {
    if (!deviceId) return;
    await clearCartMutation({ deviceId });
  }, [deviceId, clearCartMutation]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        isLoading,
        deviceId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
