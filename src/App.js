import React, { useEffect, Suspense, useCallback } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import Layout from './hoc/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
import Logout from './containers/Logout/Logout'
import * as actions from './store/actions/index'

const Checkout = React.lazy(() => {
  return import('./containers/Checkout/Checkout')
})

const Orders = React.lazy(() => {
  return import('./containers/Orders/Orders')
})

const Auth = React.lazy(() => {
  return import('./containers/Auth/Auth')
})

const App = () => {
  const {isAuthenticated} = useSelector(state => ({
    isAuthenticated: state.auth.token !== null
  }))

  const dispatch = useDispatch()
  const onTryAutoSignup = useCallback(() => dispatch(actions.authCheckState()), [dispatch])

  useEffect(() => {
    onTryAutoSignup()
  }, [onTryAutoSignup])

  let routes = (
    <>
      <Route path="/auth" exact render={(props) => <Auth {...props} />} />
      <Route path="/" exact component={BurgerBuilder} />
      <Redirect to="/" />
    </>
  )

  if (isAuthenticated) {
    routes = (
      <>
        <Route path="/checkout" render={(props) => <Checkout {...props} />} />
        <Route path="/orders" exact render={(props) => <Orders {...props} />} />
        <Route path="/logout" exact component={Logout} />
        <Route path="/auth" exact render={(props) => <Auth {...props} />} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </>
    )
  }
  return (
    <div>
      <Layout>
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            {routes}
          </Switch>

        </Suspense>
      </Layout>
    </div>
  )

}


export default App