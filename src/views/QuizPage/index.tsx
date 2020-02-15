import React from "react"
import { RouteComponentProps, Redirect } from "react-router"
import { observer } from "mobx-react"
import { AbortableRequest } from "libs/requestWrap"

import "styles/views/quiz-page"

import Question from "views/QuizPage/components/Question"
import Header from "components/Header"

import UserStore from "stores/UserStore"
import QuestStore from "stores/QuestionsStore"

import { getQuizData } from "api/getQuizData"
import { finishQuiz } from "api/initQuiz"
import { answerRequest } from "api/answerData"
import { ResponseQuizData, RequestAnswerData } from "typings/API"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export interface QuizPageProps extends RouteComponentProps<any> {}

export interface QuizPageState {}

@observer
export default
class QuizPage
extends React.Component<QuizPageProps, QuizPageState> {
    redirect: boolean = false

    request: AbortableRequest<ResponseQuizData>

    componentDidMount () {
        if (!this.redirect) {
            (this.request = getQuizData())
                .run()
                .then(res => {
                    QuestStore.setQuizData(res)
                })
                .catch(err => {
                    if (err.status){
                        alert("Something goes wrong with test, please contact us")
                    }
                })
        }
    }

    componentWillUnmount () {
        this.request && this.request.abort()
    }

    submitAnswer = (data: RequestAnswerData): Promise<any> => {
        return answerRequest().run(data)
            .catch(() => {})
    }

    handleSubmit = (formData: { radio_test: string }) => {
        var { answeredIdList } = QuestStore
        var { currentQuestion } = QuestStore
        var data: RequestAnswerData = {
            question_id: currentQuestion && currentQuestion.question_id,
            variant_id: formData.radio_test
        }
        QuestStore.addAnsweredId(data.question_id)
        this.submitAnswer(data).finally(() => {
            if(answeredIdList.length >= QuestStore.quiz.questions.length) {
                this.autoSubmit()
            }
        })
    }

    autoSubmit = () => {
        finishQuiz()
            .run({
                action: "finished"
            })
            .catch(() => {
            })
            .finally(() => {
                UserStore.finishCurrQuiz()
            })
    }

    render() {
        if (!UserStore.isAuthorized) {
            this.redirect = true
            return <Redirect to="/" />
        }

        if (!UserStore.currentQuiz) {
            this.redirect = true
            return <Redirect to="/info-page" />
        }

        return !QuestStore.ready
            ? <main className="v-questions-page">
                <div className="container">
                    <div className="loading">
                        Loading&nbsp;
                        <FontAwesomeIcon icon={faSpinner} spin />
                    </div>
                </div>
            </main>
            : <>
                <Header 
                    progressBar={true}
                    timer={true}
                    onTimeUp={this.autoSubmit}
                />
                <main className="v-questions-page">
                    {QuestStore.currentQuestion
                        ? <div className="container">
                            <Question 
                                key={QuestStore.currentQuestion.question_id}
                                onSubmit={this.handleSubmit}
                            />
                        </div>
                        : <main className="v-questions-page">
                            <div className="container">
                                <div className="loading">
                                    Loading &nbsp;
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                </div>
                            </div>
                        </main>
                    }
                </main>
            </> 
    }
}