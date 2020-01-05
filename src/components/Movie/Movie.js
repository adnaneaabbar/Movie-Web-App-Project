import React, {Component} from 'react';
import {API_URL , API_KEY} from '../../config';
import Navigation from '../elements/Navigation/Navigation';
import MovieInfo from '../elements/MovieInfo/MovieInfo';
import MovieInfoBar from '../elements/MovieInfoBar/MovieInfoBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import Actor from '../elements/Actor/Actor';
import Spinner from '../elements/Spinner/Spinner';
import './Movie.css';

class Movie extends Component {
    state = {
        movie: null,
        actors: null,
        directors: [],
        loading: false
    }

    componentDidMount() {
        //saves us from unnecessary API calls if we've already visited the page
        if(localStorage.getItem(`${this.props.match.params.movieId}`)) {
            const state = JSON.parse(localStorage.getItem(`${this.props.match.params.movieId}`));
            this.setState({...state});
        } else {
            this.setState({loading: true});
            //first fetch the movie...
            const endpoint = `${API_URL}movie/${this.props.match.params.movieId}?api_key=${API_KEY}&language=en-US`;
            this.fetchItems(endpoint);
        }
    }

    fetchItems = (endpoint) => {
        fetch(endpoint)
        .then(result => result.json())
        .then(result => {
            
            if(result.status_code) {
                this.setState({loading: false});
            } else {
                this.setState({movie: result}, () => {
                    //fetching actors and directors in the callback of setState
                    const endpoint = `${API_URL}movie/${this.props.match.params.movieId}/credits?api_key=${API_KEY}&language=en-US`;
                    fetch(endpoint)
                    .then(result => result.json())
                    .then(result => {
                        const directors = result.crew.filter( (member) => member.job === "Director");

                        this.setState({
                            actors: result.cast,
                            directors: directors,
                            loading: false
                        }, () => { //local Storage, we store data as strings, when we're not searching
                            localStorage.setItem(`${this.props.match.params.movieId}`, JSON.stringify(this.state));
                        })
                    })
                })
            }
        })
        .catch(error => console.error('Error:', error))
    }

    render() {
        //ES6 destructuring the state
        const {movie, directors, actors, loading} = this.state;
        return (
            <div className="rmdb-movie">
                {movie ?
                    <div>
                        <Navigation movieName={this.props.location.movieName}/>
                        <MovieInfo movie={movie} directors={directors}/>
                        <MovieInfoBar time={movie.runtime} budget={movie.budget} revenue={movie.revenue}/>
                    </div> : null }
                {actors ?
                    <div className="rmdb-movie-grid">
                        <FourColGrid header={'Actors'}>
                            {actors.map( (element, i) => {
                                return <Actor key={i} actor={element}/>
                            })}
                        </FourColGrid>
                    </div> : null }
                {!actors && !loading ? <h1>No Movie Found!</h1> : null}
                {loading ? <Spinner/> : null}
            </div>
        )
    }
}

export default Movie;