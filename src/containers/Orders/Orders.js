import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import axios from '../../axios-orders'
import Order from '../../components/Order/Order'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index'
import Spinner from '../../components/UI/Spinner/Spinner'

const Orders = () => {
    const { orders, loading, token, userId } = useSelector(state => ({
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }))

    const dispatch = useDispatch()
    const onFetchOrders = useCallback((token, userId) => dispatch(actions.fetchOrders(token, userId)), [dispatch])

    useEffect(() => {
        onFetchOrders(token, userId)
    }, [onFetchOrders, token, userId])

    let ordersList = <Spinner />
    if (!loading) {
        ordersList = (
            orders.map(order => (
                <Order
                    key={order.id}
                    ingredients={order.ingredients}
                    price={+order.price}
                />
            ))
        )
    }
    return (
        <div>
            {ordersList}
        </div>
    )

}

export default withErrorHandler(Orders, axios)