import React from "react"
import { Switch, Route } from "react-router-dom"

import Application from "./App"
import AutoSignUp from "./AutoSignUp"

export interface ProviderProps {}
export interface ProviderState {}

export default
class AppProvider
extends React.Component<ProviderProps, ProviderState> {
	render() {
		return (
			<Switch>
				<Route 
					path="/auto-sign-up/:id"
					exact
					component={AutoSignUp} 
				/>
				<Route 
					path="/"
					component={Application} 
				/>
			</Switch>
		)
	}
}