import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  // Obtener token de autenticación
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  // Crear o obtener carrito
  const getOrCreateCart = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        // Si no hay token, usar carrito local
        const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
        setCartItems(localCart);
        return;
      }

      // Intentar obtener carrito del usuario
      const userResponse = await axios.get(`${API_URL}/auth/current`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (userResponse.data.payload.cart) {
        const cartResponse = await axios.get(`${API_URL}/carts/${userResponse.data.payload.cart}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(cartResponse.data.payload);
        setCartItems(cartResponse.data.payload.products || []);
      } else {
        // Crear nuevo carrito
        const newCartResponse = await axios.post(`${API_URL}/carts`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(newCartResponse.data.payload);
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error obteniendo carrito:', error);
      // Fallback a carrito local
      const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
      setCartItems(localCart);
    } finally {
      setLoading(false);
    }
  }, [API_URL, getAuthToken]);

  // Función auxiliar para obtener ID normalizado del producto
  const getProductId = (product) => {
    if (!product) return null;
    if (typeof product === 'string') return product;
    return product._id || product.id || null;
  };

  // Agregar producto al carrito
  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      
      // Normalizar ID del producto
      const productId = getProductId(product);
      if (!productId) {
        throw new Error('Producto inválido: no se pudo obtener el ID');
      }

      if (!token) {
        // Carrito local
        const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
        const existingItemIndex = localCart.findIndex(item => {
          const itemProductId = getProductId(item.product);
          return itemProductId === productId;
        });
        
        if (existingItemIndex >= 0) {
          localCart[existingItemIndex].quantity += quantity;
        } else {
          localCart.push({ product, quantity });
        }
        
        localStorage.setItem('localCart', JSON.stringify(localCart));
        setCartItems(localCart);
        return;
      }

      // Carrito en servidor
      if (!cart) {
        await getOrCreateCart();
      }

      // Asegurar que tenemos el carrito
      if (!cart || !cart.id) {
        await getOrCreateCart();
      }

      // Verificar si el producto ya está en el carrito
      const existingItem = cartItems.find(item => {
        const itemProductId = typeof item.product === 'object' 
          ? getProductId(item.product) 
          : item.product;
        return itemProductId === productId;
      });

      if (existingItem) {
        // Actualizar cantidad
        await axios.put(
          `${API_URL}/carts/${cart.id}/products/${productId}`,
          { quantity: existingItem.quantity + quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Agregar nuevo producto usando el endpoint correcto
        await axios.put(
          `${API_URL}/carts/${cart.id}`,
          {
            products: [
              ...cartItems.map(item => ({
                product: typeof item.product === 'object' 
                  ? getProductId(item.product) 
                  : item.product,
                quantity: item.quantity
              })),
              { product: productId, quantity }
            ]
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Refrescar el carrito después de agregar
      await getOrCreateCart();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error agregando al carrito';
      setError(errorMessage);
      console.error('Error agregando al carrito:', error);
      throw error; // Re-lanzar para que el componente pueda manejarlo
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cantidad
  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();

      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      if (!token) {
        const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
        const itemIndex = localCart.findIndex(item => {
          const itemProductId = getProductId(item.product);
          return itemProductId === productId;
        });
        if (itemIndex >= 0) {
          localCart[itemIndex].quantity = quantity;
          localStorage.setItem('localCart', JSON.stringify(localCart));
          setCartItems(localCart);
        }
        return;
      }

      if (!cart || !cart.id) {
        await getOrCreateCart();
      }

      await axios.put(
        `${API_URL}/carts/${cart.id}/products/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await getOrCreateCart();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error actualizando cantidad';
      setError(errorMessage);
      console.error('Error actualizando cantidad:', error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto del carrito
  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();

      if (!token) {
        const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
        const filtered = localCart.filter(item => {
          const itemProductId = getProductId(item.product);
          return itemProductId !== productId;
        });
        localStorage.setItem('localCart', JSON.stringify(filtered));
        setCartItems(filtered);
        return;
      }

      if (!cart || !cart.id) {
        await getOrCreateCart();
      }

      await axios.delete(
        `${API_URL}/carts/${cart.id}/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await getOrCreateCart();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error eliminando del carrito';
      setError(errorMessage);
      console.error('Error eliminando del carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vaciar carrito
  const clearCart = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        localStorage.setItem('localCart', JSON.stringify([]));
        setCartItems([]);
        return;
      }

      await axios.put(
        `${API_URL}/carts/${cart.id}`,
        { products: [] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems([]);
    } catch (error) {
      setError(error.message);
      console.error('Error vaciando carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular total de unidades
  const getTotalItems = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => {
      const qty = item.quantity || 0;
      return total + qty;
    }, 0);
  };

  // Calcular total del carrito
  const getTotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => {
      const price = typeof item.product === 'object' && item.product 
        ? (item.product.price || 0) 
        : 0;
      const qty = item.quantity || 0;
      return total + (price * qty);
    }, 0);
  };

  useEffect(() => {
    getOrCreateCart();
  }, [getOrCreateCart]);

  const value = {
    cart,
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotal,
    refreshCart: getOrCreateCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
