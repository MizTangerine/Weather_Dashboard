$(document).ready(function () {
    // ****global variables
    let today = (moment().format('MM/DD/YYYY'));
    let name;
    let searchHistory = []

    // ***page first loads

    getLocal()
    previous()

    // ***when GO button is clicked or enter pressed
    $('#btn').on('click', function (event) {

        event.preventDefault()

        let city = $('#city').val()

        apiCall(city)

    })

    // ***when previous search is ckicked 
    $('.previous').on('click', '.list', function () {
        console.log('working')
        let city = ($(event.target).text())
        // let city = previousEl.text()
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
                        // console.log('data: ', data)
                        current(data)
                        $('.current').html(current(data))
                    })
            })

            // ***saves search city to local storage
            function saveLocal() {
                let citySearch = city.substr(0, 1).toUpperCase() + city.substr(1)
                searchHistory.unshift(citySearch)
                if (searchHistory.length > 5) {
                    searchHistory.pop()
                }
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
    // ***function to display current weather
    function current(data) {
        return "<h2>" + name + " " + today
            + "<img src= http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png alt=" + (data.current.weather[0].main) + ">"
            + "<h2>Temp: " + data.current.temp
            + "<h2>Humidity: " + data.current.humidity
            + "<h2>Wind Speed: " + data.current.wind_speed


        // uv index
    }

    // ***function to retrieve previous searches from local storage
    function getLocal() {
        if (localStorage.getItem('searchHistory') !== null) {
            searchHistory = JSON.parse(localStorage.getItem('searchHistory'))
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

// THINGS TO ADD:
// -if city exists in searchHistory, don't add it
// -make searchHistory Proper Case (not just first letter)