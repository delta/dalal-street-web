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
                        <div id="pragyan-logo">
                            <img className="image" src="./public/src/images/pragyanlogo.png" />
                        </div>
                        <div id="text">
                        <h1>Dalal Street</h1>
                        <p>The stock market gaming engine</p>
                      </div>
                    </div>

                    <div id="main">

                        <header className="major container 75%">
                            <h3>I could calculate the motions of <br/>
                                the heavenly bodies, but not the <br/>
                                madness of the people. <br/>
                                - Sir Isaac Newton
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

                        <footer className="major container 75%">
                            <h1 style={{fontSize:"30px",marginLeft: "30px"}}>Media Sponsors</h1>
                            <img id="sponsors" style={{margin: "30px"}} src="./public/src/images/DSIJ Logo.png" alt="" />
                            <br/>
                            <img id="sponsors" style={{margin: "30px"}} src="./public/src/images/MyCaptain Logo.png" alt="" />
                            <br/>
                            <img id="sponsors" style={{margin: "30px"}} src="./public/src/images/The CEO Magazine.png" alt="" />
                            <br/>
                        </footer>

                    </div>

                    <div id="footer">
                        <div className="container 75%">

                            <header className="major last">
                                <h2>Questions or comments?</h2>
                            </header>

                            <p>Reach out to us on <a href="https://discord.gg/jrfEXT5M">the Dalal Forum</a></p>


                                &copy; Made with <span className="red">&hearts;</span> by <a href="https://delta.nitt.edu">Delta Force</a>


                        </div>
                    </div>

            </Fragment>
        );
    }
}
