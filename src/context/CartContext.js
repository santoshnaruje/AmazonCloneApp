import React from 'react'

const CartContext = React.createContext({
  cartList: [],
  addCartItem: () => {},
  deleteCartItem: () => {},
  incrementCartItem: () => {},
  decrementCartItem: () => {},
  removeAllItems: () => {},
})

export default CartContext
