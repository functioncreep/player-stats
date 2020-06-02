import React from 'react';
import './LoadingSpinner.scss';

function LoadingSpinner(props) {
    const spinnerStyle = {
        display: props.loading ? 'block' : 'none',
        top: props.top,
        bottom: props.bottom,
        left: props.left,
        right: props.right
    }
    return (
        <span
            style={spinnerStyle}
            className="icon loading-spinner"
        >
            <i className="fas fa-spinner fa-2x fa-pulse"></i>
        </span>
    )
}

export default LoadingSpinner;