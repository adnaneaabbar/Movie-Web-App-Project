import React from 'react';
import PropTypes from 'prop-types';
import './LoadMoreBtn.css';

const LoadMoreBtn = (props) => {
    return (
        <div className="rmdb-loadmorebtn" onClick={props.onClick}>
            <p>{props.text}</p>
        </div>
    )
}

LoadMoreBtn.propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string
}

export default LoadMoreBtn;
