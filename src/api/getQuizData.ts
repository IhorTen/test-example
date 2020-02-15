import { ResponseQuizData } from "typings/API"
import RequestWrap from "libs/requestWrap"
import { BASE_URL } from "consts"
import UserStore from "stores/UserStore"

export const getQuizData = () => RequestWrap<ResponseQuizData>({
    url: BASE_URL,
    endpoint: `/api/quizzes/${UserStore.currentQuiz ? UserStore.currentQuiz.quiz_id : undefined}`,
    method: "GET"
})