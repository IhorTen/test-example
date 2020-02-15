export type QuizData = {
    quiz_id: string,
    quiz_name?: string,
    quiz_description?: string,
    quiz_duration?: number,
    start_time?: number,
    finish_time?: number,
    status: "pending" | "started" | "finished"
}

export interface IdentityData  {
    server_time: number,
    email: string,
    full_name: string,
    candidate_quizzes:  QuizData[]
}

export type ResponseTokenData = {
    access_token: string,
    refresh_token: string
}

export type RequestQuizData = {
    action: string
}

export type ResponseVariantsData = {
    variant_id: string,
    variant_content: string
}

export type QuestionData = {
    question_id: string,
    question_name ?: string,
    question_content: string,
    variants: ResponseVariantsData []
}

export interface ResponseQuizData {
    quiz_name: string,
    questions: QuestionData []
}

export type RequestAnswerData = {
    question_id: string,
    variant_id: string,
}