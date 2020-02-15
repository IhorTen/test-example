import React from "react"
import { observer } from "mobx-react"

import "styles/components/header"

import Progress from "./Progress"
import Timer from "./Timer"

export interface HeaderProps {
    progressBar?: boolean,
    timer?: boolean,
    onTimeUp?: () => void
}

export interface HeaderState { }

@observer
export default
class Header
extends React.Component<HeaderProps, HeaderState> {

    static defaultProps = {
        progressBar: false,
        timer: false,
        onTimeUp: () => {}
    }

    render() {
        return <>
            <header className="main-head">
                <div className="container">
                    <div className="head-flex">
                        <div className="head-logo">
                            <img 
                                src="/static/images/logo.svg" 
                                alt="logo"
                            />
                        </div>
                        {this.props.timer &&
                            <Timer
                                onTimeUp={this.props.onTimeUp}
                            />
                        }
                    </div>
                    {this.props.progressBar &&
                        <Progress />
                    }
                </div>
            </header>
        </>
    }
}