$(document).ready(function () {
  var  zamatoKey = "1c401654af94d9b2ae6b6197c14f20ec",
       apikey,
       geo = navigator.geolocation,
       mapDisplay;
  //get nearby restaurants on document load.
  setUsersCurrentPosition();
  //Main event.
  $("#search-btn").on("click", function () {
    var searchItem = $(".search-text").val().trim();
    showSearch(searchItem);
        geo.getCurrentPosition(function (position) {
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          var coords = { lat: lat, lng: lng };
          console.log(coords);
          $.ajax({
            url:
              "https://developers.zomato.com/api/v2.1/cuisines?lat=" +
              lat +
              "&lon=" +
              lng +
              "&apikey=" +
              zamatoKey +
              "",
            method: "GET"
          }).then(function (cuisines) {
            console.log(cuisines);
            var cuisineId = getCuisineId(cuisines, searchItem).toString();
          console.log(cuisineId);
          var reqUrl = "https://developers.zomato.com/api/v2.1/search?lat=" +
          lat +
          "&lon=" + lng +
          "&cuisines=" + cuisineId +
          "&apikey=" + zamatoKey +
          "";
            $.ajax({
              url: reqUrl,
              method: "GET"
            }).then(function (food) {
              console.log(food);
              var allRest = food.restaurants;
              getMarkers(allRest);
            });
            });
          });
        });
  function getCuisineId(data, searchItem) { 
    var cuisines = data.cuisines,
        id;
   console.log(cuisines);
   console.log(typeof(cuisines));
    cuisines.forEach(function(cuisine) {
      var foodType = cuisine.cuisine.cuisine_name.toLowerCase(),
          idNum = cuisine.cuisine.cuisine_id;
      if (foodType == searchItem.toLowerCase()) {
        id = idNum;
      } else {
        var message = "Oh No! Nothing found! Check your spelling to be sure.";
      }
    });
    return id;
   };
  function setUsersCurrentPosition() {
    geo.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      var coords = { lat: lat, lng: lng };
      initMap(coords);
      console.log(coords);
      $.ajax({
        url:
          "https://developers.zomato.com/api/v2.1/geocode?lat=" +
          lat +
          "&lon=" +
          lng +
          "&apikey=" +
          zamatoKey +
          "",
        method: "GET"
      }).then(function (food) {
        console.log(food);
        var wellSection = document.getElementById("wellSection")
            var allRest = food.nearby_restaurants;
            allRest.forEach(function(data){ 
                var info = data.restaurant;
                var p = document.createElement("p");
                var cuisines = info.cuisines;
                var resCloseOne = info.cuisines[0];
                var resAddy = info.location.address;
                var resPhoto = info.photos_url;
                p.innerText = cuisines + resCloseOne  + resAddy + resPhoto;// address, phone, name, cusines, picture, url 
                wellSection.appendChild(p);
            });
        getMarkers(allRest);
      });
    });
  }
  function initMap(coords) {
    mapDisplay = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      center: coords,
      disableDefaultUI: true
    }),
      marker = new google.maps.Marker({ position: coords, map: mapDisplay });
  }
function getMarkers(restuarants) {
  var markers = [],
      locations = [],
      bounds = new google.maps.LatLngBounds();
  //Set the coordinates into a Json format.
  restuarants.forEach(function(restaurant) {
      var coords = {
          lat : restaurant.restaurant.location.latitude,
          lng : restaurant.restaurant.location.longitude
      } 
      locations.push(coords)
  });
  //generate markers for each restaurant location. 
  locations.forEach(function (location) {
      var position = new google.maps.LatLng(location.lat, location.lng);
      markers.push(
        new google.maps.Marker({
          position: position,
          map: mapDisplay,
          animation: google.maps.Animation.DROP,
          icon: {url : "http://maps.google.com/mapfiles/kml/pal2/icon37.png"}
        })
      );
      //extend map bounds with each new position.  
      bounds.extend(position);
    });
    //re-center map around the extended boundaries.
    mapDisplay.fitBounds(bounds);
}
function showSearch(cuisine) {
  var searches = JSON.parse(localStorage.getItem("search"));
  if (searches) {
    searches.push(cuisine);
  } else {
    searches = [cuisine];
  }
  localStorage.setItem("search", JSON.stringify(searches));
console.log(searches);
  $("#past-search").append(searches);
}
});