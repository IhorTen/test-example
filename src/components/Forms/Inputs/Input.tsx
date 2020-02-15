import React from "react"

import "styles/components/input"

export type InputType = "text" | "email" | "file" | "tel"

export type InvalidKey = keyof ValidityState

export interface InputProps {
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

export interface InputState {
    invalid: InvalidKey | void,
    value: string | number,
}

export default
class Input
extends React.Component<InputProps, InputState> {
    static defaultProps = {
        type: "text",
        required: false,
        defaultValue: "",
        renderInvalidMessage: (key: InvalidKey) => key
    }

    state = {
        invalid: undefined as InvalidKey,
        value: this.props.defaultValue,
    }

    static getInvalidKey = (validity: ValidityState): InvalidKey | void => {
		var invalidKey: InvalidKey
		for (invalidKey in validity) {
			if (invalidKey != "valid" && validity[invalidKey])
				break
		}
		return invalidKey
	}

	handleInvalid = (event: React.FormEvent<HTMLInputElement>) => {
		event.preventDefault()
		this.setState({
			invalid: Input.getInvalidKey(event.currentTarget.validity)
		})
	}

	handleChange = (event: React.FormEvent<HTMLInputElement>) => {
		this.setState({
			value: event.currentTarget.value,
			invalid: undefined
		})
	}

    render() {
        var {value, invalid} = this.state
        var filled = !!value
        return <>
            <div className={`f-input ${
                filled ? "filled" : "" } ${
                invalid ? "invalid" : ""
            }`}>
                {this.props.label &&
                    <label htmlFor={this.props.name}>
                        {this.props.label}
                    </label>
                }
                <div className="f-input-wrap">
                    <input
                        className={this.props.className} 
                        id={this.props.name}
                        name={this.props.name}
                        required={this.props.required}
                        accept={this.props.accept}
                        placeholder={this.props.placeholder}
                        pattern={this.props.pattern}
                        type={this.props.type}
                        value={value}
                        onChange={this.handleChange}
                        onInvalid={this.handleInvalid}
                        autoComplete= "off"
                    />
                </div>
                {invalid && 
                    <p className="invalid">
                        {this.props.renderInvalidMessage(invalid)}
                    </p>
                }
            </div>
        </>
    }
}