$(document).ready(function () {
    var apikey = "1c401654af94d9b2ae6b6197c14f20ec";
    var queryTerm = "";
    //var philly = "https://developers.zomato.com/api/v2.1/locations?query=" + "Philadelphia" + "&apikey=" + apikey
    var queryURL = "https://developers.zomato.com/api/v2.1/locations?query=" + "city" + "&apikey=" + apikey;
    var resturants = "https://developers.zomato.com/api/v2.1/restaurant?res_id=" + "16774318" + "&apikey=" + apikey;
    var places = document.getElementById("places");
    $.ajax({
        url: queryURL,
        cors: true
    }).then(data => {
        //console.log(data) 
    })
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
        var geo = navigator.geolocation,
            googApiKey = "AIzaSyCI3zv9mMZuVUPGueGVIYUyD3etz0VJK7I",
            zamatoKey = "1c401654af94d9b2ae6b6197c14f20ec";
        setUsersCurrentPosition()
        function setUsersCurrentPosition() {
            geo.getCurrentPosition(function (position) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                console.log(lat, lng);
                $.ajax({
                    url: "https://developers.zomato.com/api/v2.1/geocode?lat=" + lat + "&lon=" + lng + "&apikey=" + zamatoKey + "",
                    method: "GET"
                }).then(function (food) {
                    var wellSection = document.getElementById("wellSection")
                    var allRest = food.nearby_restaurants;
                    allRest.forEach(function(data){
                        var info = data.restaurant;
                        var p = document.createElement("p");
                        var cuisines = info.cuisines;
                        var apikey = info.apikey;
                        p.innerText = cuisines + apikey;
                        wellSection.appendChild(p)
                    })
                    var apikey
                    console.log(food);
                })
            })
        }
                $('.class').text('variable');
        $("wellSection").empty();
        // for (var i = 0; i < data) {
        // }
    })
})