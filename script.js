$(document).ready(function () {
    var apikey = "1c401654af94d9b2ae6b6197c14f20ec",
        googApiKey = "AIzaSyCI3zv9mMZuVUPGueGVIYUyD3etz0VJK7I",
        zamatoKey = "1c401654af94d9b2ae6b6197c14f20ec",
        queryTerm = "",
        queryURL = "https://developers.zomato.com/api/v2.1/locations?query=" + "city" + "&apikey=" + apikey,
       
        places = document.getElementById("places"),
        geo = navigator.geolocation;

setMapCanvas();
setUsersCurrentPosition();


$('#searchBtn').on("click", function () {
    var city = places.value
    var queryURL = "https://developers.zomato.com/api/v2.1/locations?query=" + city + "&apikey=" + apikey;
    $.ajax({
        url: queryURL,
        cors: true
    }).then(data => {
        var entityId = data.location_suggestions[0].entity_id;
        var entityType = data.location_suggestions[0].entity_type;
        var queryURL = "https://developers.zomato.com/api/v2.1/location_details?entity_id=" + entityId + "&entity_type=" + entityType + "&apikey=" + apikey;
        $.ajax({
            url: queryURL,
            cors: true
        }).then(data => {
            console.log(data);
        })
    })
})

function setUsersCurrentPosition() {
    geo.getCurrentPosition(function (position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        var coords = {lat : lat, lng : lng};
        console.log(coords);
        $.ajax({
            url: "https://developers.zomato.com/api/v2.1/geocode?lat=" + lat + "&lon=" + lng + "&apikey=" + zamatoKey + "",
            method: "GET"
        }).then(function (food) {
            console.log(food);
            var wellSection = document.getElementById("wellSection")
            var allRest = food.nearby_restaurants;
            allRest.forEach(function(data){ 
                var info = data.restaurant;
                var p = document.createElement("p");
                var cuisines = info.cuisines;
                var apikey = info.apikey;
                p.innerText = cuisines + apikey;
                wellSection.appendChild(p);
            })
        })
        initMap(coords);
    })
        $('.class').text('variable');
$("wellSection").empty();
}    


function setMapCanvas() {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.src =
        "https://maps.googleapis.com/maps/api/js?callback=initMap&key=" +
        googApiKey +
        "";
    document.getElementsByTagName("head")[0].appendChild(script);
    }

    function initMap(coords) {
    var display = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: coords,
        disableDefaultUI: true
    }),
    marker = new google.maps.Marker({ position: coords, map: display });
}

})