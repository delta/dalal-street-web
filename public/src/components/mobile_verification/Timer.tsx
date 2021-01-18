import * as React from "react";
import { grpc } from "@improbable-eng/grpc-web";

export interface TimerState {
  minutes : number
  seconds: number
  resetStatus: boolean
}

export interface TimerProps{
    handleResendOtpCallback: () => void
    resetTimer: boolean
}

export class Timer extends React.Component<TimerProps, TimerState> {
  constructor(props: TimerProps) {
    super(props);

        this.state= {
        minutes: 1,
        seconds: 0,
        resetStatus: true
    }
  }

  timer = () => {
    let intervalId = setInterval(() => {
        const { seconds, minutes } = this.state

        if (seconds > 0) {
            this.setState(({ seconds:number }) => ({
                seconds: seconds - 1
            }))
        }
        if (seconds === 0) {
            if (minutes === 0) {
                this.props.handleResendOtpCallback();
                this.setState({
                    minutes: minutes,
                    seconds: seconds
                })
                clearInterval(intervalId);
            } else {
                this.setState(({ minutes: minutes }) => ({
                    minutes: minutes - 1,
                    seconds: 59
                }))
            }
        }
    }, 1000)
  }

  componentWillReceiveProps(){

        if(this.props.resetTimer && this.state.resetStatus){
            this.setState( {
                minutes: 1,
                seconds: 0,
            })
            this.timer();
        }
        this.setState((prevState) => {
            return{
                resetStatus: !prevState.resetStatus
            }
        })
    
    }

    componentWillUnmount() {
        // clearInterval(this.timer)
    }

    render() {
        const { minutes, seconds } = this.state
        return (
            <div>
                { minutes === 0 && seconds === 0
                    ? <strong>Resend OTP</strong>
                    : <strong>Resend OTP in: 0{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</strong>
                }
            </div>
        )
    }
}
