import React, { Component }  from 'react';
import {connect} from "react-redux";
import {  Col, Form, FormGroup, FormControl, ControlLabel, Button, Glyphicon, Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import { Image } from 'react-bootstrap'
import { withRouter } from "react-router-dom";
import {fetchMovie} from "../actions/movieActions";
import {submitReview} from "../actions/reviewActions";
//support routing by creating a new component

class Movie extends Component {
    constructor(props) {
        super(props);
        this.updateReview = this.updateReview.bind(this);
        this.postReview = this.postReview.bind(this);

        this.state = {
            details: {
                title: this.props.selectedMovie.title,
                reviewerName: localStorage.getItem("username"),
                quote: '',
                rateing: 0
            }
        };
    }

    updateReview(event) {
        let updateReview = Object.assign({}, this.state.details);

        updateReview[event.target.id] = event.target.value;
        this.setState({
            details: updateReview
        });
    }

    postReview() {
        const {dispatch} = this.props;
        dispatch(submitReview(this.state.details))
            .then(
                () => {
                    this.props.history.push('/');
                });
    }


    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null) {
            dispatch(fetchMovie(this.props.title));
        }
    }

    render() {
        const ActorInfo = ({actors}) => {
            return actors.map((actor, i) =>
                <p key={i}>
                    <b>{actor.actorName}</b> {actor.characterName}
                </p>
            )
        };

        const ReviewInfo = ({reviews}) => {
            return reviews.map((review, i) =>
                <p key={i}>
                    <b>{review.reviewerName}</b> {review.quote}
                    <Glyphicon glyph={'star'}/> {review.rateing}
                </p>
            )
        };
        // inspired from login form




        const DetailInfo = ({currentMovie}) => {
            if (!currentMovie) { //if not could still be fetching the movie
                return <div>Loading...</div>;
            }
            return (
              <Panel>
                  <Panel.Heading>Movie Detail</Panel.Heading>
                  <Panel.Body><Image className="image" src={currentMovie.imageURL} thumbnail /></Panel.Body>
                  <ListGroup>
                      <ListGroupItem>{currentMovie.title}</ListGroupItem>
                      <ListGroupItem><ActorInfo actors={currentMovie.actors} /></ListGroupItem>
                      <ListGroupItem><h4><Glyphicon glyph={'star'}/> {currentMovie.avgRating} </h4></ListGroupItem>
                  </ListGroup>
                  <Panel.Body><ReviewInfo reviews={currentMovie.movieReviews} /></Panel.Body>
              </Panel>
            );
        };

        return (
            <div>
            <DetailInfo currentMovie={this.props.selectedMovie} />

            <Form horizontal key="reviewForm">

                    <FormGroup controlId="quote">
                        <Col componentClass={ControlLabel} sm={2}>
                            Review
                        </Col>
                        <Col sm={9}>
                            <FormControl onChange={this.updateReview.bind(this)} value={this.state.details.quote} type="text" placeholder="Review:" />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="rateing" >
                        <Col componentClass={ControlLabel} sm={2}>
                            Rating (0-5)
                        </Col>
                        <Col sm={9}>
                            <FormControl key="ratingFormControl" onChange={this.updateReview.bind(this)} value={this.state.details.rateing} type="Number" min="0" max="5" />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="title">
                        <FormControl type="hidden" value={this.props.selectedMovie.title} onLoad={this.updateReview} />
                    </FormGroup>

                    <FormGroup controlId="reviewerName">
                        <FormControl type="hidden" value={localStorage.getItem("username")} onLoad={this.updateReview} />
                    </FormGroup>

                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <Button onClick={this.postReview}>Post Review</Button>
                        </Col>
                    </FormGroup>
                </Form>

            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(ownProps);
    return {
        selectedMovie: state.movie.selectedMovie,
        title: ownProps.match.params.title
    }
};

export default withRouter(connect(mapStateToProps)(Movie));