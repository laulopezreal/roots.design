import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  brand?: string;
  quantity: number;
}

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; payload: { item: Omit<CartItem, "quantity">; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "CLEAR_CART" };

export interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const initialState: CartState = {
  items: [],
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "roots.design.cart";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, quantity } = action.payload;
      const existingItem = state.items.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((cartItem) =>
            cartItem.id === item.id
              ? {
                  ...cartItem,
                  quantity: cartItem.quantity + quantity,
                }
              : cartItem,
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...item, quantity }],
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity,
              }
            : item,
        ),
      };
    }

    case "SET_ITEMS": {
      return {
        ...state,
        items: action.payload,
      };
    }

    case "CLEAR_CART": {
      return initialState;
    }

    default:
      return state;
  }
}

function deserializeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item) => typeof item === "object" && item !== null)
    .map((item) => ({
      id: String((item as CartItem).id),
      name: String((item as CartItem).name),
      price: Number((item as CartItem).price) || 0,
      image: (item as CartItem).image ?? undefined,
      brand: (item as CartItem).brand ?? undefined,
      quantity: Math.max(1, Number((item as CartItem).quantity) || 1),
    }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
    (initial): CartState => {
      if (typeof window === "undefined") {
        return initial;
      }

      try {
        const storedValue = window.localStorage.getItem(STORAGE_KEY);
        if (!storedValue) {
          return initial;
        }

        const parsed = JSON.parse(storedValue);
        return {
          items: deserializeCartItems(parsed),
        };
      } catch (error) {
        console.error("Failed to read cart from storage", error);
        return initial;
      }
    },
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error("Failed to persist cart", error);
    }
  }, [state.items]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      if (!item?.id) {
        return;
      }

      dispatch({ type: "ADD_ITEM", payload: { item, quantity: Math.max(1, quantity) } });
    },
    [],
  );

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const value = useMemo(() => {
    const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

    return {
      items: state.items,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    } satisfies CartContextValue;
  }, [state.items, addItem, removeItem, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
