import React from "react"
import { observer } from "mobx-react";
import { RouteComponentProps, Redirect } from "react-router"

import "styles/views/infoPage"
import "styles/components/modal"

import Modal from "components/Modal"
import UserStore from "stores/UserStore"
import { initQuiz } from "api/initQuiz"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export interface InfoPage1Props extends RouteComponentProps<any> {}

export interface InfoPage1State {
    openModal: boolean,
    loading: boolean,
    error: boolean
}

@observer
export default
class InfoPage1
extends React.Component<InfoPage1Props, InfoPage1State> {
    state = {
        openModal: false,
        loading: false,
        error: false
    }

    instructions: string[] = [
        "The Ad Masters&trade; Cognitive Aptitude Assessment contains 50 questions that must be completed in 15 minutes. Most people do not succeed in solving all of the questions within this time frame, but try to be as quick as you can and provide the maximum number of correct answers as possible. Using a calculator or any other external device is forbidden, but make sure you have some scratch paper and a pen or a pencil to assist you in your calculations. You can complete the assessment anytime but are limited to one attempt and duplicate applications will be ignored.",
        "Tips:",
        "Do not spend too much time on any one question. Skipping difficult questions is allowed. If you find yourself stuck, guess! Guessing does not take off points and it's certainly better than leaving a question unanswered. Pay attention to the answer choices! Sometimes ruling out unreasonable answers can prove to be an efficient problem solving strategy. Be aware that the questions increase in difficulty throughout the assessment. Once you finish, a member of our team will review your application package and reach out to set up an onsite interview if we believe you will be a great fit. The Ad Masters&trade; is aggressively hiring and will consider your application for all available vacancies during our candidate evaluation process.",
        "We wish you the best of luck!",
        "The Ad Masters."
    ]

    handleClick = () => {
        this.setState({
            openModal: true,
            error: false
        })
    }

    startTest = () => {
        this.setState({
            loading: true
        })

        initQuiz()
            .run({
                action: "started"
            })
            .then(() => {
                UserStore.initNextQuiz()
            })
            .catch(err => {
                if (err.status){
                    this.setState({
                        error: true
                    })
                }
            })
    }

    render() {

        if (!UserStore.isAuthorized) {
            return <Redirect to="/" />
        }

        if (UserStore.currentQuiz) {
            return <Redirect to="/questions" />
        }

        if (!UserStore.nextQuiz) {
            return <Redirect to="/thankyou" />
        }
        
        const { openModal, loading, error } = this.state
        const { nextQuiz } = UserStore

        return <>
            {<div className="info-pages-container container">
                {openModal
                    ? <Modal
                        onClose={() => {
                            this.setState({
                                openModal: false
                            })
                        }}
                    >
                        <div className="instruction-text">
                            <p>
                                Your time will begin as soon as you click the "Begin Test" button.
                            </p>
                        </div>
                        <div className="continue-test">
                            <button
                                id="continue-btn"
                                className="button-test"
                                onClick={this.startTest}
                                disabled = {loading}
                            >
                                { loading && 
                                    <span>
                                        <FontAwesomeIcon icon={faSpinner} spin />
                                        &nbsp;
                                    </span> 
                                }
                                Begin Test
                            </button>
                        </div>
                    </Modal>
                    : null
                }
                <h2 className="instuction-head">
                    TheAdMasters&trade;&nbsp;
                    {nextQuiz ? nextQuiz.quiz_name : "Cognitive Aptitude Assessment"}
                </h2>
                <div className="instruction-text">
                    {this.instructions.map((instruction, i) => {
                        return (
                            <p 
                                key={i}
                                dangerouslySetInnerHTML={{
                                    __html: instruction
                                }}
                            />
                        )
                    })}
                </div>
                <div className="continue-test">
                    <button
                        id="continue-btn"
                        className="button-test"
                        onClick={this.handleClick}
                    >
                        Continue
                    </button>
                    {error &&
                        <p className="invalid"> 
                            Error! Please reload the page 
                        </p>
                    }
                </div>
            </div>
            }
        </>
    }
}