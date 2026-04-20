import { defineStore } from "pinia";

/**
 * Shopping Cart Store
 * Manages cart state with localStorage persistence
 */
export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
  }),

  getters: {
    /**
     * Get total number of items in cart
     */
    cartCount: (state) => {
      return state.items.reduce((total, item) => total + (item.count || 0), 0);
    },

    /**
     * Get total price of all items in cart
     */
    cartTotal: (state) => {
      return state.items.reduce(
        (total, item) => total + item.price * (item.count || 0),
        0
      );
    },

    /**
     * Check if a product is in the cart
     */
    isInCart: (state) => (productId) => {
      return state.items.some((item) => item.id === productId);
    },

    /**
     * Get specific product from cart
     */
    getCartItem: (state) => (productId) => {
      return state.items.find((item) => item.id === productId);
    },
  },

  actions: {
    /**
     * Initialize cart from localStorage
     */
    initCart() {
      if (process.client) {
        try {
          const stored = localStorage.getItem("products");
          if (stored) {
            this.items = JSON.parse(stored);
          }
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
          this.items = [];
        }
      }
    },

    /**
     * Save cart to localStorage
     */
    saveCart() {
      if (process.client) {
        try {
          localStorage.setItem("products", JSON.stringify(this.items));
        } catch (error) {
          console.error("Error saving cart to localStorage:", error);
        }
      }
    },

    /**
     * Add item to cart
     * @param {Object} product - Product object
     * @param {number} quantity - Quantity to add (default: 1)
     */
    addToCart(product, quantity = 1) {
      const existingItem = this.items.find((item) => item.id === product.id);

      if (existingItem) {
        // Update quantity if product exists
        const newCount = existingItem.count + quantity;
        if (newCount <= product.quantity) {
          existingItem.count = newCount;
        } else {
          throw new Error("الكمية المطلوبة غير متوفرة");
        }
      } else {
        // Add new product
        this.items.push({
          ...product,
          count: quantity,
        });
      }

      this.saveCart();
    },

    /**
     * Remove item from cart
     * @param {string|number} productId - Product ID to remove
     */
    removeFromCart(productId) {
      const index = this.items.findIndex((item) => item.id === productId);
      if (index !== -1) {
        this.items.splice(index, 1);
        this.saveCart();
      }
    },

    /**
     * Update item quantity
     * @param {string|number} productId - Product ID
     * @param {number} quantity - New quantity
     */
    updateQuantity(productId, quantity) {
      const item = this.items.find((item) => item.id === productId);
      if (item) {
        if (quantity > 0 && quantity <= item.quantity) {
          item.count = quantity;
          this.saveCart();
        } else if (quantity <= 0) {
          this.removeFromCart(productId);
        } else {
          throw new Error("الكمية المطلوبة غير متوفرة");
        }
      }
    },

    /**
     * Increment item quantity
     * @param {string|number} productId - Product ID
     */
    incrementItem(productId) {
      const item = this.items.find((item) => item.id === productId);
      if (item && item.count < item.quantity) {
        item.count++;
        this.saveCart();
      } else {
        throw new Error("الكمية المطلوبة غير متوفرة");
      }
    },

    /**
     * Decrement item quantity
     * @param {string|number} productId - Product ID
     */
    decrementItem(productId) {
      const item = this.items.find((item) => item.id === productId);
      if (item) {
        if (item.count > 1) {
          item.count--;
          this.saveCart();
        } else {
          this.removeFromCart(productId);
        }
      }
    },

    /**
     * Clear entire cart
     */
    clearCart() {
      this.items = [];
      this.saveCart();
    },
  },
});
