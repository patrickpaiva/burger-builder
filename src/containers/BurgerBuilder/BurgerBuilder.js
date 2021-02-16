import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import WithErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index'
import axios from '../../axios-orders'


export const BurgerBuilder = ({history}) => {
    const [purchasing, setPurchasing] = useState(false)

    const {
        ings,
        price,
        error,
        isAuthenticated
    } = useSelector(state => ({
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }))

    const dispatch = useDispatch()
    const {
        onIngredientAdded,
        onIngredientRemoved,
        onInitIngredients,
        onPurchaseInit,
        onSetAuthRedirectPath
    } = {
        onIngredientAdded: useCallback((ingredientName) => dispatch(actions.addIngredient(ingredientName)), [dispatch]),
        onIngredientRemoved: useCallback((ingredientName) => dispatch(actions.removeIngredient(ingredientName)), [dispatch]),
        onInitIngredients: useCallback(() => dispatch(actions.initIngredients()), [dispatch]),
        onPurchaseInit: useCallback(() => dispatch(actions.purchaseInit()), [dispatch]),
        onSetAuthRedirectPath: useCallback((path) => dispatch(actions.setAuthRedirectPath(path)), [dispatch])
    }

    const updatePurchaseState = (ingredients) => {
        const sum = Object.values(ingredients)
            .reduce((accumulator, currentValue) => {
                return accumulator + currentValue
            }, 0)

        return sum > 0
    }

    const purchaseHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true)
        } else {
            onSetAuthRedirectPath('/checkout')
            history.push('/auth')
        }
    }
    
    const purchaseCancelHandler = () => {
        setPurchasing(false)
    }

    const purchaseContinueHandler = () => {
        onPurchaseInit()
        history.push('/checkout')
    }
    
    useEffect(() => {
        onInitIngredients()
    }, [onInitIngredients])

    const disableInfo = {
        ...ings
    }

    for (let key in disableInfo) {
        disableInfo[key] = disableInfo[key] <= 0
    }

    let orderSummary = null
    let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />

    if (ings) {
        burger = (
            <>
                <Burger ingredients={ings} />
                <BuildControls
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    disabled={disableInfo}
                    purchasable={updatePurchaseState(ings)}
                    ordered={purchaseHandler}
                    isAuth={isAuthenticated}
                    price={price}
                />
            </>
        )
        orderSummary = <OrderSummary
            ingredients={ings}
            price={price}
            purchaseCancelled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler}
        />
    }
    return (
        <>
            <Modal show={purchasing} modalClose={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </>
    )

}

export default WithErrorHandler(BurgerBuilder, axios)