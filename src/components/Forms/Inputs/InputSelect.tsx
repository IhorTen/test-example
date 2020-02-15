import React from "react"
import superagent from "superagent"

import "styles/components/input-select"

import Input from "components/Forms/Inputs/Input"

import { BASE_URL } from "consts/index"
import UserStore from "stores/UserStore"
import { RouteComponentProps, Redirect } from "react-router-dom"

export type InvalidKey = keyof ValidityState

export type SelectList = {
    id?: string,
    name: string,
}

export const workExperience: SelectList[] = [
    { name: "<1 year" },
    { name: "1-3 years" },
    { name: "3-5 years" },
    { name: "5+ years" }
]

export interface InputSelectProps extends RouteComponentProps<any>{
    type?: "text",
    id: "positions" | "experience"
    label?: string,
    name?: string,
    required?: boolean,
    placeholder?: string,
    defaultValue?: string,
    renderInvalidMessage?: (key: InvalidKey) => React.ReactNode
}

export interface InputSelectState {
    position: string,
    invalid: InvalidKey | void | "Please try again later or reload the page",
    focused: boolean,
    selectList: SelectList[]
}

// export type SelectPosition = string[]

export default
class InputSelect
extends React.Component<InputSelectProps, InputSelectState> {

    static defaultProps = {
        type: "text",
        name: "",
        required: false,
        placeholder: "",
        defaultValue: "Select one",
        renderInvalidMessage: (key: InvalidKey) => key,
    }

    state = {
        position: "",
        invalid: undefined as InvalidKey,
        focused: false,
        selectList: [] as SelectList[]
    }

    request = superagent
        .get(`${BASE_URL}/api/positions/`)

    componentDidMount () {
        if(!UserStore.isAuthorized){
            if( this.props.id == "positions"){
                this.request
                    .send({})
                    .then((res ) => {
                        this.setState({
                            selectList: res.body
                        })
                    })
                    .catch(() => {
                        this.setState({
                            invalid: "Please try again later or reload the page"
                        })
                    })
            } else {
                this.setState({
                    selectList: workExperience
                })
            }
        }
    }

    componentWillUnmount () {
        this.request.abort()
    }

    handleInvalid = (event: React.FormEvent<HTMLSelectElement>) => {
		event.preventDefault()
		this.setState({
			invalid: Input.getInvalidKey(event.currentTarget.validity)
		})
    }
    
    handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.setState({
            position: event.currentTarget.value,
            invalid: undefined
        })
    }

    render() {
        const {invalid, position} = this.state
        
        return <>
            <div className={`f-input-select ${
                !!position ? "valid" : "" } ${
                invalid? "invalid" : ""
            }`}>
                {this.props.label &&
                    <label htmlFor={this.props.name}>
                        {this.props.label}
                    </label>
                }
                <br/>
                <select 
                    name={this.props.name} 
                    id={this.props.name}
                    required={this.props.required}
                    defaultValue={this.props.defaultValue}
                    onChange= {this.handleChange}
                    onInvalid={this.handleInvalid}
                >
                    <option value=""> 
                        {this.props.placeholder}
                    </option>
                    {this.state.selectList
                        ? this.state.selectList.map((pos, i) => {
                            return <option 
                                value={pos.name}
                                key={i}
                            >
                                {pos.name}
                            </option> 
                        })
                        : <option value="Loading">
                            Loading...
                        </option> 
                        
                    }
                </select>
                {invalid && 
                    <p className="invalid">
                        {this.props.renderInvalidMessage(invalid)}
                    </p>
                }
            </div>
        </>
    }
}