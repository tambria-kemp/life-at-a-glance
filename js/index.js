//https://nexchange2.docs.apiary.io/#reference/0/latest-ticker/get-latest-ticker?console=1
'use strict'

const NEXCHANGE_BASE_URL = 'https://api.nexchange.io/en/api/v1'
const IEXTRADING_BASE_URL = 'https://api.iextrading.com/1.0'
const AIRVISUAL_BASE_URL = 'https://api.airvisual.com/v2'

function initApp() {
    getBitcoinPrice()
        .then(json => {
            displayBitcoinResults(json)
        })

    getRipplePrice()
        .then(json => {
            displayRippleResults(json)
        })

    getEthereumPrice()
        .then(json => {
            displayEthereumResults(json)
        })

    getLitecoinPrice()
        .then(json => {
            displayLitecoinResults(json)
        }) 

    getUpcomingIPO();
    defaultWatchList();
    getCurrentWeather();
    defaultStockQuote();
    defaultStockNews();
    watchStockQuoteForm();
}

function defaultStockQuote() {
    fetch(`${IEXTRADING_BASE_URL}/stock/aapl/book`)
        .then(res => res.json())
        .then(json => displayStockQuote(json))
}

function defaultWatchList() {
    fetch(`${IEXTRADING_BASE_URL}/stock/market/batch?symbols=aapl,fb,tsla,googl,aal&types=quote,news,chart&range=1m&last=5`)
        .then(res => res.json())
        .then(json => displayWatchList(json))
}

function defaultStockNews() {
    fetch(`${IEXTRADING_BASE_URL}/stock/aapl/news/last`)
        .then(res => res.json())
        .then(json => displayStockNews(json))
}

//Bitcoin price
function getBitcoinPrice() {
    return fetch(`${NEXCHANGE_BASE_URL}/price/BTCUSD/latest/?market_code=nex`)
        .then(res => res.json())
}

function displayBitcoinResults(json) {
    $('.bitcoin').append(`${json[0].ticker.ask.slice(0, 9)}<span class="strong"> USD</span>`)
}

//Ripple price
function getRipplePrice() {
    return fetch(`${NEXCHANGE_BASE_URL}/price/XRPUSDT/latest/?market_code=nex`)
        .then(res => res.json())
}

function displayRippleResults(json) {
    $('.ripple').append(`${json[0].ticker.ask.slice(0, 9)}<span class="strong"> USD</span> `)
}

//Ethereum price
function getEthereumPrice() {
    return fetch(`${NEXCHANGE_BASE_URL}/price/ETHUSD/latest/?market_code=nex`)
        .then(res => res.json())
}

function displayEthereumResults(json) {
    $('.ethereum').append(`${json[0].ticker.ask.slice(0, 9)}<span class="strong"> USD</span> `)
}

//Litecoin price
function getLitecoinPrice() {
    return fetch(`${NEXCHANGE_BASE_URL}/price/LTCUSD/latest/?market_code=nex`)
        .then(res => res.json())
}

function displayLitecoinResults(json) {
    $('.litecoin').append(`${json[0].ticker.ask.slice(0, 9)}<span class="strong"> USD</span>`)
}

//StockQuote Form
function watchStockQuoteForm() {
    $('#stock-search').on('submit', function (ev) {
        ev.preventDefault();

        let userInput = $('input').val();
        getStockQuote(userInput);
        getStockNews(userInput);
    })
}

function getStockQuote(userInput) {
    fetch(`${IEXTRADING_BASE_URL}/stock/` + userInput + `/book`)
        .then(res => res.json())
        .then(json => displayStockQuote(json))
}

function displayStockQuote(json) {
    $('.stock-price, .company-name, .stock-open, .stock-close, .stock-high, .stock-low').html('');
    $('.stock-price').append(`<h2>${json.quote.latestPrice} USD <span class="change-percent">${json.quote.changePercent}%</span></h2> `)
    $('.company-name').append(`<h2>${json.quote.companyName} (${json.quote.symbol})</h2>`)
    $('.stock-open').append(`<p>Open ${json.quote.open} USD</p>`)
    $('.stock-close').append(`<p>Close ${json.quote.close} USD</p>`)
    $('.stock-low').append(`<p>Low ${json.quote.low} USD</p>`)
    $('.stock-high').append(`<p>High ${json.quote.high} USD</p>`)
}

function getUpcomingIPO() {
    fetch(`${IEXTRADING_BASE_URL}/stock/market/upcoming-ipos`)
        .then(res => res.json())
        .then(json => displayUpcomingIPO(json))
}

//https://api.iextrading.com/1.0/stock/market/upcoming-ipos
function displayUpcomingIPO(json) {
    for (let i = 0; i < 3; i++) {
        $('.market-watch').append(`<li class="news">${json.rawData[i].companyName}</br>${json.rawData[i].expectedDate}</li>`)
    }
}

function displayWatchList(json) {
    $('.watch-list').append(`<li class="news"><p><span class="blue">${json['AAPL'].quote.symbol}</span> | ${json['AAPL'].quote.latestPrice} USD </p></li>`)
    $('.watch-list').append(`<li class="news"><p><span class="blue">${json['FB'].quote.symbol}</span> | ${json['FB'].quote.latestPrice} USD </p></li>`)
    $('.watch-list').append(`<li class="news"><p><span class="blue">${json['TSLA'].quote.symbol}</span> | ${json['TSLA'].quote.latestPrice} USD </p></li>`)
    $('.watch-list').append(`<li class="news"><p><span class="blue">${json['GOOGL'].quote.symbol}</span> | ${json['GOOGL'].quote.latestPrice} USD </p></li>`)
}

function getStockNews(userInput) {
    fetch(`${IEXTRADING_BASE_URL}/stock/` + userInput + `/news/last`)
        .then(res => res.json())
        .then(json => displayStockNews(json))
}

function displayStockNews(json) {
    $('.stock-news').html('');

    for (let i = 0; i < json.length; i++) {
        $('.stock-news').append(`<li class="news"><p>${json[i].source} | ${json[i].datetime.slice(0, 10)} </p><h5>${json[i].headline} </h5>
    </li>`)
    }
}

function getCurrentWeather() {
    fetch(`${AIRVISUAL_BASE_URL}/nearest_city?key=7hoQuH3S2FKxqfr59`)
        .then(res => res.json())
        .then(json => displayWeatherData(json))
}

function displayWeatherData(json) {
    let cTemp = json.data.current.weather.tp;
    let cToFahr = cTemp * 9 / 5 + 32;
    let message = cToFahr;

    $('.city').append(`<h3>${json.data.city}, ${json.data.state} </h3>`)
    $('.weather-icon').append(`<img src="/images/${json.data.current.weather.ic}.png">`)
    $('.weather').append(`${message} <sup>o</sup><div class="fahrenheit">F</div>`)
    // $('.wind-speed').append(`<p>${json.data.current.weather.ws}</p>`)
}


$(initApp);


//TO DO ITEMS
//display data for watchlist and UpcomingIPO ipos
//change crypto to pull from one source 
//single responsibility for getStockQuote getStockNews
//add footer to index file and make it stick to bottom 
