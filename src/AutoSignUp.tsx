import React from "react"
import { RouteComponentProps, Redirect } from "react-router"
import { observer } from "mobx-react"
import Superagent from "superagent"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

import UserStore from "stores/UserStore"
import QuestStore from "stores/QuestionsStore"
import { BASE_URL, LS_REFRESH_TOKEN } from "consts"


export interface AutoSignUpProps extends RouteComponentProps<any> {}

export interface AutoSignUpState {}

@observer
export default
class AutoSignUp
extends React.Component<AutoSignUpProps, AutoSignUpState> {

    componentDidMount () {
        var hash = this.props.match.params.id
        Superagent
        .post(`${BASE_URL}/api/auth/auto-sign-up`)
				.set({})
				.send({
					hash
				})
				.then(res => {
					if(typeof localStorage != "undefined"){
						UserStore.setTokens(res.body)
						localStorage.setItem(LS_REFRESH_TOKEN, res.body.refresh_token)

						Superagent
							.get(`${BASE_URL}/api/candidates/identity`)
							.set({"Authorization": `Bearer ${UserStore.accessToken}`})
							.then( identityRes  => {
								UserStore.setCandidateData(identityRes.body)
								if (UserStore.nextQuiz){
									const currQuiz = UserStore.nextQuiz
									QuestStore.updateTimerSeconds(currQuiz.quiz_duration)
								}
								if (UserStore.currentQuiz){
									const currQuiz = UserStore.currentQuiz
									QuestStore.updateTimerSeconds(Math.round(currQuiz.quiz_duration - (identityRes.body.server_time - currQuiz.start_time)))
								}
							})
							.catch(() => {})
                            .finally(() => {
                                UserStore.readyTest()
                            })
					}
				})
				.catch (err => {
					console.warn(err)
				})
    }

    render() {
        return !UserStore.isAuthorized
            ? <>
                <main className="v-main-page main">
					<div className="container">
						<div className="loading">
							Loading &nbsp;
							<FontAwesomeIcon icon={faSpinner} spin />
						</div>
					</div>
				</main>
            </>
            : <Redirect to="/" />
    }
}