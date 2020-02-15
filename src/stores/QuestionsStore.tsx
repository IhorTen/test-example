import { observable, action, computed, autorun, toJS } from "mobx"
import { ResponseQuizData, QuestionData } from "typings/API"
import { LS_ANSWERED_QUESTIONS } from "consts"

class QuestionsStore {
	@observable timerSeconds: number
    @observable quiz: ResponseQuizData
    @observable answeredIdList: string[] = []

    constructor () {
        if (typeof localStorage != "undefined") {

            var restored: string[]

            try {
                restored = JSON.parse(localStorage.getItem(LS_ANSWERED_QUESTIONS))
                
                if (!Array.isArray(restored))
                    throw new Error()

                if (restored.some(value => typeof value != "string"))
                    throw new Error()
            } catch (e) {
                restored = []
            }

            this.refreshAnsweredIdList(restored)

            this.saveAnswered = autorun(this.saveAnswered)
        }
    }
    
    /**
     * Get information if is any data in quiz
     * @returns {boolean}
     */
    @computed
	get ready(): boolean {
		return !!this.quiz
    }
    
    /**
     * Returns questionData depending on it`s ID
     * @returns {QuestionData | undefined}
     */
    @computed
    get currentQuestion(): QuestionData | void {
        return this.quiz.questions.find(quest => !this.answeredIdList.includes(quest.question_id))
    }

    /**
     * Re-write list of answered questions ID
     * @param {string[]} arr list of answered ID
     */
    @action
    refreshAnsweredIdList = (arr: string[]) => {
        this.answeredIdList = arr
    }

    /**
     * Push new answered question ID
     * @param {string} id answered question ID
     */
    @action
    addAnsweredId = (id: string) => {
        this.answeredIdList.push(id)
    }
    
    /**
     * Set time, that left to ending the test
     * @param {number} seconds 
     */
    @action
	updateTimerSeconds = (seconds: number) => {
		this.timerSeconds = seconds
    }
     /**
      * Set quiz data with all questions
      * @param {ResponseQuizData} data 
      */
    @action
	setQuizData = (data: ResponseQuizData) => {
		this.quiz = data
    }

    saveAnswered = () => {
		if(typeof localStorage != "undefined"){
            localStorage.setItem(LS_ANSWERED_QUESTIONS, JSON.stringify(toJS(this.answeredIdList)))
		}
	}
}

export default new QuestionsStore()