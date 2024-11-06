/* Construct a simple Portfolio class that has a collection of Stocks and
a "Profit" method that receives 2 dates and returns the profit of the Portfolio between those dates.
Assume each Stock has a "Price" method that receives a date and returns its price.
Bonus Track: make the Profit method return the "annualized return" of the portfolio between the given dates. */

import Portfolio from "./src/classes/portfolio.ts";
import PortfolioService from "./src/services/portfolio.service.ts";

const portfolioService = new PortfolioService();
const portfolio = new Portfolio(portfolioService);

portfolio.addStock(10206, 2.4);
portfolio.addStock(7963, 3.4);
portfolio.addStock(18922, 7);

const dateStart = new Date("2023-10-10 12:00");
const dateEnd = new Date();

const profit = await portfolio.profit(dateStart, dateEnd);

console.log(`Profit ${profit}`);
