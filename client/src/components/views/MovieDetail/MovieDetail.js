import React, { useEffect, useState } from 'react';
import {API_URL, API_KEY, IMAGE_BASE_URL} from '../../Config';
import MainImage from '../LandingPage/Sections/MainImage';
import MovieInfo from './Sections/MovieInfo';
import GridCards from '../commons/GridCards';
import { Row } from 'antd';
import Favorite from './Sections/Favorite';
import Comment from './Sections/Comment';
import LikeDislikes from './Sections/LikeDislikes';

function MovieDetail(props) {

    let movieId = props.match.params.movieId;
    const [Movie, setMovie] = useState([])
    const [Casts, setCasts] = useState([])
    const [ActorToggle, setActorToggle] = useState(false)
    const [CommentLists, setCommentLists] = useState([])
    const [LoadingForMovie, setLoadingForMovie] = useState(true)
    const [LoadingForCasts, setLoadingForCasts] = useState(true)

    useEffect(() => {

        let endpointCrew = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}` 
        
        let endpointInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}`

        fetch(endpointInfo)
            .then(response => response.json())
            .then(response => {
                console.log("1");
                setMovie(response);
            })

        fetch(endpointCrew)
            .then(response => response.json())
            .then(response => {
                setCasts(response.cast)
            })

    }, [])

    // 버튼 on / off
    const toggleActorView = () => {
        setActorToggle(!ActorToggle)
    }
    
    const fetchDetailInfo = (endpoint) => {

        fetch(endpoint)
            .then(result => result.json())
            .then(result => {
                console.log(result)
                setMovie(result)
                setLoadingForMovie(false)

                let endpointForCasts = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
                fetch(endpointForCasts)
                    .then(result => result.json())
                    .then(result => {
                        console.log(result)
                        setCasts(result.cast)
                    })

                setLoadingForCasts(false)
            })
            .catch(error => console.error('Error:', error)
            )
    }

    const updateComment = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }

    return (
        <div>
            {/* Header */}
            <MainImage image={`${IMAGE_BASE_URL}w1280${Movie.backdrop_path}`}
                    title={Movie.original_title}
                    text={Movie.overview}
                    />

            {/* Boad */}
            <div style={{ width : '85%', margin: '1rem auto'}}>

                <div style={{display:'flex', justifyContent: 'flex-end'}}>
                    <Favorite movieInfo={Movie} movieid={movieId} userFrom={localStorage.getItem('userId')} />
                </div>


                {/* Movie Info */}
                <MovieInfo 
                    movie = {Movie}
                />

                <br />
                {/* Actors Grid */}

                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem'}}>
                    <button onClick={toggleActorView}> Toggle Actor View</button>

                </div>

                {ActorToggle &&
                    <Row gutter={[16,16]}>
                        {Casts && Casts.map((cast, index) => (
                            <React.Fragment key = {index}>
                                <GridCards 
                                    image = {cast.profile_path ?
                                    `${IMAGE_BASE_URL}w500${cast.profile_path}` : null}
                                    characterName = {cast.name}
                                />
                            </React.Fragment>
                        ))}
                    </Row>
                
                }


            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <LikeDislikes video videoId={movieId} userId={localStorage.getItem('userId')} />
                </div>

                {/* Comments */}
                <Comment movieTitle={Movie.original_title} CommentLists={CommentLists} postId={movieId} refreshFunction={updateComment} />
            
        </div>
    )
}

export default MovieDetail
