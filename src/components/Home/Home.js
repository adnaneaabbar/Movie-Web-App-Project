import React, {Component} from 'react';
import {API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE} from '../../config';
import HeroImage from '../elements/HeroImage/HeroImage';
import SearchBar from '../elements/SearchBar/SearchBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
//import MovieThumb from '../elements/MovieThumb/MovieThumb';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn';
import Spinner from '../elements/Spinner/Spinner';
import './Home.css';

class Home extends Component {
    state = {
        movies: [],
        heroImage: null,
        loading: false,
        currentPage: 0,
        totalPages: 0,
        searchTerm: ''
    }

    componentDidMount() {
        this.setState({loading: true});
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US$page=1`;
        this.fetchItems(endpoint);
    }

    fetchItems = (endpoint) => {
        fetch(endpoint)
        .then(result => result.json())
        .then(result => {
            this.setState({
                //spread syntax
                movies: [...this.state.movies, ...result.results],
                //if the heroImage is not null it will return it, else it will fill it with the first movie in the API fetch
                heroImage: this.state.heroImage || result.results[0],
                loading: false,
                //from the returned object result from the API
                currentPage: result.page,
                totalPages: result.total_pages
            })
        })
    }

    render() {
        return (
            <div className="rmdb-home">
                <HeroImage/>
                <SearchBar/>
                <FourColGrid/>
                <Spinner/>
                <LoadMoreBtn/>
            </div>
        )
    }
}

export default Home;