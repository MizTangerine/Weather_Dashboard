$(document).ready(function () {

    let today = (moment().format('MM/DD/YYYY'));

    $('#btn').on('click', function (event) {
        event.preventDefault()
        let city = $('#city').val()
        const appid = 'a6b91fb6370e45efe199c34a5c679377'
        if (city != '') {
            let queryURL = 'https://api.openweathermap.org/data/2.5/weather?appid=' + appid + '&q=' + city + '&units=imperial'
            $.ajax({
                method: "GET",
                url: queryURL,
                success: function (data) {
                    console.log('data: ', data)
                    show(data)
                    $('.current').html(show(data))
                    $("#city").val('') //clears search city
                }
            })

        } else {
            $('#error').html('Field cannot be empty')
        }

    })

    function show(data) {
        return "<h2>City: " + data.name
            + "<h2>Lat, Long: " + data.coord.lat + ', ' + data.coord.lon
            + "<h2>Icon: " + data.weather[0].icon
            + "<img src= http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png alt=" + (data.weather[0].main) + ">"
            + "<h2>Temp: " + data.main.temp
            + "<h2>Humidity: " + data.main.humidity
            + "<h2>Wind Speed: " + data.wind.speed


        // uv index
    }
















})