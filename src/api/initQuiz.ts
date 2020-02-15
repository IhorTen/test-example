import {  RequestQuizData } from "typings/API"
import RequestWrap from "libs/requestWrap"
import { BASE_URL } from "consts"
import UserStore from "stores/UserStore"

export const initQuiz = () => RequestWrap<RequestQuizData>({
    url: BASE_URL,
    endpoint: `/api/candidates/quizzes/${UserStore.nextQuiz ? UserStore.nextQuiz.quiz_id : undefined}`,
    method: "POST"
})

export const finishQuiz = () => RequestWrap<RequestQuizData>({
    url: BASE_URL,
    endpoint: `/api/candidates/quizzes/${UserStore.currentQuiz ? UserStore.currentQuiz.quiz_id : undefined}`,
    method: "POST"
})