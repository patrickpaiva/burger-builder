import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import classes from './Auth.module.css'
import Spinner from '../../components/UI/Spinner/Spinner'
import { checkValidity } from '../../shared/utility'

import * as actions from '../../store/actions/index'

const initialControls = {
    email: {
        elementType: 'input',
        elementConfig: {
            type: 'email',
            placeholder: 'Your Email'
        },
        value: '',
        validation: {
            required: true,
            isEmail: true
        },
        valid: false,
        touched: false
    },
    password: {
        elementType: 'input',
        elementConfig: {
            type: 'password',
            placeholder: 'Password'
        },
        value: '',
        validation: {
            required: true,
            minLength: 6
        },
        valid: false,
        touched: false
    }
}

const Auth = () => {
    const [controls, setControls] = useState(initialControls)
    const [isSignup, setIsSignup] = useState(true)
    
    // Redux MapStateToProps converted to useSelector
    const { loading, error, isAuthenticated, buildingBurger, authRedirectPath } = useSelector(state => ({
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }))
    
    // Redux MapDispatchToProps converted to useDispatch
    const dispatch = useDispatch()
    const { onAuth, onSetAuthRedirectPath } = {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))

    }

    useEffect(() => {
        if (!buildingBurger && authRedirectPath !== '/') {
            onSetAuthRedirectPath()
        }
    }, [authRedirectPath, buildingBurger, onSetAuthRedirectPath])

    const inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...controls,
            [controlName]: {
                ...controls[controlName],
                value: event.target.value,
                valid: checkValidity(event.target.value, controls[controlName].validation),
                touched: true
            }
        }
        setControls(updatedControls)
    }

    const submitHandler = (event) => {
        event.preventDefault()
        onAuth(controls.email.value, controls.password.value, isSignup)
    }

    const switchAuthModeHandler = () => {
        setIsSignup(prevState => !prevState)
    }


    const formElementsArray = []
    for (let key in controls) {
        formElementsArray.push({
            id: key,
            config: controls[key]
        })
    }

    let form = formElementsArray.map(formElement => (
        <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => inputChangedHandler(event, formElement.id)}
        />
    ))

    if (loading) {
        form = <Spinner />
    }

    let errorMessage = null

    if (error) {
        errorMessage = (
            <p>{error.message}</p>
        )
    }
    let authRedirect = null
    if (isAuthenticated) {
        authRedirect = <Redirect to={authRedirectPath} />
    }
    return (
        <div className={classes.Auth}>
            {authRedirect}
            {errorMessage}
            <form onSubmit={(event) => submitHandler(event)}>
                {form}
                <Button btnType="Success">SUBMIT</Button>
            </form>
            <Button
                clicked={switchAuthModeHandler}
                btnType="Danger">SWITCH TO {isSignup ? 'SIGN IN' : 'SIGN UP'}</Button>
        </div>
    )

}

export default Auth