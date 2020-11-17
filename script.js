$(document).ready(function () {
    // ****global variables
    let today = (moment().format('MM/DD/YYYY'));
    // console.log(today)
    let name;
    let searchHistory = []

    // ***page first loads

    getLocal();
    previous();

    // ***when GO button is clicked or enter pressed
    $('#btn').on('click', function (event) {
        event.preventDefault()
        $('#error').empty()

        let city = $('#city').val()
        console.log(city)
        apiCall(city)

    })

    // ***when previous search is clicked 
    $('.previous').on('click', '.list', function (event) {
        $('#error').empty()
        let city = ($(event.target).text())
        console.log(city)
        apiCall(city)
    })

    // ***API call
    function apiCall(city) {
        const appid = 'a6b91fb6370e45efe199c34a5c679377'
        if (city) {
            let queryURL = 'https://api.openweathermap.org/data/2.5/weather?appid=' + appid + '&q=' + city + '&units=imperial'
            // ajax call to get lat long by city name
            $.ajax({
                method: "GET",
                url: queryURL,
            }).done((getLL) => {
                // console.log('getLL: ', getLL)
                name = getLL.name
                let lat = getLL.coord.lat
                let lon = getLL.coord.lon
                // console.log(lat, lon, name)
                // ajax call to get current and forecast data
                $.ajax({
                    method: "GET",
                    url: 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly&units=imperial&appid=' + appid
                })
                    .done((data) => {
                        console.log('data:', data)
                        current(data)
                        // $('.current').html(current(data))
                        // $('.forecast').html(daily(data))
                        daily(data)
                    })
            })

            // ***saves search city to local storage
            // *** TA showing me what is to come***
            // let citySearch = city.split(' ').map(word => word.substr(0, 1).toUpperCase() + word.substr(1)).join(' ');
            function saveLocal() {
                let citySearch = properCase(city)
                if (!checkIfDup(searchHistory, citySearch)) {
                    searchHistory.unshift(citySearch)
                    if (searchHistory.length > 5) {
                        searchHistory.pop()
                    }
                }
                // *** TA showing me what is to come***
                // let found = searchHistory.find(hist => hist === citySearch);
                // if (!found) {
                //     searchHistory.unshift(citySearch);
                //     if (searchHistory.length > 5) {
                //         searchHistory.pop();
                //     }
                // }
                localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
            }
            saveLocal()

            $("#city").val('') //clears search city
        }
        else {
            $('#error').html('City is Required') //displays message if city is empty
        }
        previous()
    }
    //test for duplicate
    function checkIfDup(checkArray, item) {
        for (let i = 0; i < checkArray.length; i++) {
            let currentItem = checkArray[i]
            if (item === currentItem) {
                return true
            }
        }
        return false
    }

    // Proper Case (not just first letter)
    function properCase(words) {
        let wordArray = words.split(' ')
        for (let i = 0; i < wordArray.length; i++) {
            let currentWord = wordArray[i]
            wordArray[i] = currentWord.substr(0, 1).toUpperCase() + currentWord.substr(1)
        }
        let proper = wordArray.join(' ')
        return proper
    }

    // ***function to display current weather
    function current(data) {
        $('.current').empty()
        $('.forecast').empty()
        //***background color for uv index
        let uvi = data.current.uvi
        function bc() {
            if (uvi < 3) {
                return 'green'
            } else if (uvi >= 3 && uvi < 6) {
                return 'yellow'
            } else if (uvi >= 6 && uvi < 8) {
                return 'orange'
            } else if (uvi >= 8 && uvi < 11) {
                return 'red'
            } else if (uvi >= 11) {
                return 'purple'
            }
        }
        //***to display on page
        // return "<h2>" + name + " (" + today + ")" + "</h2>"
        //     + "<img class=icon src= http://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png alt=" + (data.current.weather[0].main) + ">"
        //     + "<p>" + properCase(data.current.weather[0].description) + "</p>"
        //     + "<p> Current Temp: " + data.current.temp + " \xB0F" + "<br>"
        //     + "Feels Like: " + data.current.feels_like + " \xB0F" + "<br>"
        //     + "Humidity: " + data.current.humidity + "%" + "<br>"
        //     + "Wind: " + data.current.wind_speed + " MPH" + "<br>"
        //     + "UV Index: <span style=padding-right:5px;padding-left:5px;" + bc() + ";color:white>" + data.current.uvi + "</p>"

        let cIcon = "http://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png"
        let cIconAlt = data.current.weather[0].main
        let cIconEl = $('<img>').attr({ 'class': 'icon', 'src': cIcon, 'alt': cIconAlt })
        let cDescr = $('<p>').attr({ 'class': 'bottom-center' }).text(properCase(data.current.weather[0].description))
        let cDivIcon = $('<div>').attr({ 'class': 'curr-icon' }).append(cIconEl, cDescr)
        let cTempEl = $('<p>').text("Current Temp: " + data.current.temp + " \xB0F")
        let cFeelEl = $('<p>').text("Humidity: " + data.current.humidity + "%")
        let cWindEl = $('<p>').text("Wind: " + data.current.wind_speed + " MPH")
        let cUviEl = $('<p>').text("UV Index: ").append($('<span>').css({
            'padding right': '5px',
            'padding left': '5px',
            'background-color': bc(),
            'color': 'gray'
        }).text(data.current.uvi))



        $('.current').append(name, today, cDivIcon, cTempEl, cFeelEl, cWindEl, cUviEl)

    }
    // ***to display the ForeCast
    function daily(data) {
        for (let i = 1; i < 6; i++) {
            let forecast = data.daily[i]
            console.log('forecast', forecast)
            let fcDate = moment.unix(forecast.dt).utc().format('MM/DD/YYYY')
            let fcDateEl = $('<p>').text(fcDate)
            let fcIcon = "http://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png"
            let fcIconEl = $('<img>').attr({ 'class': 'icon', 'src': fcIcon, 'alt': forecast.weather.main })
            let fcMaxEl = $('<p>').text("Max: " + forecast.temp.max + " \xB0F")
            let fcMinEl = $('<p>').text("Min: " + forecast.temp.min + " \xB0F")
            let fcHumidityEl = $('<p>').text("Humidity: " + forecast.humidity + "%")

            $('.forecast').append(fcDateEl, fcIconEl, fcMaxEl, fcMinEl, fcHumidityEl)
        }
    }





    // ***function to retrieve previous searches from local storage
    function getLocal() {
        if (localStorage.getItem('searchHistory') !== null) {
            searchHistory = JSON.parse(localStorage.getItem('searchHistory'))
            apiCall(searchHistory[0]);
        }
    }

    // ***function to dispaly previous searches
    function previous() {
        $('.previous').empty()
        for (i = 0; i < searchHistory.length; i++) {
            let listEl = $('<li>').attr({
                class: 'list',
                id: 'search' + i
            })
            listEl.text(searchHistory[i])

            $('.previous').append(listEl)
        }

    }
})
