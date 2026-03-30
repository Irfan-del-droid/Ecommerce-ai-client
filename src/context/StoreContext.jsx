import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

import { products as apiProducts } from "../api";

export const CATEGORIES = ["All", "Clothing", "Footwear", "Accessories", "Grooming"];

/* ============================================================
   CART CONTEXT
============================================================ */
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addedId, setAddedId] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);
        const data = await apiProducts.getAll();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProductsError(err.message);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = useCallback((p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }];
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1200);
  }, []);

  const removeItem = useCallback(id => setCart(prev => prev.filter(i => i.id !== id)), []);
  const toggleWish = useCallback(id => setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]), []);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeItem, wishlist, toggleWish, cartTotal, cartCount, drawerOpen, setDrawerOpen, addedId,
      products, productsLoading, productsError
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

/* ============================================================
   CART DRAWER
============================================================ */
export function CartDrawer() {
  const { cart, removeItem, cartTotal, drawerOpen, setDrawerOpen } = useCart();

  return (
    <>
      <div className={`drawer-overlay ${drawerOpen ? "dov-on" : ""}`} onClick={() => setDrawerOpen(false)} />
      <div className={`cart-drawer ${drawerOpen ? "cd-open" : ""}`}>
        <div className="cd-head">
          <div className="cd-title"><span className="cd-rune">ᛟ</span>Your Cart</div>
          <button className="cd-close" onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        <div className="cd-body">
          {cart.length === 0 ? (
            <div className="cd-empty">
              <span className="cde-rune">ᚺ</span>
              <p>Your cart roams empty, warrior.</p>
              <button className="cde-btn" onClick={() => setDrawerOpen(false)}>Begin Thy Quest</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cd-item">
                <div className="cdi-thumb">{item.emoji}</div>
                <div className="cdi-info">
                  <div className="cdi-name">{item.name}</div>
                  <div className="cdi-price">₹{(item.price * item.qty).toLocaleString()}</div>
                  <div className="cdi-qty">Qty: {item.qty}</div>
                </div>
                <button className="cdi-rm" onClick={() => removeItem(item.id)}>✕</button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cd-foot">
            <div className="cdf-row">
              <span>Subtotal</span>
              <span className="cdf-total">₹{cartTotal.toLocaleString()}</span>
            </div>
            <p className="cdf-note">✓ Free shipping on this order</p>
            <button className="cdf-checkout">
              Proceed to Checkout →
              <div className="cdf-shimmer" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
