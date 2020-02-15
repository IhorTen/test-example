import React from "react"

import { InputNames } from "views/Homepage/components/SingUpForm"

export interface FormProps {
    onSubmit?: (data: any) => void,
    className?: string,
    inputNames?: InputNames
}

export interface FormState { }

export default
class Form
extends React.Component<FormProps, FormState> {
    static defaultProps = {
        className: "",
        onSubmit: () => {}
    }

    handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault()
        var data = new FormData()

        try {
            [...event.currentTarget.elements].forEach((element: HTMLInputElement) => {
                switch(element.type) {
                    case "checkbox":
                    case "radio":
                        if (element.checked)
                            data[element.name] = element.value
                        break
                    case "file":
                        data.append(element.name, element.files[0])
                    default:
                        data.append(element.name, element.value)
                }
            })
            this.props.onSubmit(data)
        } catch (e) {
            console.log("Failed to gather data.", e)
        }
    }

    render() {
        return <>
            <form
                className = {this.props.className}
                onSubmit = {this.handleSubmit} 
            >
                {this.props.children}
            </form>
        </>
    }
}