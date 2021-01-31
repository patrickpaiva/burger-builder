import React from 'react'

import Button from '../../UI/Button/Button'

const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(item => {
            return <li key={item}><span style={{textTransform: 'capitalize'}}>{item}</span>: {props.ingredients[item]}</li>
        })
    
    return (
        <>
            <h3>Your Order</h3>
            <p>A delicius burger with the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price: {props.price.toFixed(2)}</strong></p>
            <p>Continue to Checktout?</p>
            <Button
                btnType="Danger"
                clicked={props.purchaseCancelled}
            >CANCEL</Button>
            <Button
                btnType="Success"
                clicked={props.purchaseContinued}
            >CONTINUE</Button>
        </>
    )
}

export default orderSummary