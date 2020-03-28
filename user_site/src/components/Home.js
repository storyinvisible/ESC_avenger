import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';


import questions from '../questions.json';
import isEmpty from '../utils/is-empty';


class Play extends Component {
    constructor (props) {
        super(props);
        this.state = {
            questions,
            currentQuestion: {},
            nextQuestion: {},
            previousQuestion: {},
            answer: '',
            numberOfQuestions: 0,
            numberOfAnsweredQuestions: 0,
            currentQuestionIndex: 0,
            myChoice: 'lalal',
            firstName:"",
            lastName: "",
            nextButtonDisabled: false,
            previousButtonDisabled: true,
            previousRandomNumbers: [],
            time: {}
        };
        this.interval = null;

    }

    componentDidMount () {
        const { questions, currentQuestion, nextQuestion, previousQuestion } = this.state;
        this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion);
        this.startTimer();
    }

    componentWillUnmount () {
        clearInterval(this.interval);
    }

    displayQuestions = (questions = this.state.questions, currentQuestion, nextQuestion, previousQuestion) => {
        let { currentQuestionIndex } = this.state;   
        if (!isEmpty(this.state.questions)) {
            questions = this.state.questions;
            currentQuestion = questions[currentQuestionIndex];
            nextQuestion = questions[currentQuestionIndex + 1];
            previousQuestion = questions[currentQuestionIndex - 1];
            const answer = currentQuestion.answer;
            this.setState({
                currentQuestion,
                nextQuestion,
                previousQuestion,
                numberOfQuestions: questions.length,
                answer,
                previousRandomNumbers: []
            }, () => {
                this.showOptions();
                this.handleDisableButton();
            });
        }     
    };

    handleOptionClick = (e) => {

        const { state } = this;
        const playerStats = {
            numberOfQuestions: state.numberOfQuestions,
            myChoice: e.target.innerHTML.toLowerCase()
        };
        this.props.history.push('/quizSummary', playerStats);
    }

    handlePreviousButtonClick = () => {
        if (this.state.previousQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex - 1
            }), () => {
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            });
        }
    };



    showOptions = () => {
        const options = Array.from(document.querySelectorAll('.option'));

        options.forEach(option => {
            option.style.visibility = 'visible';
        });
    }

    startTimer = () => {
        const countDownTime = Date.now() + 180000;
        this.interval = setInterval(() => {
            const now = new Date();
            const distance = countDownTime - now;

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance < 0) {
                clearInterval(this.interval);
                this.setState({
                    time: {
                        minutes: 0,
                        seconds: 0
                    }
                }, () => {
                    this.endGame();
                });
            } else {
                this.setState({
                    time: {
                        minutes,
                        seconds,
                        distance
                    }
                });
            }
        }, 1000);
    }

    handleDisableButton = () => {
        if (this.state.previousQuestion === undefined || this.state.currentQuestionIndex === 0) {
            this.setState({
                previousButtonDisabled: true
            });
        } else {
            this.setState({
                previousButtonDisabled: false
            });
        }

        if (this.state.nextQuestion === undefined || this.state.currentQuestionIndex + 1 === this.state.numberOfQuestions) {
            this.setState({
                nextButtonDisabled: true
            });
        } else {
            this.setState({
                nextButtonDisabled: false
            });
        }
    }

    render () {
        const { 
            currentQuestion, 
            // currentQuestionIndex, 
            // fiftyFifty, 
            // hints, 
            // numberOfQuestions,
            // time 
        } = this.state;

        return (
            <Fragment>
                <Helmet><title>Quiz Page</title></Helmet>
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                        <i className="fa fa-user prefix"></i>
                    </span>
                </div>
                <input type="text" className="form-control" placeholder="please enter your first name" aria-label="please enter your first name" aria-describedby="basic-addon1" />
            </div>

            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon2">
                        <i className="fa fa-user prefix"></i>
                    </span>
                </div>
                <input type="text" className="form-control" placeholder="please enter your last name" aria-label="please enter your last name" aria-describedby="basic-addon2" />
            </div>

                
                <div className="questions">

                    <h5>{currentQuestion.question}</h5>
                    <div className="options-container">
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionA}</p>
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionB}</p>
                    </div>
                    <div className="options-container">
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionC}</p>
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionD}</p>
                    </div>

                    <div className="button-container">

                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Play;