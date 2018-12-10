//https://nexchange2.docs.apiary.io/#reference/0/latest-ticker/get-latest-ticker?console=1
'use strict'

const NEXCHANGE_BASE_URL = 'https://api.nexchange.io/en/api/v1'
const IEXTRADING_BASE_URL = 'https://api.iextrading.com/1.0'

function initApp() {
    getBitcoinPrice()
        .then(json => {
            console.log(json)
            displayBitcoinResults(json)
        })

    // getBitcoinPrice()
    //     .then(data => {
    //         alert(`The bitcoin price is ${data[0].ticker.ask}`)
    //     })

    getEthereumPrice()
        .then(json => {
            displayEthereumResults(json)
        })

    getLitecoinPrice()
        .then(json => {
            displayLitecoinResults(json)
        })
    

    watchStockQuoteForm(); 
}

//Bitcoin price
function getBitcoinPrice () {
    return fetch(`${NEXCHANGE_BASE_URL}/price/BTCUSD/latest/?market_code=nex`)
        .then(res => res.json())
}
// function getBitcoinPrice () {
//     fetch(`${NEXCHANGE_BASE_URL}/price/BTCUSD/latest/?market_code=nex`)
//         .then(res => res.json())
//         .then(json => displayBitcoinResults(json))
// }

function displayBitcoinResults(json) {
    $('.bitcoin').append(`${json[0].ticker.ask.slice(0,9)}<span class="strong"> USD</span>`)
}

//Ethereum price
function getEthereumPrice () {
    return fetch(`${NEXCHANGE_BASE_URL}/price/ETHUSD/latest/?market_code=nex`)
        .then(res => res.json())
}

function displayEthereumResults(json) {
    $('.ethereum').append(`Ask ${json[0].ticker.ask}  Bid ${json[0].ticker.bid}`)
}

//Litecoin price
function getLitecoinPrice () {
    return fetch(`${NEXCHANGE_BASE_URL}/price/LTCUSD/latest/?market_code=nex`)
        .then(res => res.json())
}

function displayLitecoinResults(json) {
    $('.litecoin').append(`Ask ${json[0].ticker.ask} Bid ${json[0].ticker.bid}`)
}


//StockQuote Form
//add clear form 
function watchStockQuoteForm () {
    console.log('im here');

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
    $('.stock-price').append(`<h3>${json.quote.latestPrice} USD <span class="change-percent">${json.quote.changePercent}</span></h3> `)
    $('.company-name').append(`<h3>${json.quote.companyName} (${json.quote.symbol})</h3>`)
    $('.company-sector').append(`<p>${json.quote.sector}</p>`)
 }

function getStockNews (userInput) {
    fetch(`${IEXTRADING_BASE_URL}/stock/` + userInput + `/news/last/3`)
        .then(res => res.json())
        .then(json => displayStockNews(json))
}

//add loop for 3 news articles
//set default news
function displayStockNews(json) {
    console.log('made-it');
    for (let i = 0; i < json.length; i++) {
    $('.stock-news').append(`<li class="news"><p>${json[i].source} | ${json[i].datetime.slice(0,10)} </p><h4>${json[i].headline} </h4>
    </li>`)
    }

}

$(initApp);
