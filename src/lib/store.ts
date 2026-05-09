import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weight: string;
}

interface StoreState {
  currentPage: string;
  navigate: (page: string) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  isAdmin: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  sidePanelOpen: boolean;
  setSidePanelOpen: (open: boolean) => void;
  headerSearch: string;
  setHeaderSearch: (s: string) => void;
}

// Load cart from localStorage
function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("nutvest-cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Save cart to localStorage
function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("nutvest-cart", JSON.stringify(cart));
  } catch {
    // Ignore storage errors
  }
}

export const useStore = create<StoreState>((set, get) => ({
  currentPage: "/",
  navigate: (page: string) => {
    set({ currentPage: page, sidePanelOpen: false, headerSearch: "" });
    window.location.hash = page;
    window.scrollTo(0, 0);
  },

  cart: [],
  addToCart: (item: CartItem) => {
    const { cart } = get();
    const existing = cart.find((c) => c.id === item.id);
    let newCart: CartItem[];
    if (existing) {
      newCart = cart.map((c) =>
        c.id === item.id ? { ...c, quantity: c.quantity + item.quantity } : c
      );
    } else {
      newCart = [...cart, item];
    }
    set({ cart: newCart });
    saveCart(newCart);
  },
  removeFromCart: (id: string) => {
    const newCart = get().cart.filter((c) => c.id !== id);
    set({ cart: newCart });
    saveCart(newCart);
  },
  updateQuantity: (id: string, quantity: number) => {
    let newCart: CartItem[];
    if (quantity <= 0) {
      newCart = get().cart.filter((c) => c.id !== id);
    } else {
      newCart = get().cart.map((c) => (c.id === id ? { ...c, quantity } : c));
    }
    set({ cart: newCart });
    saveCart(newCart);
  },
  clearCart: () => {
    set({ cart: [] });
    saveCart([]);
  },
  cartTotal: () => {
    return get().cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },

  isAdmin: false,
  adminLogin: (password: string) => {
    if (password === "1234") {
      set({ isAdmin: true });
      return true;
    }
    return false;
  },
  adminLogout: () => {
    set({ isAdmin: false });
  },

  sidePanelOpen: false,
  setSidePanelOpen: (open: boolean) => set({ sidePanelOpen: open }),

  headerSearch: "",
  setHeaderSearch: (s: string) => set({ headerSearch: s }),
}));

// Initialize cart from localStorage after hydration
if (typeof window !== "undefined") {
  const savedCart = loadCart();
  if (savedCart.length > 0) {
    useStore.setState({ cart: savedCart });
  }
}
