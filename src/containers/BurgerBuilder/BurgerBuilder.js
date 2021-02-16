import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import WithErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index'
import axios from '../../axios-orders'


export const BurgerBuilder = ({onInitIngredients, ...props}) => {
    const [purchasing, setPurchasing] = useState(false)

    const updatePurchaseState = (ingredients) => {
        const sum = Object.values(ingredients)
            .reduce((accumulator, currentValue) => {
                return accumulator + currentValue
            }, 0)

        return sum > 0
    }

    const purchaseHandler = () => {
        if (props.isAuthenticated) {
            setPurchasing(true)
        } else {
            props.onSetAuthRedirectPath('/checkout')
            props.history.push('/auth')
        }
    }
    
    const purchaseCancelHandler = () => {
        setPurchasing(false)
    }

    const purchaseContinueHandler = () => {
        props.onPurchaseInit()
        props.history.push('/checkout')
    }
    
    useEffect(() => {
        onInitIngredients()
    }, [onInitIngredients])

    const disableInfo = {
        ...props.ings
    }

    for (let key in disableInfo) {
        disableInfo[key] = disableInfo[key] <= 0
    }

    let orderSummary = null
    let burger = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

    if (props.ings) {
        burger = (
            <>
                <Burger ingredients={props.ings} />
                <BuildControls
                    ingredientAdded={props.onIngredientAdded}
                    ingredientRemoved={props.onIngredientRemoved}
                    disabled={disableInfo}
                    purchasable={updatePurchaseState(props.ings)}
                    ordered={purchaseHandler}
                    isAuth={props.isAuthenticated}
                    price={props.price}
                />
            </>
        )
        orderSummary = <OrderSummary
            ingredients={props.ings}
            price={props.price}
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

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingredientName) => dispatch(actions.addIngredient(ingredientName)),
        onIngredientRemoved: (ingredientName) => dispatch(actions.removeIngredient(ingredientName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onPurchaseInit: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(BurgerBuilder, axios))