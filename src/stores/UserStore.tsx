import { observable, action, computed, autorun, toJS } from "mobx"

import QuestStore from "stores/QuestionsStore"
import { ResponseTokenData, IdentityData, QuizData } from "typings/API"
import { LS_REFRESH_TOKEN, LS_ACCESS_TOKEN, LS_ANSWERED_QUESTIONS } from "consts"

export type CurrTestStatus = "pending" | "started" | "finished"

class UserStore {

    @observable accessToken: string
	@observable refreshToken: string
	@observable candidateData: IdentityData
	@observable isReady: boolean = false
	@observable positionList: string[]
	
	constructor () {
		if (typeof localStorage != "undefined") {
			this.setTokens({
				access_token: localStorage.getItem(LS_ACCESS_TOKEN),
				refresh_token: localStorage.getItem(LS_REFRESH_TOKEN)
			})
			this.setAccessTokenLS = autorun(this.setAccessTokenLS)
		}
	}

	@computed
	get currentQuiz(): QuizData | void {
		return this.candidateData.candidate_quizzes.find(quiz => quiz.status == "started")
	}
	
	@computed
	get nextQuiz(): QuizData | void {
		return this.candidateData.candidate_quizzes.find(quiz => quiz.status == "pending")
	}

	@computed
	get isAuthorized(): boolean {
		return !!this.candidateData
	}

    @action
    setTokens = (res: ResponseTokenData) => {
        this.accessToken = res.access_token
        this.refreshToken = res.refresh_token
	}

	@action
	setAccessToken = (access_token: string) => {
		this.accessToken = access_token
	}

	@action
	setCandidateData = (data: IdentityData) => {
		this.candidateData = data
	}

    @action
	readyTest = () => {
		this.isReady = true
	}

	@action
	logout = () => {
		this.accessToken = undefined
		this.refreshToken = undefined
		QuestStore.refreshAnsweredIdList([])
		localStorage.removeItem(LS_ACCESS_TOKEN)
		localStorage.removeItem(LS_REFRESH_TOKEN)
	}

	setAccessTokenLS = () => {
		if(typeof localStorage != "undefined"){
			localStorage.setItem(LS_ACCESS_TOKEN, toJS(this.accessToken))
		}
	}

	@action
	initNextQuiz = () => {
		var nextQuiz = this.nextQuiz
		if (nextQuiz){
			nextQuiz.status = "started"
			QuestStore.updateTimerSeconds(nextQuiz.quiz_duration)
		}
	}

	@action
	finishCurrQuiz = () => {
		var currQuiz = this.currentQuiz
		if (currQuiz){
			currQuiz.status = "finished"
		}
		localStorage.setItem(LS_ANSWERED_QUESTIONS, JSON.stringify([]))
		QuestStore.refreshAnsweredIdList([])
	}
}

export default new UserStore()