import * as React from "react";
import { Notification } from "../common/Notification";
import {Notification as Notification_pb } from "../../../proto_build/models/Notification_pb";
import { Fragment } from "react";

export interface HelpProps {
    notifications: Notification_pb[]
}
export class Help extends React.Component<HelpProps,{}> {
    render() {
        return (

            <Fragment>
                <div className="row" id="top_bar">
                    <div id="notif-component">
                            <Notification notifications={this.props.notifications} icon={"open envelope icon"} />
                    </div>
                </div>

                <div id="help-container" className="ui stackable grid pusher main-container">
                    <div className="row">
                        <h2 className="ui center aligned icon header inverted">
                            <i className="help icon"></i>                        
                            <div className="content">
                                Help
                                <div className="grey sub header">
                                    Need some assistance?
                                </div>
                            </div>
                        </h2>
                    </div>

                    <div className="row">
                        <h1 className="ui header"><a id="Help_0"></a>Help</h1>
                        <p>Welcome to Dalal Street! We know that there’s a lot to take in, so we’ve prepared this help page to get you started and to answer some FAQs as well.</p>
                        <h3 className="ui header"><a id="Getting_Started_3"></a>Getting Started</h3>
                        <h5 className="ui header"><a id="The_Objective_5"></a>The Objective</h5>
                        <p>Each player begins the game with ₹20,000. Your objective is to use this money to maximise your profit at the end of 7 days.</p>
                        <h5 className="ui header"><a id="How_do_I_make_money_8"></a>How do I make money?</h5>
                        <p>These are the two ways to make money :-</p>
                        <ul>
                            <li>Buying stocks at low prices and selling them at higher prices.</li>
                            <li>Short selling stocks and then buying them back for a lower price.</li>
                        </ul>
                        <p>Please note that you can only place orders when the market is open (8PM-12AM IST).</p>
                        <p><em>If you’re unsure of what short selling means, check out our FAQ section at the bottom of this page</em></p>
                        <h5 className="ui header"><a id="The_Basics_17"></a>The Basics</h5>
                        <p>There are a total of 5 companies trading publicly on the Dalal Street Exchange. To know more about each company, check out the <strong>Companies Page</strong>, which is shown in the image below. On this page, you’ll find a short description about each company as well as its latest stock price information.</p>
                        <p><img src="Dalal_Companies_Page.png" alt="Company Image" /></p>
                        <p>Please note that the companies on the Dalal Street Exchange are <strong>in no way related to their real world counterparts</strong>. The stock prices and news articles released in this game are entirely fictitious and will NOT be affected by real world events.</p>
                        <p>Before the game begins, all stocks will be held by the exchange (a.k.a <em>Primary Market</em>). As soon as the market opens on Day 1, the stocks will be open for all of the players to buy. Buying stocks from the exchange can be done from the <strong>Markets Page</strong>, as shown below. This page also displays the number of stocks left in the <em>exchange</em>.</p>
                        <p><img src="Dalal_Market_Available.png" alt="Market Image" /></p>
                        <p>We also recommend that you pay close attention to the <strong>News Page</strong>. This page will constantly be updated with articles about company news, scandals, rumours, or even political developments. You will receive a notification in your inbox every time a new story is published, as well as a notification on your phone if you’re using the Dalal Street Android App. Staying connected with story developments could help give you the edge over other players as this is the best way to predict the future performance of a company.</p>
                        <h5 className="ui header"><a id="Buying_and_Selling_Stocks_30"></a>Buying and Selling Stocks</h5>
                        <p>All trading related tasks are performed on the <strong>Trading Page</strong>, which is shown in the image below.</p>
                        <p><img src="Dalal_Trading_Page.png" alt="Trading Image" /></p>
                        <p>Lets walk through all the elements of this page.</p>
                        <p><strong>At the top of the page</strong> is a dropdown you can use to select which company’s trading information is displayed.</p>
                        <p><strong>On the top left is the Order Book</strong> - The Market Depth lists all <em>open</em> buy and sell orders. This includes orders issued by <em>all players</em>. By observing the Market Depth, you can see the prices at which other players are placing the orders and judge the current mood of the market. The Trading History displays all the transactions that have been executed for the company you’ve chosen.</p>
                        <p><strong>On the bottom left is where you place your orders</strong> - There are 3 different types of orders you can place - Market, Limit and Stoploss. Once your orders are placed, we will match the order based on a <em>best match</em> algorithm and you will receive a notification once your order has been filled.</p>
                        <p><strong>On the bottom right is a list of all your open orders</strong> - These are orders that you have placed but have not been filled yet. After you place an order, the order will appear here until it is successfully filled.</p>
                        <p><strong>On the top right is the Price Chart</strong> - This shows the stock price of the selected company over time. You can analyse the data with different time intervals by using the dropdown above the chart.</p>
                        <p>Once you’ve bought some stocks, you can check all the stocks you own as well as your <em>Net Worth</em> on the <strong>Portfolios Page</strong>, as shown in the image below. This page will also give you a list of all of your executed transactions.</p>
                        <p><img src="Dalal_Portfolio_Page.png" alt="Portfolio Image" /></p>
                        <p>Hopefully, this should be enough to get you going and start trading! If you still have some questions, please read our FAQ section below where we address some more common doubts that players may have.</p>
                        <h3 className="ui header"><a id="FAQs_53"></a>FAQs</h3>
                        <h5 className="ui header"><a id="What_is_this_short_selling_you_speak_of_55"></a>What is this short selling you speak of?</h5>
                        <p>While you will <em>buy</em> a company’s stock if you expect its price to go up, you can <em>short sell</em> a company’s stock if you expect its price to go down. In a nutshell, short selling means to sell stocks that you don’t own.</p>
                        <p>As an example, short selling 5 shares of company XYZ is mathematically equivalent to buying -5 shares of XYZ. As a result, your <em>Cash In Hand</em> will increase and your <em>Stock Worth</em> will accordingly decrease such that your <strong><em>Net Worth</em> remains the same</strong> <em>(Remember: Net Worth = Cash In Hand + Stock Worth)</em>.</p>
                        <p>After you short sell a company, if the stock price dips below the price you sold them for, then you will have made a profit and vice-versa.</p>
                        <p><em>Note : You can only short sell a maximum of 50 stocks per company</em></p>
                        <h5 className="ui header"><a id="What_is_my_Net_Worth_and_how_is_it_calculated_64"></a>What is my Net Worth and how is it calculated?</h5>
                        <p>The player with the highest Net Worth at the end of 7 days is the winner. Your Net Worth is split into two parts - <em>Cash In Hand</em> and <em>Stock Worth</em>. You can see  these values, along with your trading history on the <strong>Portfolio page</strong>, as shown in the image below :-</p>
                        <p>For the entirely uninitiative, here’s a table explaining how your Net Worth will change in response to different events :-</p>
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th>Cash In Hand</th>
                                    <th>Stock Worth</th>
                                    <th>Net Worth</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Buy stocks</td>
                                    <td>Decreases</td>
                                    <td>Increases</td>
                                    <td>Constant</td>
                                </tr>
                                <tr>
                                    <td>Sell stocks</td>
                                    <td>Increases</td>
                                    <td>Decreases</td>
                                    <td>Constant</td>
                                </tr>
                                <tr>
                                    <td>Stock price rises</td>
                                    <td>Constant</td>
                                    <td>Increases</td>
                                    <td>Increases</td>
                                </tr>
                                <tr>
                                    <td>Stock price falls</td>
                                    <td>Constant</td>
                                    <td>Decreases</td>
                                    <td>Decreases</td>
                                </tr>
                            </tbody>
                        </table>
                        <h5 className="ui header"><a id="What_is_the_difference_between_Stocks_in_Market_and_Stocks_in_Exchange_76"></a>What is the difference between <em>Stocks in Market</em> and <em>Stocks in Exchange</em>?</h5>
                        <p>In the <strong>Companies Page</strong>, you’ll find an entry for Stocks in Market as well as an entry for Stocks in Exchange. Let’s clarify the difference between the two. <em>Stocks in Exchange</em> refers to the number of stocks that the Dalal Street Exchange currently holds. This number will be the same as the number found under <em>Available</em> in the <strong>Market Page</strong>.</p>
                        <p><em>Stocks in Market</em> refers to the number of stocks that are currently held by all of the players in the game. When the game begins, the <em>Stocks in Market</em> will be <strong>0</strong> since all stocks are initially held by the exchange. As soon as the market opens on Day 1 and players begin buying from the exchange, the number of <em>Stocks in Market</em> will increase and the number of <em>Stocks in Exchange</em> will decrease until it hits zero.</p>
                        <h5 className="ui header"><a id="What_does_it_mean_if_there_are_no_stocks_available_in_the_exchange_81"></a>What does it mean if there are no stocks available in the exchange?</h5>
                        <p>You can see the number of stocks of each company available in the exchange on the <strong>Market Page</strong>. If this number is zero, it means that all shares of this company are currently in the hands of the players. Therefore, you can no longer buy shares from the exchange and instead, you’ll have to issue Buy orders to buy any stock.</p>
                        <h5 className="ui header"><a id="Help_I_dont_know_what_Market_Limit_and_Stoploss_orders_are_84"></a>Help! I don’t know what Market, Limit and Stoploss orders are!</h5>
                        <p>These are the 3 types of orders that you can place. Which type of order you select can change the trade price as well as the speed at which your transaction is carried out.</p>
                        <ol>
                            <li><em>Market Orders</em>: If your primary concern is to have your order filled ASAP, and you’re not too worried about the price at which the transaction is carried out, you should use a Market Order. However, make sure that <em>you keep an eye on the Market Depth</em> before issuing one of these transactions to ensure that you don’t get ripped off!</li>
                        </ol>
                        <p><strong>How it Works</strong>: A Market <em>Buy</em> Order will find the best matching Sell Order for the same company, and execute the transaction. Similarly, a Market <em>Sell</em> Order will find the best matching Buy Order for the same company, and execute the transaction.</p>
                        <ol start={2}>
                            <li><em>Limit Orders</em>: Limit Orders allow you to specify a maximum trade price in case of a Limit Buy, and a minimum trade price in case of a Limit Sell.</li>
                        </ol>
                        <p><strong>How it Works</strong>: A Limit <em>Buy</em> Order will find the best matching Sell Order whose trade price is <em>below</em> the limit that you have specified, and execute the transaction. Similary, A Limit <em>Sell</em> Order will find the best matching Buy Order whose trade price is <em>above</em> the limit that you have specified, and execute the transaction.</p>
                        <ol start={3}>
                            <li><em>Stoploss Orders</em>: Stopless Buy Orders are used to jump on a rising trend and Stoploss Sell Orders are used to lock in a profit/limit your losses.</li>
                        </ol>
                        <p><strong>How it Works</strong>: Stoploss orders are converted to Market Orders once the price crosses the Stoploss price that you set. In case of a Stoploss <em>Buy</em>, your order will be converted to a <em>Market Buy</em> as soon as the stock’s price rises <em>above</em> the Stoploss price that you set. Similarly, in case of a Stoploss <em>Sell</em>, your order will be converted to a <em>Market Sell</em> as soon as the stock’s price falls <em>below</em> the Stoploss price that you set.</p>
                        <h5 className="ui header"><a id="What_exactly_is_this_trade_price_and_how_is_it_determined_99"></a>What exactly is this <em>trade price</em> and how is it determined?</h5>
                        <p>If you want to buy stocks of a certain company, there should also be a player willing to sell stocks of the same company. Our algorithm uses a best match approach to determine at what price this transaction should be carried out. This price is called the <em>Trade Price.</em> You can view the trade price of all of your executed transactions on the <strong>Portfolio Page</strong>.</p>
                        <h5 className="ui header"><a id="Can_I_expect_any_new_companies_to_pop_up_over_the_course_of_the_game_102"></a>Can I expect any new companies to pop up over the course of the game?</h5>
                        <p>While we don’t expect any more companies to go public over the course of this game, existing companies may release more shares in the middle. If this happens, then the number of <em>Stocks in Exchange</em> will increase, and you can buy these stocks from the <strong>Markets Page</strong>. Stay tuned to the <strong>News Page</strong> to be the first to know when to expect more shares.</p>
                    </div>
                    
                </div>
            </Fragment>
        );
    }
}