import React from "react"
import Superagent from "superagent"

import "styles/views/pages/formPage"

import Input from "components/Forms/Inputs/Input"
import InputSelect from "components/Forms/Inputs/InputSelect"
import InputFile from "components/Forms/Inputs/InputFile"
import Form from "components/Forms/Form"

import QuestStore from "stores/QuestionsStore"
import UserStore from "stores/UserStore"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { BASE_URL, LS_REFRESH_TOKEN, CANDIDATE_SOURCE } from "consts"
import { RouteComponentProps } from "react-router-dom"

export interface FormPageProps extends RouteComponentProps<any> {}

export interface FormPageState {
    loading: boolean,
    userExists: boolean,
    percent: number,
    errorMsg: string
}

export type InputNames = {
    fullName: string,
    email: string,
    phone: string,
    position: string,
    cv: string,
    source: string,
    experience: string
}

export default
class FormPage
extends React.Component<FormPageProps, FormPageState> {
    names: InputNames = {
        fullName: "Full Name",
        email: "EmailAddress",
        phone: "PhoneNumber",
        position: "Position",
        cv: "CV",
        source: "source",
        experience: "experience"
    }

    state = {
        loading: false,
        userExists: false,
        percent: undefined as number,
        errorMsg: undefined as string
    }

    handleSubmit = (data: FormData) : void => {
        this.setState({
            loading: true,
            userExists: false,
            errorMsg: undefined as string
        })

        Superagent
            .post(`${BASE_URL}/api/auth/sign-up`)
            .on("progress", event => {
                this.setState({
                    percent: event.percent
                })
            })
            .set({})
            .send(data)
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
                        })
                        .catch(() => {
                            UserStore.readyTest() 
                        })
                }
                
            })
            .catch(err => {
                if (err.status === 422) {
                    this.setState({
                        loading: false,
                        errorMsg: `CV size is more than 10Mb.`
                    })
                } else if (err.status === 409) {
                    this.setState({
                        loading: false,
                        errorMsg: "User is already exist"
                    })
                } else {
                    this.setState({
                        loading: false,
                        errorMsg: "Error, please reload the page or try again later"
                    })
                }
            })
            .finally(() => {
                this.setState({
                    percent: undefined as number
                })
            })
    }

    render() {
        var sourceValue = CANDIDATE_SOURCE

        if (this.props.location.search) {
            var pairs = this.props.location.search.replace(/^\?/, "").split("&")
            for (var pair of pairs) {
                var [ key, ...value ] = pair.split("=")
                if (key == "source") {
                    sourceValue = value.join("=")
                    break
                }
            }
        }

        var { percent } = this.state
        const {
            fullName,
            email,
            phone,
            position,
            cv,
            source,
            experience
        } = this.names
        const { loading, errorMsg } = this.state

        return <>
            <h3> The Ad Masters </h3>
            <div className="main-form-container">
                <h2 className="form-h2"> Enter Your Information: </h2>
                <p className="form-p"> Please verify or enter your personal information below: </p>
                <Form 
                    className="main-form"
                    onSubmit={this.handleSubmit}
                    inputNames={this.names}
                >
                    <div className="form-inp-wrap">
                        <Input
                            label="Full Name:"
                            name={fullName}
                            type='text'
                            required
                            placeholder="Please enter your full name"
                            pattern="[A-Za-z0-9][A-Za-z0-9-\s]*"
                            renderInvalidMessage={key => {
                                switch (key) {
                                    case "valueMissing":
                                        return "Please enter your first and last Name."
                                    case "patternMismatch":
                                        return "Please enter valid first and last Name."
                                    default:
                                        return key
                                }
                            }}
                        />
                    </div>
                    <div className="form-inp-wrap">
                        <Input
                            label="E-mail:"
                            name={email}
                            type="email"
                            required
                            placeholder="Your e-mail address"
                            renderInvalidMessage={key => {
                                switch (key) {
                                    case "valueMissing":
                                        return "Please enter your email address."
                                    case "typeMismatch":
                                    case "patternMismatch":
                                        return "Please enter valid email address."
                                    default:
                                        return key
                                }
                            }}
                        />
                    </div>
                    <div className="form-inp-wrap">
                        <Input
                            label="Phone number:"
                            name= {phone}
                            type='tel'
                            required
                            placeholder="Example: +380931234567"
                            pattern="^\+380(50|66|95|99|67|68|96|97|98|63|93|73|91|92|94|44)[0-9]{7}$"
                            renderInvalidMessage={key => {
                                switch (key) {
                                    case "valueMissing":
                                        return "Please enter your phone number."
                                    case "typeMismatch":
                                    case "patternMismatch":
                                        return "Not valid, example: +380931234567"
                                    default:
                                        return key
                                }
                            }}
                        />
                    </div>
                    <div className="form-inp-wrap">
                        <InputSelect
                            label="Choose your position:"
                            name={position}
                            type='text'
                            id="positions"
                            required
                            placeholder="Select one"
                            renderInvalidMessage={key => {
                                switch (key) {
                                    case "valueMissing":
                                        return "Please choose position."
                                    default:
                                        return key
                                }
                            }}
                            {...this.props}
                        />
                    </div>
                    <div className="form-inp-wrap">
                        <InputSelect
                            label="Your work experience:"
                            name={experience}
                            type="text"
                            id="experience"
                            required
                            placeholder="Select work experience"
                            renderInvalidMessage={key => {
                                switch (key) {
                                    case "valueMissing":
                                        return "Pleace choose experience."
                                    default: 
                                        return key
                                }
                            }}
                            {...this.props}
                        />
                    </div>
                    <div className="form-inp-wrap">
                        <InputFile
                            label="CV (file size should not exceed 10Mb) :"
                            name={cv}
                            accept=".png, .jpeg, .jpg, .doc, .docs, .pdf"
                            type="file"
                            // required
                            renderInvalidMessage={key => {
                                switch (key) {
                                    case "valueMissing":
                                        return "Please choose file to upload"
                                    default:
                                        return key
                                }
                            }}
                        />
                    </div>
                    {percent
                        ? <div className="progress-loading">
                            <div className="percent-number">
                                {Math.round(percent)}% 
                            </div>
                            <div className="loading-percentage">
                                <div 
                                    className="percentage"
                                    style={{
                                        width: `${Math.round(percent)}%`
                                    }}
                                />
                            </div>
                        </div>
                        : null
                    }
                    <div className="form-inp-bottom">
                        <div className="center">
                            <button 
                                className="f-form-btn"
                                type="submit"
                                disabled={loading}
                            >
                                {loading && 
                                    <span>
                                        <FontAwesomeIcon icon={faSpinner} spin />
                                        &nbsp;
                                    </span> 
                                }
                                Submit
                            </button>
                            {errorMsg &&
                                <p className="invalid">
                                    {errorMsg} 
                                </p>
                            }
                        </div>
                    </div>
                    <input 
                        type="hidden"
                        className="input-source"
                        name={source}
                        value={sourceValue}
                    />
                </Form>
            </div>
        </>
    }
}