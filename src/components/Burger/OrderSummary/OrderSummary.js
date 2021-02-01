import React, { Component } from 'react'

import Button from '../../UI/Button/Button'

class orderSummary extends Component {
    // componentWillUpdate() {
    //     console.log('[OrderSummary.js] Will Update')
    // }
    render() {
        const ingredientSummary = Object.keys(this.props.ingredients)
            .map(item => {
                return <li key={item}><span style={{ textTransform: 'capitalize' }}>{item}</span>: {this.props.ingredients[item]}</li>
            })
        return (<>
            <h3>Your Order</h3>
            <p>A delicius burger with the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
            <p>Continue to Checktout?</p>
            <Button
                btnType="Danger"
                clicked={this.props.purchaseCancelled}
            >CANCEL</Button>
            <Button
                btnType="Success"
                clicked={this.props.purchaseContinued}
            >CONTINUE</Button>
        </>)
    }
}

export default orderSummary