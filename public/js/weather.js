document.getElementById('submitbtn').addEventListener("click", loadweather);

//load weather
function loadweather(){
    console.log('load weather');
    // get searcharg keyword
    var searcharg = document.getElementById("searchbar").value;
    // get endpoint with searcharg
    var endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${searcharg}&units=metric&appid=80db0e776dad41010dd395b6b1799cb4`;
    console.log(endpoint);

    fetch(endpoint)
        .then(response => response.json())
        .then (data => {
            console.log('display current weather');
            console.log(data);
            //if-clause for handling non-existing location
            if (data['cod'] != 404) {
                //display current weather
                document.getElementById('weather-date').innerHTML = convertTimestamp(data.dt) + ", ";
                //cityname
                document.getElementById('weather-location').innerHTML = data.name;
                document.getElementById('today').innerHTML = "Today";
                //temperature
                document.getElementById('temp').innerHTML = data.main.temp + "°C";
                //weather description
                document.getElementById('currdescription').innerHTML = data['weather'][0]['description'];
                //weather icon
                document.getElementById('currcardbgimg').src = "http://openweathermap.org/img/wn/" + data['weather'][0]['icon'] + "@2x.png";
                document.getElementById('currcardbgimg').style.height = "300px";
                document.getElementById('currcardbgimg').style.width = "300px";

                //we gonna need this for the forecast
                var lon = data.coord.lon;
                var lat = data.coord.lat;

                //display 5 days forecast
                loadforecast(lon, lat);
            }else{
                console.log('city not found!');
                //voila everything dissapear
                document.getElementById('today').innerHTML = "City not found!";
                document.getElementById('forecast').style.visibility = "hidden";
                document.getElementById('weather-date').innerHTML = "";
                document.getElementById('weather-location').innerHTML = '';
                document.getElementById('temp').innerHTML = "";
                document.getElementById('currdescription').innerHTML = '';
                document.getElementById('currcardbgimg').src = "";
                document.getElementById('currcardbgimg').style.height = "0px";
                document.getElementById('currcardbgimg').style.width = "0px";
            }
        })
        // display error information
        .catch(err => alert(err))
}

function loadforecast(lon, lat) {
    //console.log("Click");
    //get endpoint for weather forecast api
    var endpointlf = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon +
        '&exclude=current,minutely,hourly,alerts&units=metric&appid=80db0e776dad41010dd395b6b1799cb4';
    fetch(endpointlf)
        .then(response => response.json())
        .then(data1 => {
            console.log('display weather forecast');
            //fill up 5 day forecast weather cards
            for (var i = 1; i < 6; i++) {
                console.log(`weather forecast ${i}`);
                var name = 'nday' + i.toString();
                var image = 'imgday' + i.toString();
                var temp = 'tday' + i.toString();
                var date = data1.daily[i].dt;
                //cards are visible now
                document.getElementById('forecast').style.visibility = "visible";
                //date + time
                document.getElementById(`${name}`).innerHTML = convertTimestamp(date);
                //icon
                document.getElementById(`${image}`).src = "http://openweathermap.org/img/wn/" + data1.daily[i]['weather'][0]['icon'] + "@2x.png";
                //temperature
                document.getElementById(`${temp}`).innerHTML = data1.daily[i].temp.day + "°C";
            }
        })
}

//convert UTC timestamp to human-readable format
function convertTimestamp(timestamp) {
    console.log('convert Timestamp');
    var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
        dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
        ampm = 'AM',
        time;
    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh == 0) {
        h = 12;
    }
// ie: 2013-02-18, 8:35 AM
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
    return time;
}