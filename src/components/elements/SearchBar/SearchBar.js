import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import './SearchBar.css';

//controlled component, taking control of the input field 
class SearchBar extends Component {
    state = {
        value: '' //input field
    }

    timeout = null;

    doSearch = (event) => {
        //ES6 destructuring props
        const {callback} = this.props;

        this.setState({value: event.target.value}); //value from input field
        clearTimeout(this.timeout); //clear old timeout
        //assign new timeout
        this.timeout = setTimeout( () => {
            callback(false, this.state.value); //send value searched for
        }, 500); //every half a second we show results
    }

    render() {
        //ES6 destructuring state
        const {value} = this.state;

        return (
            <div className="rmdb-searchbar">
                <div className="rmdb-searchbar-content">
                    <FontAwesome className ="rmdb-fa-search" name="search" size="2x"/>
                    <input
                        type="text"
                        className="rmdb-searchbar-input"
                        placeholder="Search.."
                        onChange={this.doSearch}
                        value={value}
                    />
                </div>
            </div>
        )
    }
}

export default SearchBar;