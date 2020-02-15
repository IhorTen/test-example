import React from "react"
import { observer } from "mobx-react"

import "styles/components/progress"

import QuestStore from "stores/QuestionsStore"

export interface ProgressProps {}

export interface ProgressState {}

@observer
export default
class Progress
extends React.Component<ProgressProps, ProgressState> {     

    render() {
        var { quiz, answeredIdList } = QuestStore
        var questLength = quiz.questions.length
        var answLength = answeredIdList.length

        return <>
            <div className="progress-wrap">
                <div className="progressbar">
                    <div 
                        className="progress"
                        style={{
                            width: `${100 / questLength * (answLength)}%`
                        }}
                    ></div>
                </div>
                <div className="progress-questions">
                    <span> Question </span>
                    <span>{ answLength > questLength - 1 ? questLength : ++answLength } / {questLength}</span>
                </div>
            </div>
        </>
    }
}