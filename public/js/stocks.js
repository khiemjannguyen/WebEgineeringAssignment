///Global Variable
var period = 'today';
var api_key = `J8ALM0DJVUC8F3YD` // no longer valid
//for chart label
var symbol = '';
document.getElementById('submitbtn').addEventListener("click", loadAll);

//load all data the website needs
function loadAll() {
    console.log('loadall');
    //make tables visible
    console.log('voila visible');
    document.getElementById('comdesrc').style.visibility = 'visible';
    document.getElementById('upperinf').style.visibility = 'visible';
    //load infos + load data for chart + plot chart
    loadInfo();
}

//load data for info cards
function loadInfo() {
    console.log('load info cards');
    // get searcharg keyword
    var searcharg1 = document.getElementById("searchbar").value;
    var endpoint1 = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${searcharg1}&apikey=` + api_key;
    console.log(endpoint1);

    fetch(endpoint1)
        .then(response => response.json())
        .then(data => {
            console.log('fill in company cards');
            //Company information
            document.getElementById('symbol').innerHTML = data.Symbol;
            symbol = data.Symbol; //need this for Chart label
            document.getElementById('header').innerHTML = data.Name;
            document.getElementById('name').innerHTML = data.Name;
            document.getElementById('country').innerHTML = data.Country;
            document.getElementById('industry').innerHTML = data.Industry;
            document.getElementById('description').innerHTML = data.Description;

            //Finance information
            document.getElementById('assettype').innerHTML = data.AssetType;
            document.getElementById('currency').innerHTML = data.Currency;
            document.getElementById('mcap').innerHTML = data.MarketCapitalization;
            document.getElementById('sector').innerHTML = data.Sector;
            document.getElementById('beta').innerHTML = data.Beta;
            document.getElementById('dps').innerHTML = data.DividendPerShare;
            document.getElementById('200dma').innerHTML = data['200DayMovingAverage'];

            //load Data for Chart + draw Chart
            loadData();
        })
        .catch(err => alert(err))
}

//load data for chart
function loadData() {
    console.log('loadData');
    //need this for JSON path
    var daily = 'Time Series (Daily)';
    var weekly = 'Weekly Adjusted Time Series';
    var monthly = 'Monthly Adjusted Time Series';
    // get searcharg keyword
    var searcharg = document.getElementById("searchbar").value;

    //depending on chosen period: different api, different time span
    switch (period) {
        case 'today':
            console.log('today');
            //Intraday
            var endpointto = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${searcharg}&interval=5min&apikey=` + api_key;
            console.log(endpointto);
            getIntervalIntra(endpointto);

            break;
        case '5d':
            console.log('5d');
            //Adjusted Daily
            var endpoint5d = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${searcharg}&apikey=` + api_key;
            console.log(endpoint5d);
            getIntervalGen(endpoint5d, 5, daily);
            break;
        case '1m':
            console.log('1m');
            //Adjusted Daily
            var endpoint1m = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${searcharg}&apikey=` + api_key
            console.log(endpoint1m);
            getIntervalGen(endpoint1m, 30, daily);
            break;
        case '6m':
            console.log('6m');
            //Adjusted Weekly
            var endpoint6m = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${searcharg}&apikey=` + api_key;
            console.log(endpoint6m);
            getIntervalGen(endpoint6m, 24, weekly);
            break;
        case '1y':
            console.log('1y');
            //Adjusted Monthly
            var endpoint1y = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${searcharg}&apikey=` + api_key;
            console.log(endpoint1y);
            getIntervalGen(endpoint1y, 12, monthly);
            break;
        case '6y':
            console.log('6y');
            //Adjusted Monthly
            var endpoint6y = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${searcharg}&apikey=` + api_key;
            console.log(endpoint6y);
            getIntervalGen(endpoint6y, 72, monthly);
            break;
    }
}


//get close value (array) for Intraday + draw Chart
function getIntervalIntra(endpoint) {
    console.log('getIntervalIntra');
    console.log(endpoint);
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            console.log('inside then intra');
            //if-clause for handling too many calls
            if (data['Note'] == null) {
                console.log('inside if');
                console.log(data);
                ///display Current Data
                //need this for path to get needed info out of json
                var timeseries = data['Time Series (5min)'];
                console.log('keys');
                console.log(timeseries);
                var keys = Object.keys(timeseries);
                //Last Refreshed
                document.getElementById('lrefreshed').innerHTML = data['Meta Data']['3. Last Refreshed'];
                //Open Value
                document.getElementById('openval').innerHTML = timeseries[`${keys[0]}`]['1. open'];
                //Max. Value
                document.getElementById('maxval').innerHTML = timeseries[`${keys[0]}`]['2. high'];
                //MinValue
                document.getElementById('minval').innerHTML = timeseries[`${keys[0]}`]['3. low'];

                //Array for close, xaxis
                var closeval = [];
                var xaxis = [];
                for (var i in keys) {
                    var date = keys[i];
                    //get single adjusted close value
                    var singclose = parseFloat(timeseries[`${date}`]['4. close']);
                    //add new close value to array
                    closeval.push(singclose);
                    //add new x axis label to array
                    xaxis.push(date);
                }
                //draw chart
                drawChart(closeval, xaxis);
            } else {
                document.getElementById('header').innerHTML = 'You reached the limit of calls or your input is invalid!';
                document.getElementById('comdesrc').style.visibility = 'hidden';
                document.getElementById('upperinf').style.visibility = 'hidden';
                console.log('Too Many Calls');
                alert('Our standard API call frequency is 5 calls per minute and 500 calls per day');
            }
        })
        .catch(err => {
            alert(err);
        })
}


///general get close value(array) for rest + draw Chart
function getIntervalGen(endpoint, interval, time) {
    console.log('getIntervalGen');
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            console.log('inside then gen');
            //if-clause for handling too many calls
            if (data['Note'] == null) {
                //need this for JSON path
                const timeseries = data[`${time}`];
                const keys = Object.keys(timeseries);

                ///Current Data
                //Last Refreshed
                document.getElementById('lrefreshed').innerHTML = data['Meta Data']['3. Last Refreshed'];
                //Open Value
                document.getElementById('openval').innerHTML = timeseries[`${keys[0]}`]['1. open'];
                //Max. Value
                document.getElementById('maxval').innerHTML = timeseries[`${keys[0]}`]['2. high'];
                //MinValue
                document.getElementById('minval').innerHTML = timeseries[`${keys[0]}`]['3. low'];

                //Array for close value, xaxis
                var closeval = [];
                var xaxis = [];
                for (var i = 0; i <= interval; i++) {
                    var date = keys[i];
                    //get single adjusted close value
                    var singclose = parseFloat(timeseries[`${date}`]['5. adjusted close']);
                    //add new close value to array
                    closeval.push(singclose);
                    //add new x axis label to array
                    xaxis.push(date);
                }
                drawChart(closeval, xaxis);
            } else {
                document.getElementById('header').innerHTML = 'You reached the limit of calls!Be patient buddy.';
                document.getElementById('comdesrc').style.visibility = 'hidden';
                document.getElementById('upperinf').style.visibility = 'hidden';
                console.log('Too Many Calls');
                alert('Our standard API call frequency is 5 calls per minute and 500 calls per day');
            }
        })
        .catch(err => alert(err))
}

//draw Chart
async function drawChart(closeval, xaxis) {
    console.log('drawChart');
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xaxis,
            datasets: [{
                label: symbol,
                backgroundColor: '#B3290B',
                pointBackgroundColor: '#B3290B',
                borderColor: '#B3290B',
                pointBorderColor: '#B3290B',
                fill: false,
                pointRadius: 0,
                data: closeval
            }],
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Share Price'
            },
            scales: {
                xAxes: [{
                    //gridLines: {display:false},
                    display: true,
                }],
                yAxes: [{
                    //gridLines: {display:false},
                    display: true,
                }]
            }
        }
    });
    console.log('end');
}

//dropdown menu input with text-change
function changeText(timespan) {
    switch (timespan) {
        case 'today':
            document.getElementById('mode-dropdown').innerHTML = 'Today';
            period = 'today';
            break;
        case '5d':
            document.getElementById('mode-dropdown').innerHTML = 'Last 5 Days';
            period = '5d';
            break;
        case '1m':
            document.getElementById('mode-dropdown').innerHTML = 'Last 1 Month';
            period = '1m';
            break;
        case '6m':
            document.getElementById('mode-dropdown').innerHTML = 'Last 6 Months';
            period = '6m';
            break;
        case '1y':
            document.getElementById('mode-dropdown').innerHTML = 'Last 1 Year';
            period = '1y';
            break;
        case '6y':
            document.getElementById('mode-dropdown').innerHTML = 'Last 6 Years';
            period = '6y';
            break;
    }
}
