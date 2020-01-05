import React, {Component} from 'react';
import {API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE} from '../../config';
import HeroImage from '../elements/HeroImage/HeroImage';
import SearchBar from '../elements/SearchBar/SearchBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import MovieThumb from '../elements/MovieThumb/MovieThumb';
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
        //saves us from unnecessary API calls if we've already fetched the movies before
        if(localStorage.getItem('HomeStateSave')) {
            const state = JSON.parse(localStorage.getItem('HomeStateSave'));
            this.setState({...state});
        } else {
            this.setState({loading: true});
            const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US$page=1`;
            this.fetchItems(endpoint);
        }
    }

    searchItems = (searchTerm) => {
        let endpoint = '';
        this.setState({
            movies: [],
            loading: true,
            searchTerm: searchTerm
        })

        if(searchTerm === "") {
            endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-Us&page=1`;
        } else {
            endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-Us&query=${searchTerm}`;
        }

        this.fetchItems(endpoint);
    }

    loadMoreItems = () => {
        //ES6 destructuring the state
        const {searchTerm, currentPage} = this.state;
        let endpoint = '';
        this.setState({loading: true});

        if(searchTerm === '') {
            //we're not searching so we should get the next page
            endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-Us&page=${currentPage + 1}`;
        } else {
            //we're doing search
            endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-Us&query=${searchTerm}&page=${currentPage + 1}`;
        }
        
        this.fetchItems(endpoint);
    }

    fetchItems = async endpoint => {
        //ES6 destructuring the state
        const {movies, heroImage, searchTerm} = this.state;
        try {
            //waiting until fetching is done before setting the state
            const result = await (await fetch(endpoint)).json();        
            this.setState({
                movies: [...movies, ...result.results],
                heroImage: heroImage || result.results[0],
                loading: false,
                currentPage: result.page,
                totalPages: result.total_pages
            }, () => { //local Storage, we store data as strings, when we're not searching
                if(searchTerm === ""){
                    localStorage.setItem('HomeStateSave', JSON.stringify(this.state));
                }
            });           
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    render() {
        //ES6 destructuring the state
        const {movies, heroImage, loading, currentPage, totalPages, searchTerm} = this.state;
        return (
            <div className="rmdb-home">
            {heroImage ? 
                <div>
                    <HeroImage
                        image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${heroImage.backdrop_path}`}
                        title={heroImage.original_title}
                        text={heroImage.overview}
                    />
                    <SearchBar callback={this.searchItems}/> 
                </div> : null }
                <div className="rmdb-home-grid">
                    <FourColGrid
                        header={searchTerm ? 'Search Result' : 'Popular Movies'}
                        loading={loading}
                    >
                        {movies.map ( (element, i) => {
                            return <MovieThumb
                                        key={i}
                                        clickable={true}
                                        image={element.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}` : './images/no_image.jpg'}
                                        movieId={element.id}
                                        movieName={element.original_title}
                                    />
                        })}
                    </FourColGrid>
                    {loading ? <Spinner/> : null}
                    {(currentPage <= totalPages && !loading) ? 
                        <LoadMoreBtn 
                            text="Load More" 
                            onClick={this.loadMoreItems}
                        /> : null }
                </div>
            </div>
        )
    }
}

export default Home;