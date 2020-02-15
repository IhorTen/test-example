import React from "react"
import { RouteComponentProps, Redirect } from "react-router"
import { observer } from "mobx-react"

import "styles/views/homepage"

import SingUpForm from "views/Homepage/components/SingUpForm"
import UserStore from "stores/UserStore"

export interface HomepageProps extends RouteComponentProps<any> {}

export interface HomepageState { };

@observer
export default
class Homepage
extends React.Component<HomepageProps, HomepageState> {
    render() {
        return !UserStore.isAuthorized 
            ?<>
                <main className="v-main-page">
                    <div className="container">
                        <div className="logo">
                            <img src="" alt=""/>
                        </div>
                        <SingUpForm {...this.props}/>
                    </div>
                </main>
            </>
            : <Redirect to ="/info-page"/>
    }
}