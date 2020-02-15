import { RequestAnswerData } from "typings/API"
import RequestWrap from "libs/requestWrap";
import { BASE_URL } from "consts";
import UserStore from "stores/UserStore";

export const answerRequest = () =>  RequestWrap<RequestAnswerData>({
    url: BASE_URL,
    endpoint: `/api/candidates/quizzes/${UserStore.currentQuiz ? UserStore.currentQuiz.quiz_id : undefined}/answer`,
    method: "POST"
})