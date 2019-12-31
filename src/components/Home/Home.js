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

    searchItems = (searchTerm) => {
        let endpoint = '';
        this.setState({
            movies: [],
            loading: true,
            searchTerm: searchTerm
        })

        if(searchTerm === '') {
            endpoint = `${API_URL}movie/popular?api_key${API_URL}&language=en-Us&page=1`;
        } else {
            endpoint = `${API_URL}movie/popular?api_key${API_URL}&language=en-Us&query${searchTerm}`;
        }

        this.fetchItems(endpoint);
    }

    loadMoreItems = () => {
        let endpoint = '';
        this.setState({loading: true});

        if(this.state.searchTerm === '') {
            //we're not searching so we should get the next page
            endpoint = `${API_URL}movie/popular?api_key${API_URL}&language=en-Us&page=${this.state.currentPage++}`;
        } else {
            //we're doing search
            endpoint = `${API_URL}movie/popular?api_key${API_URL}&language=en-Us&query${this.state.searchTerm}&page=${this.state.currentPage++}`;
        }
        
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
            {this.state.heroImage ? 
                <div>
                    <HeroImage
                        image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${this.state.heroImage.backdrop_path}`}
                        title={this.state.heroImage.original_title}
                        text={this.state.heroImage.overview}
                    />
                    <SearchBar/> 
                </div> : null }
                <FourColGrid/>
                <Spinner/>
                <LoadMoreBtn/>
            </div>
        )
    }
}

export default Home;