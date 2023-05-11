import {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cartList: JSON.parse(localStorage.getItem('cartList')) || [],
    }
  }

  componentDidUpdate() {
    const {cartList} = this.state
    localStorage.setItem('cartList', JSON.stringify(cartList))
  }

  addCartItem = product => {
    const {cartList} = this.state
    const existingItemIndex = cartList.findIndex(item => item.id === product.id)

    if (existingItemIndex >= 0) {
      const existingItem = cartList[existingItemIndex]
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + product.quantity,
      }
      const updatedCartList = [
        ...cartList.slice(0, existingItemIndex),
        updatedItem,
        ...cartList.slice(existingItemIndex + 1),
      ]
      this.setState({cartList: updatedCartList})
      localStorage.setItem('cartList', JSON.stringify(updatedCartList))
    } else {
      const updatedCartList = [...cartList, product]
      this.setState({cartList: updatedCartList})
      localStorage.setItem('cartList', JSON.stringify(updatedCartList))
    }
  }

  deleteCartItem = product => {
    const {cartList} = this.state
    const updatedCartList = cartList.filter(item => item.id !== product)
    this.setState({cartList: updatedCartList})
    localStorage.setItem('cartList', JSON.stringify(updatedCartList))
  }

  incrementCartItem = product => {
    const {cartList} = this.state
    const updatedCartList = cartList.map(item =>
      item.id === product ? {...item, quantity: item.quantity + 1} : item,
    )
    this.setState({cartList: updatedCartList})
    localStorage.setItem('cartList', JSON.stringify(updatedCartList))
  }

  decrementCartItem = id => {
    const {cartList} = this.state
    const productObject = cartList.find(eachCartItem => eachCartItem.id === id)
    if (productObject.quantity > 1) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(eachCartItem => {
          if (id === eachCartItem.id) {
            const updatedQuantity = eachCartItem.quantity - 1
            return {...eachCartItem, quantity: updatedQuantity}
          }
          return eachCartItem
        }),
      }))
    } else {
      this.deleteCartItem(id)
    }
  }

  removeAllItems = () => {
    const updatedCartList = []
    this.setState({cartList: updatedCartList})
    localStorage.setItem('cartList', JSON.stringify(updatedCartList))
  }

  render() {
    const {cartList} = this.state

    return (
      <BrowserRouter>
        <CartContext.Provider
          value={{
            cartList,
            addCartItem: this.addCartItem,
            deleteCartItem: this.deleteCartItem,
            incrementCartItem: this.incrementCartItem,
            decrementCartItem: this.decrementCartItem,
            removeAllItems: this.removeAllItems,
          }}
        >
          <Switch>
            <Route exact path="/login" component={LoginForm} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/products" component={Products} />
            <ProtectedRoute
              exact
              path="/products/:id"
              component={ProductItemDetails}
            />
            <ProtectedRoute exact path="/cart" component={Cart} />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="not-found" />
          </Switch>
        </CartContext.Provider>
      </BrowserRouter>
    )
  }
}

export default App
