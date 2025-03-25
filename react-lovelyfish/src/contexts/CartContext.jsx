import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'ADD_ITEM':
        const existing = state.find(item => item.id === action.product.id);
        return existing 
          ? state.map(item => 
              item.id === action.product.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            )
          : [...state, { ...action.product, quantity: 1 }];
      default:
        return state;
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}