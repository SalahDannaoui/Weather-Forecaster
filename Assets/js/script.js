// ## Acceptance Criteria

// ```
// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// ```

// gotta make the search
// gotta fetch the info from api
// gotta create all the elements and append to the screen
// gotta set some info in local storage and print them on screen somewhere
// current and future conditions for the city

let historylist = [];
let historyname = "search history";

savePrintHistory();

$('#search').on("keypress", function (event) {
    console.log(event.keyCode);
    if (event.keyCode === 13) {
        createcoordURL();
    };
});
$('#search-btn').on("click", createcoordURL);

$(document).on("click", ".historyLi", historyURL);
$(document).on("keypress", ".historyLi", function (event) {
    console.log(event.keyCode);
    if (event.keyCode === 13) {
        historyURL();
    };
});

$('#clear-btn').on("click", function () {
    $('#history').html("");
    historylist = [];
    localStorage.setItem(historyname, JSON.stringify(historylist));
});

homepage();

function homepage() {
    var homeURL = "https://api.openweathermap.org/geo/1.0/direct?q=Sydney&limit=1&appid=26b03cf4c3e77894b42f94cdd37297b5";
    fetchcoord(homeURL);
}

function historyURL() {
    let city = $(this).text();

    if (city.length === 0) {
        return;
    };
    console.log(city);
    var coordURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=26b03cf4c3e77894b42f94cdd37297b5";
    console.log(coordURL);
    fetchcoord(coordURL);
}

function createcoordURL() {
    let city = $("#search").val();

    if (city.length === 0) {
        return;
    };
    console.log(city);
    var coordURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=26b03cf4c3e77894b42f94cdd37297b5";
    console.log(coordURL);
    fetchcoord(coordURL);
}


function fetchcoord(coordURL) {
    fetch(coordURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            let long = data[0].lon;
            let lat = data[0].lat;
            let queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=metric&appid=26b03cf4c3e77894b42f94cdd37297b5";
            savePrintHistory();
            $("#search").val("");
            fetchForecast(queryURL);
        })
}

function fetchForecast(queryURL) {
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            $('#todayweather').html("");
            $('#futureforecast').html("");

            let cityname = data.city.name;
            let datetimenow = data.list[0].dt_txt;
            let datetimesplit = datetimenow.split(" ");

            let timearray = datetimesplit[1].split(":");
            let datearray = datetimesplit[0].split("-");


            let tempnow = data.list[0].main.feels_like;
            let humidnow = data.list[0].main.humidity;
            let windnow = data.list[0].wind.speed;
            let iconnow = data.list[0].weather[0].icon;

            let citynameEl = $("<h2>");
            citynameEl.text(cityname + " (" + datearray[2] + "/" + datearray[1] + "/" + datearray[0] + ")");
            $("#todayweather").append(citynameEl);

            let iconEl = $("<img>");
            iconEl.attr("src", "https://openweathermap.org/img/w/" + iconnow + ".png");
            $("#todayweather").append(iconEl);

            let tempEl = $("<p>");
            tempEl.text("Temp: " + tempnow + " °C");
            $("#todayweather").append(tempEl);

            let windEl = $("<p>");
            windEl.text("Wind Speed: " + windnow + " MPS");
            $("#todayweather").append(windEl);

            let humidEl = $("<p>");
            humidEl.text("Humidity: " + humidnow + " %");
            $("#todayweather").append(humidEl);



            let indexcounter = 8 - timearray[0] / 3;
            for (let i = 0; i < 5; i++) {

                let divcard = $("<div class='daycard'>");
                $("#futureforecast").append(divcard);

                let datetime = data.list[indexcounter].dt_txt;
                let datetimesplit = datetime.split(" ");

                let futuredatearray = datetimesplit[0].split("-");


                let temp = data.list[indexcounter].main.feels_like;
                let humid = data.list[indexcounter].main.humidity;
                let wind = data.list[indexcounter].wind.speed;
                let icon = data.list[indexcounter].weather[0].icon;

                let citynameEl = $("<h2>");
                citynameEl.text(cityname + " (" + futuredatearray[2] + "/" + futuredatearray[1] + "/" + futuredatearray[0] + ")");
                divcard.append(citynameEl);

                let iconEl = $("<img>");
                iconEl.attr("src", "https://openweathermap.org/img/w/" + icon + ".png");
                divcard.append(iconEl);

                let tempEl = $("<p>");
                tempEl.text("Temp: " + temp + " °C");
                divcard.append(tempEl);

                let windEl = $("<p>");
                windEl.text("Wind Speed: " + wind + " MPS");
                divcard.append(windEl);

                let humidEl = $("<p>");
                humidEl.text("Humidity: " + humid + " %");
                divcard.append(humidEl);
                indexcounter = indexcounter + 8;
            }


        })
}

function savePrintHistory() {
    historylist = JSON.parse(localStorage.getItem(historyname)) || [];
    let searchInput = $('#search').val();


    if (historylist.length != 0) {
        for (let i = 0; i < historylist.length; i++) {
            if (searchInput.toLowerCase() === historylist[i].toLowerCase()) {
                return;
            }
        }
    }


    if (searchInput != "") {
        historylist.push(searchInput);
        localStorage.setItem(historyname, JSON.stringify(historylist));
    }


    $('#history').html("");
    for (let i = 0; i < historylist.length; i++) {

        let historyEl = $('<button class = "historyLi">');
        historyEl.text(historylist[i]);
        $('#history').append(historyEl);
    }

}





// 5 Day forecast API Call = https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

// geocoding API Call: http://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid={API key}


