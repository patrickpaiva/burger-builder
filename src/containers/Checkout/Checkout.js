import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import ContactData from './ContactData/ContactData'

const Checkout = (props) => {
    const { ings, purchased } = useSelector(state => ({
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }))
    const checkoutCancelledHandler = () => {
        props.history.goBack()
    }

    const checkoutContinuedHandler = () => {
        props.history.replace('/checkout/contact-data')
    }

    let summary = <Redirect to="/" />
    if (ings) {
        const purchasedRedirect = purchased ? <Redirect to='/' /> : null
        summary = (
            <>
                {purchasedRedirect}
                <CheckoutSummary
                    ingredients={ings}
                    CheckoutCancelled={checkoutCancelledHandler}
                    CheckoutContinued={checkoutContinuedHandler}
                />
                <Route
                    path={`${props.match.path}/contact-data`}
                    component={ContactData} />
            </>
        )
    }
    return (
        <div>
            {summary}
        </div>
    )

}


export default Checkout