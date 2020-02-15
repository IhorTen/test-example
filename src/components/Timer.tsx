import React from "react"

import "styles/components/timer.sass"
import QuestStore from "stores/QuestionsStore"

export interface TimerProps {
    onTimeUp?: () => void
}

export interface TimerState {
    seconds: number
}

export default
class Timer
extends React.Component<TimerProps, TimerState> {
    static defaultProps = {
        onTimeUp: () => {}
    }

    constructor(props: TimerProps) {
        super(props)
        this.state = {
            seconds: QuestStore.timerSeconds
        }
    }

    interval: number

    componentDidMount() {
        this.interval = window.setInterval(() => {
            var { seconds } = this.state
            if (seconds <= 0) {
                clearInterval(this.interval)
                this.props.onTimeUp()
            } else {
                var nextSeconds = seconds - 1
                this.setState({
                    seconds: nextSeconds
                })
            }
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        let { seconds } = this.state
        let secs = seconds % 60
        let min = (seconds / 60) | 0
        
        return <>
            <span className="timer">
                {min < 10 ? "0"+min : min}:
                {secs < 10 ? "0"+secs : secs}
            </span>
        </>
    }
}