import React from "react"
import Input from "components/Forms/Inputs/Input"

import "styles/components/input-file"

export type InputType = "file"

export type InvalidKey = keyof ValidityState

export interface InputFileProps {
    type?: InputType,
    name?: string,
    accept?: string,
    required?: boolean,
    pattern?: string,
    defaultValue?: string | number,
    placeholder?: string,
    label?: React.ReactNode,
    className?: string
    renderInvalidMessage?: (key: InvalidKey) => React.ReactNode
}

export interface InputFileState {
    invalid: InvalidKey | void,
    value: any
}

export default
class InputFile
extends React.Component<InputFileProps, InputFileState> {
    static defaultProps ={
        type: "file",
        required: false,
        defaultValue: "",
        renderInvalidMessage: (key: InvalidKey) => key
    }

    state = {
        invalid: undefined as InvalidKey,
        value: undefined as any,
    }

    handleInvalid = (event: React.FormEvent<HTMLInputElement>) => {
        var input = event.currentTarget
        event.preventDefault()
        this.setState({
            invalid: Input.getInvalidKey(input.validity)
        })
    }

    handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        var input = event.currentTarget
        if (input.files.length > 0){
            this.setState({
                value: event.currentTarget.value,
                invalid: undefined
            })
        }
    }

    render() {
        var { value, invalid } = this.state
        var filled = !!value
        var filename = value ? value.replace(/^.*\\/, "") : null
        return <>
            <div className={`f-input-file f-input ${
                filled ? "filled" : "" } ${
                invalid ? "invalid" : ""
            }`} >
                {this.props.label &&
                    <label htmlFor={this.props.name}>
                        {this.props.label}
                    </label>
                }
                <div>
                    <span className="f-upload-btn">
                        Upload a file
                        <input 
                            type={this.props.type}
                            style={{
                                display: "block"
                            }}
                            accept={this.props.accept}
                            className="input-file-hidden"
                            id={this.props.name}
                            name={this.props.name}
                            required={this.props.required}
                            onInvalid={this.handleInvalid}
                            onChange={this.handleChange}
                        />
                    </span>
                    <span className="f-upload-name">
                        {filename}
                    </span>
                </div>
            </div>
        </>
    }
}