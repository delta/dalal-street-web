import * as React from "react";
import { Metadata } from "grpc-web-client";

export interface TimerState {
  minutes : number
  seconds: number
}

export class Timer extends React.Component<{}, TimerState> {
  constructor(props: TimerState) {
    super(props);

        this.state= {
        minutes: 1,
        seconds: 0,
    }
  }

    componentDidMount() {
        let intervalId = setInterval(() => {
            const { seconds, minutes } = this.state

            if (seconds > 0) {
                this.setState(({ seconds:number }) => ({
                    seconds: seconds - 1
                }))
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    //clearInterval(intervalId)
                } else {
                    this.setState(({ minutes: minutes }) => ({
                        minutes: minutes - 1,
                        seconds: 59
                    }))
                }
            }
        }, 1000)
    }

    componentWillUnmount() {
        //clearInterval(this.myInterval)
    }

    render() {
        const { minutes, seconds } = this.state
        return (
            <div>
                { minutes === 0 && seconds === 0
                    ? <strong>Click on resend OTP</strong>
                    : <strong>Resend OTP in: 0{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</strong>
                }
            </div>
        )
    }
}
