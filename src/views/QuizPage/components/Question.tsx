import React from "react"

import "styles/components/question.sass"

import QuestionsStore from "stores/QuestionsStore"

import Form from "components/Forms/Form"

export interface QuestionProps {
    onSubmit?: (formData: { radio_test: string }) => void
}

export interface QuestionState {
    error: boolean
}

export default
class Question
extends React.Component<QuestionProps, QuestionState> {
    state = {
        error: false
    }

    handleInvalid = (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault()
        this.setState({
            error: true
        })
    }

    handleChange =() => {
        this.setState({
            error: false
        })
    }

    render() {

        var currQuest = QuestionsStore.currentQuestion

        return currQuest
            ? <Form 
                className="quest-form-wrap"
                onSubmit={this.props.onSubmit}
            >
                <div className="question">
                <div className="quest-title">
                    <p dangerouslySetInnerHTML={{__html: currQuest.question_content}} />
                    {this.state.error
                        ? <p className="invalid"> 
                            Вы должны ответить на вопрос для продолжения 
                        </p>
                        : null
                    }
                </div>
                {currQuest.variants.map((variant, i) => {
                    return (
                        <div 
                            className="answer-wrap"
                            key={i}
                        >
                            <input 
                                type="radio"
                                name={`radio_test`}
                                data-name={i}
                                value={variant.variant_id}
                                id={`radio${i}`}
                                className="radio-btn"
                                required
                                onInvalid={this.handleInvalid}
                                onChange= {this.handleChange}
                            />
                            <label 
                                htmlFor={`radio${i}`} 
                                className="answer-text"
                            >
                                <div className="custom-check"></div>
                                <div dangerouslySetInnerHTML={{__html: variant.variant_content}} />
                            </label>
                        </div>
                    )
                })} 
                </div>
                <button className="quest-btn submit" type="submit">
                    Submit answer
                </button>
            </Form>
        : null
    }
}