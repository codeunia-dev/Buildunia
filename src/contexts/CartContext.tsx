'use client'

import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { CartItem, Project, Product } from '@/lib/supabase'
import { useBuilduniaAuth } from '@/contexts/BuilduniaAuthContext'
import { useRouter } from 'next/navigation'

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Project | Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

// Cart limits
const MAX_TOTAL_ITEMS = 5
const MAX_SAME_TYPE_ITEMS = 2

// Helper function to get price from product
const getProductPrice = (product: Project | Product) => {
  if (typeof product.prices === 'string') {
    try {
      const prices = JSON.parse(product.prices)
      return prices.full || prices.code || 0
    } catch (error) {
      console.error('Error parsing prices:', error)
      return 0
    }
  } else if (product.prices && typeof product.prices === 'object') {
    return product.prices.full || product.prices.code || 0
  } else {
    return product.price || 0
  }
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.project.id === action.payload.id)
      let newItems: CartItem[]

      if (existingItem) {
        // Check if adding one more would exceed the same type limit
        const itemType = action.payload.category || 'unknown'
        const currentTypeCount = state.items.reduce((count, item) => {
          if (item.project.category === itemType) {
            return count + item.quantity
          }
          return count
        }, 0)
        
        if (currentTypeCount >= MAX_SAME_TYPE_ITEMS) {
          // Don't add if it would exceed the limit
          return state
        }
        
        newItems = state.items.map(item =>
          item.project.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Check total items limit
        const currentTotalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
        if (currentTotalItems >= MAX_TOTAL_ITEMS) {
          // Don't add if it would exceed the total limit
          return state
        }
        
        // Check same type limit for new item
        const itemType = action.payload.category || 'unknown'
        const currentTypeCount = state.items.reduce((count, item) => {
          if (item.project.category === itemType) {
            return count + item.quantity
          }
          return count
        }, 0)
        
        if (currentTypeCount >= MAX_SAME_TYPE_ITEMS) {
          // Don't add if it would exceed the same type limit
          return state
        }
        
        newItems = [...state.items, { project: action.payload, quantity: 1 }]
      }

      const total = newItems.reduce((sum, item) => sum + (getProductPrice(item.project) * item.quantity), 0)
      return { items: newItems, total }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.project.id !== action.payload)
      const total = newItems.reduce((sum, item) => sum + (getProductPrice(item.project) * item.quantity), 0)
      return { items: newItems, total }
    }

    case 'UPDATE_QUANTITY': {
      const targetItem = state.items.find(item => item.project.id === action.payload.id)
      if (!targetItem) return state
      
      const newQuantity = action.payload.quantity
      if (newQuantity <= 0) {
        // Remove item if quantity is 0 or negative
        const newItems = state.items.filter(item => item.project.id !== action.payload.id)
        const total = newItems.reduce((sum, item) => sum + (getProductPrice(item.project) * item.quantity), 0)
        return { items: newItems, total }
      }
      
      // Check total items limit
      const currentTotalItems = state.items.reduce((sum, item) => {
        if (item.project.id === action.payload.id) {
          return sum + newQuantity
        }
        return sum + item.quantity
      }, 0)
      
      if (currentTotalItems > MAX_TOTAL_ITEMS) {
        // Don't update if it would exceed the total limit
        return state
      }
      
      // Check same type limit
      const itemType = targetItem.project.category || 'unknown'
      const currentTypeCount = state.items.reduce((count, item) => {
        if (item.project.category === itemType) {
          if (item.project.id === action.payload.id) {
            return count + newQuantity
          }
          return count + item.quantity
        }
        return count
      }, 0)
      
      if (currentTypeCount > MAX_SAME_TYPE_ITEMS) {
        // Don't update if it would exceed the same type limit
        return state
      }
      
      const newItems = state.items.map(item =>
        item.project.id === action.payload.id
          ? { ...item, quantity: newQuantity }
          : item
      )

      const total = newItems.reduce((sum, item) => sum + (getProductPrice(item.project) * item.quantity), 0)
      return { items: newItems, total }
    }

    case 'CLEAR_CART':
      return { items: [], total: 0 }

    case 'LOAD_CART': {
      const total = action.payload.reduce((sum, item) => sum + (getProductPrice(item.project) * item.quantity), 0)
      return { items: action.payload, total }
    }

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (project: Project | Product) => { success: boolean; error?: string }
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => { success: boolean; error?: string }
  clearCart: () => void
  getCartLimits: () => { totalItems: number; maxTotalItems: number; typeCounts: Record<string, number>; maxSameType: number }
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })
  const { user } = useBuilduniaAuth();
  const router = useRouter();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const requireAuth = () => {
    if (!user) {
      router.push('/auth/signin')
      return false
    }
    return true
  }

  const getCartLimits = () => {
    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
    const typeCounts: Record<string, number> = {}
    
    state.items.forEach(item => {
      const type = item.project.category || 'unknown'
      typeCounts[type] = (typeCounts[type] || 0) + item.quantity
    })
    
    return {
      totalItems,
      maxTotalItems: MAX_TOTAL_ITEMS,
      typeCounts,
      maxSameType: MAX_SAME_TYPE_ITEMS
    }
  }

  const addItem = (project: Project | Product) => {
    if (!requireAuth()) {
      return { success: false, error: 'Please sign in to add items to cart' }
    }

    const limits = getCartLimits()
    const itemType = project.category || 'unknown'
    
    // Check total items limit
    if (limits.totalItems >= MAX_TOTAL_ITEMS) {
      return { 
        success: false, 
        error: `Maximum ${MAX_TOTAL_ITEMS} items allowed in cart. Please remove some items first.` 
      }
    }
    
    // Check same type limit
    const currentTypeCount = limits.typeCounts[itemType] || 0
    if (currentTypeCount >= MAX_SAME_TYPE_ITEMS) {
      return { 
        success: false, 
        error: `Maximum ${MAX_SAME_TYPE_ITEMS} items of type "${itemType}" allowed. Please remove some ${itemType} items first.` 
      }
    }
    
    dispatch({ type: 'ADD_ITEM', payload: project })
    return { success: true }
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return { success: true }
    }
    
    const limits = getCartLimits()
    const targetItem = state.items.find(item => item.project.id === id)
    
    if (!targetItem) {
      return { success: false, error: 'Item not found in cart' }
    }
    
    // Calculate new totals
    const newTotalItems = limits.totalItems - targetItem.quantity + quantity
    const itemType = targetItem.project.category || 'unknown'
    const newTypeCount = (limits.typeCounts[itemType] || 0) - targetItem.quantity + quantity
    
    // Check total items limit
    if (newTotalItems > MAX_TOTAL_ITEMS) {
      return { 
        success: false, 
        error: `Maximum ${MAX_TOTAL_ITEMS} items allowed in cart.` 
      }
    }
    
    // Check same type limit
    if (newTypeCount > MAX_SAME_TYPE_ITEMS) {
      return { 
        success: false, 
        error: `Maximum ${MAX_SAME_TYPE_ITEMS} items of type "${itemType}" allowed.` 
      }
    }
    
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    return { success: true }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getCartLimits
    }}>
      {children}
    </CartContext.Provider>
  )
}
