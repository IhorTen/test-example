import React from "react"
import { RouteComponentProps, Switch, Route } from "react-router-dom"
import { observer } from "mobx-react"
import Superagent from "superagent"

import "styles/main"
import "styles/universal"

import NotFound from "views/NotFound"
import Homepage from "views/Homepage"
import InfoPage from "views/InfoPage"
import QuizPage from "views/QuizPage"
import Thankyou from "views/Thankyou"

import UserStore from "stores/UserStore"
import QuestStore from "stores/QuestionsStore"

import { identity } from "api/identity"
import { IdentityData } from "typings/API"


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { BASE_URL, LS_REFRESH_TOKEN } from "consts"

export interface ApplicationProps extends RouteComponentProps<any> {}

export interface ApplicationState {}

@observer
export default
class Application
extends React.Component<ApplicationProps, ApplicationState> {
	componentDidMount () {
		
		identity()
				.run()
				.then((res: IdentityData)=> {
					UserStore.setCandidateData(res)
					if (UserStore.currentQuiz){
						const currQuiz = UserStore.currentQuiz
						QuestStore.updateTimerSeconds(Math.round(currQuiz.quiz_duration - (res.server_time - currQuiz.start_time)))
					}
				})
				.catch(() => { })
				.finally(() => {
					UserStore.readyTest()
				})
	}

	render() {
		return !UserStore.isReady
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
			: <>
				<Switch>
					<Route path="/" exact component={Homepage} />
					<Route path="/info-page" exact component={InfoPage} />
					<Route path="/questions" exact component={QuizPage} />
					<Route path="/thankyou" exact component={Thankyou} />
					<Route component={NotFound} />
				</Switch>
			</>
	}
}