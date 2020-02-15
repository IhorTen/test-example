import React from "react"
import { RouteComponentProps, Redirect} from "react-router"
import { observer } from "mobx-react"

import "styles/views/thank-you"

import UserStore from "stores/UserStore"

export interface ThankYouProps extends RouteComponentProps<any> {}

export interface ThankYouState {}

@observer
export default
class ThankYou
extends React.Component<ThankYouProps, ThankYouState> {
    render() {
        if (!UserStore.isAuthorized) {
            return <Redirect to="/" />
        }

        if (UserStore.currentQuiz) {
            return <Redirect to="/questions" />
        }

        let { nextQuiz } = UserStore

        return nextQuiz
            ? <Redirect to="/info-page" />
            : <>
                <main className="v-thankyou">
                    <div className="container">
                        <div className="thank-block">
                            <div className="thank-logo">
                                <img 
                                    src="/static/images/logo.svg" 
                                    alt="logo"
                                />
                            </div>
                            <h1 className="thank-title">Thank You!</h1>
                            <p className="thank-descr">
                                Your test answers were submitted.
                            </p>
                        </div>
                    </div>
                </main>
            </>
    }
}