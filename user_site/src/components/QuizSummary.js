import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
// import M from 'materialize-css';

class QuizSummary extends Component {
    constructor (props) {
        super(props);
        this.state = {
            myChoice: 'summary',
            firstName:"",
            lastName: ""
        };
    }

    componentDidMount () {
        const { state } = this.props.location;
        if (state) {


            this.setState({
                myChoice: state.myChoice

            });
        }
    }

    render () {
        const { state } = this.props.location;
        
        let stats

        if (state !== undefined) {
            stats = (
                <Fragment>

                    <div className="container stats">

                        <h2>Your Selection: {this.state.myChoice}</h2>

                    </div>
                    <section>
                        <ul>
                            <li>
                                <Link to ="/">start chat</Link>
                            </li>

                        </ul>
                    </section>
                </Fragment>
            );
        } else {
            stats = (
                <section>
                    <h1 className="no-stats">No Statistics Available</h1>
                    <ul>
                        <li>
                            <Link to ="/">Choose</Link>
                        </li>

                    </ul>
                </section>
            );
        }
        return (
            <Fragment>
                <Helmet><title>Quiz App - Summary</title></Helmet>
                <div className="quiz-summary">
                    {stats}
                </div>
            </Fragment>
        );
    }
}

export default QuizSummary;