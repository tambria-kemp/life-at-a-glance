//https://nexchange2.docs.apiary.io/#reference/0/latest-ticker/get-latest-ticker?console=1
'use strict'

const NEXCHANGE_BASE_URL = 'https://api.nexchange.io/en/api/v1'
const IEXTRADING_BASE_URL = 'https://api.iextrading.com/1.0'
const AIRVISUAL_BASE_URL = 'https://api.airvisual.com/v2'

function initApp() {
    getBitcoinPrice()
        .then(json => {
            console.log(json)
            displayBitcoinResults(json)
        })
    
    getRipplePrice()
    .then(json => {
        displayRipplecoinResults(json)
    })

    getEthereumPrice()
        .then(json => {
            displayEthereumResults(json)
        })

    getLitecoinPrice()
        .then(json => {
            displayLitecoinResults(json)
        })
    
    // getCurrentWeather ()
    //     .then(json => {
    //         displayWeatherData(json)
    //     })   

    getMarketWatch(); 
    getCurrentWeather();
    defaultStockQuote();
    defaultStockNews();
    watchStockQuoteForm(); 
}

function defaultStockQuote () {
    fetch(`${IEXTRADING_BASE_URL}/stock/aapl/book`)
        .then(res => res.json())
        .then(json => displayStockQuote(json))
}

function defaultStockNews () {
    fetch(`${IEXTRADING_BASE_URL}/stock/aapl/news/last`)
        .then(res => res.json())
        .then(json => displayStockNews(json))
}

function getMarketWatch() {
    fetch(`${IEXTRADING_BASE_URL}/stock/market/upcoming-ipos`)
        .then(res => res.json())
        .then(json => displayMarketWatch())
        .then(json => console.log(json))
}

//Bitcoin price
function getBitcoinPrice () {
    return fetch(`${NEXCHANGE_BASE_URL}/price/BTCUSD/latest/?market_code=nex`)
        .then(res => res.json())
}

function displayBitcoinResults(json) {
    $('.bitcoin').append(`${json[0].ticker.ask.slice(0,9)}<span class="strong"> USD</span>`)
}

//Ethereum price
function getRipplePrice () {
    return fetch(`${NEXCHANGE_BASE_URL}/price/XRPUSD/latest/?market_code=nex`)
        .then(res => res.json())
}

function displayRippleResults(json) {
    $('.ripple').append(`${json[0].ticker.ask.slice(0,9)}<span class="strong"> USD</span> `)
}

//Ethereum price
function getEthereumPrice () {
    return fetch(`${NEXCHANGE_BASE_URL}/price/ETHUSD/latest/?market_code=nex`)
        .then(res => res.json())
}

function displayEthereumResults(json) {
    $('.ethereum').append(`${json[0].ticker.ask.slice(0,9)}<span class="strong"> USD</span> `)
}

//Litecoin price
function getLitecoinPrice () {
    return fetch(`${NEXCHANGE_BASE_URL}/price/LTCUSD/latest/?market_code=nex`)
        .then(res => res.json())
}

function displayLitecoinResults(json) {
    $('.litecoin').append(`${json[0].ticker.ask.slice(0,9)}<span class="strong"> USD</span>`)
}

//StockQuote Form
function watchStockQuoteForm () {
    $('#stock-search').on('submit', function(ev) {
        ev.preventDefault();
    
        let userInput = $('input').val();
        getStockQuote(userInput);
        getStockNews(userInput);
      })
}

function getStockQuote (userInput) {
    fetch(`${IEXTRADING_BASE_URL}/stock/` + userInput + `/book`)
        .then(res => res.json())
        .then(json => displayStockQuote(json))
}

function displayStockQuote(json) {
    $('.stock-price, .company-name').html('');
    $('.stock-price').append(`<h2>${json.quote.latestPrice} USD <span class="change-percent">${json.quote.changePercent}%</span></h2> `)
    $('.company-name').append(`<h2>${json.quote.companyName} (${json.quote.symbol})</h2>`)
    $('.company-sector').append(`<p>${json.quote.sector}</p>`)
}

function displayMarketWatch(json) {
    $('.market-watch').append(`${json.symbol} ${json[1].companyName} ${json[1].expectedDate}`)
}

function getStockNews (userInput) {
    fetch(`${IEXTRADING_BASE_URL}/stock/` + userInput + `/news/last`)
        .then(res => res.json())
        .then(json => displayStockNews(json))
}

function displayStockNews(json) {
    $('.stock-news').html('');

    for (let i = 0; i < json.length; i++) {
    $('.stock-news').append(`<li class="news"><p>${json[i].source} | ${json[i].datetime.slice(0,10)} </p><h5>${json[i].headline} </h5>
    </li>`)
    }
}

function getCurrentWeather() {
    fetch(`${AIRVISUAL_BASE_URL}/nearest_city?key=7hoQuH3S2FKxqfr59`)
        .then(res => res.json())
        .then(json => displayWeatherData(json))
}

function displayWeatherData (json) {
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
//change crypto to pull from one source 
//single responsibility for getStockQuote getStockNews