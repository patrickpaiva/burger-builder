import React from 'react'

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
            <p>Continue to Checktout?</p>
        </>
    )
}

export default orderSummary