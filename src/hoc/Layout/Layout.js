import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import Aux from '../Auxi/Auxi'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

import classes from './Layout.module.css'

const Layout = ({children}) => {
    const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false)

    const { isAuthenticated } = useSelector(state => ({
        isAuthenticated: state.auth.token !== null
    }))

    const sideDrawerClosedHandler = () => {
        setSideDrawerIsVisible(false)
    }

    const sideDrawerToggleHandler = () => {
        setSideDrawerIsVisible(prevState => !prevState)
    }


    return (
        <Aux>
            <Toolbar
                isAuth={isAuthenticated}
                clicked={sideDrawerToggleHandler} />
            <SideDrawer
                isAuth={isAuthenticated}
                open={sideDrawerIsVisible} closed={sideDrawerClosedHandler} />
            <main className={classes.Content}>
                {children}
            </main>
        </Aux>

    )


}

export default Layout