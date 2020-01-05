import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import './Navigation.css';

const Navigation = ({movieName}) => {
    return (
        <div className="rmdb-navigation">
            <div className="rmdb-navigation-content">
                <Link to="/">
                    <p>Home</p>
                </Link>
                <p>/</p>
                <p>{movieName}</p>
            </div>
        </div>
    )
}

Navigation.propTypes = {
    movieName: PropTypes.string
}

export default Navigation;