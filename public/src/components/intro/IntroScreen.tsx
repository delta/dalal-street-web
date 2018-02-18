import * as React from "react";
import { Fragment } from "react";

export class IntroScreen extends React.Component<{}, {}> {
    render() {
        return (
            <Fragment>
                    <div id="header">
                        <div className="row button-row">
                                <a href="/login" className="intro-button intro">Login</a>
                                <a href="/register" className="intro-button intro">Sign Up</a>
                        </div>
                        <span id="pragyan-logo">
                            <img className="image" src="./public/src/images/pragyanlogo.png" />
                        </span>
                        <h1>Dalal Street</h1>
                        <p>The stock market gaming engine</p>
                    </div>
        
                    <div id="main">
        
                        <header className="major container 75%">
                            <h3>If stock market experts were so expert,<br/>
                                they would be buying stock, not selling advice.<br/>
                                - Norman Ralph Augustine
                            </h3>
                        </header>
        
                        <div className="box alt container">
                            <section className="feature left">
                                <a className="image"><img src="./public/src/images/pic01.png" alt="" /></a>
                                <div className="content">
                                    <h3>About The Game</h3>
                                    <p className="p-text">
                                    Dalal Street is an online virtual stock exchange.
                                    The game will run for 7 days and your goal is to
                                    maximise your profit. Once you login, please read our 
                                    <strong> Getting Started </strong> section on the Help Page
                                    before playing the game.
                                    </p>
                                </div>
                            </section>
                        </div>
        
        
                        <footer className="major container 75%">
                            <h3>New to stock markets?</h3>
                            <p className="p-text">Don't worry. We've got a list of resouces to get you
                            started, along with documentation on how to play the game.
                            So grit your teeth, take calculated risks under pressure and
                            become the richest man on the market</p>
                            <ul className="actions">
                                <li><a href="/register" className="intro-button">Get Started</a></li>
                            </ul>
                        </footer>
        
                    </div>
        
                    <div id="footer">
                        <div className="container 75%">
        
                            <header className="major last">
                                <h2>Questions or comments?</h2>
                            </header>
        
                            <p>Reach out to us on <a href="https://pragyan.org">Pragyan</a></p>
        
                            <ul className="copyright">
                                <li>&copy; Made with &hearts; by <a href="https://delta.nitt.edu">Delta Force</a></li>
                            </ul>
        
                        </div>
                    </div>
        
            </Fragment>
        );
    }
}