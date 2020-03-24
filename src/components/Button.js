import React from 'react'

const Button = ({onClickFunction, title, isEnabled}) => {
    return(
        <p
            className={(isEnabled)? 'button' : 'button-disabled'}
            onClick={(isEnabled)? onClickFunction : () => {}}
        >
            {title}
        </p>
    )
}

export default Button;