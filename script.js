
$(document).ready(function () {
  var  zamatoKey = "1c401654af94d9b2ae6b6197c14f20ec",
       geo = navigator.geolocation,
       nextRestaurant = 2,
       mapDisplay;

  //get nearby restaurants on document load.
  setUsersCurrentPosition();
  showHistory();

  //listen for the enter key from search fields.
$("input").keyup(function(event) {
  if (event.keyCode === 13) {
    $('#search-btn').click();
  }
});

  //Main event.
  $("#search-btn").on("click", function () {
    var searchItem = $("#search-query").val().trim();

    setInLocalStorage(searchItem);
    geo.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      lng = position.coords.longitude;

    $.ajax({
      url:
        "https://developers.zomato.com/api/v2.1/cuisines?lat=" 
        + lat +
        "&lon=" + lng +
        "&apikey=" + zamatoKey +"",
      method: "GET"
    }).then(function (cuisines) {
      
      var cuisineId = getCuisineId(cuisines, searchItem).toString();

      $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search?lat=" 
        + lat +
        "&lon=" + lng +
        "&cuisines=" + cuisineId +
        "&apikey=" + zamatoKey +"",
        method: "GET"
      }).then(function (food) {
        
        console.log(food);
        var allRest = food.restaurants;
        console.log(allRest);
        
        getMarkers(allRest);
        paintResults(allRest);
      });
    });});
    //Clear search field.
    $("#search-query").val('');
  });

  function setUsersCurrentPosition() {
    geo.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      var coords = { lat: lat, lng: lng };
      initMap(coords);
      console.log(coords);
      $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search?lat=" 
        + lat +
        "&lon=" + lng +
        "&apikey=" + zamatoKey +"",
        method: "GET"
      }).then(function (food) {
        console.log(food);
        
        var allRest = food.restaurants;
        paintResults(allRest)
        getMarkers(allRest);
        });
    });
  }

  function getCuisineId(data, searchItem) { 
    var cuisines = data.cuisines,
        id;
  
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
   }

  function paintResults(results) {
    
    paintOne(results[0]);
    paintTwo(results[1]);
    paintThree(results[2]);
  
  //Event listener for replacing result
  $('.replace-one').click(function() { 
    if (nextRestaurant > 20) {
      var message = "Sorry! There are no more results nearby";
    } else {
    nextRestaurant ++;
    paintOne(results[nextRestaurant])
    }
  })
  $('.replace-two').click(function() { 
    if (nextRestaurant > 20) {
      var message = "Sorry! There are no more results nearby";
    } else {
    nextRestaurant ++;
    paintTwo(results[nextRestaurant])
    }
  })
  $('.replace-three').click(function() { 
    if (nextRestaurant > 20) {
      var message = "Sorry! There are no more results nearby";
    } else {
    nextRestaurant ++;
    paintThree(results[nextRestaurant])
    }
  })
 }

 function paintOne(restaurant) {
  var name = restaurant.restaurant.name,
    address = restaurant.restaurant.location.address,
    hours = restaurant.restaurant.timings,
    infoUrl = restaurant.restaurant.menu_url,
    usrRating = restaurant.restaurant.user_rating.aggregate_rating,
    ratingText = restaurant.restaurant.user_rating.rating_text,
    type = restaurant.restaurant.cuisines,
    phone = restaurant.restaurant.phone_numbers,
    picUrl = 'https://sanitainsicilia.it/wp-content/uploads/2019/06/Cibo-e-cultura.jpg';

  //use only first phone number provided when there are multiple.
  var phoneArr = phone.split(',');
      phone = phoneArr[0];

  //reformat phone number for a clickable call link.
  var phoneLink = phone.replace("(", "");
      phoneLink = phoneLink.replace(")", "");
      phoneLink = phoneLink.replace("-", "");
      phoneLink = phoneLink.replace(" ", "");
  
    //try to find missing images elsewhere in data or leave them set to a default pic.
    if (typeof(restaurant.restaurant.photos) !== "undefined" && restaurant.restaurant.photos[0].photo.thumb_url !== "") {
      picUrl = restaurant.restaurant.photos[0].photo.thumb_url;
    } else if ((typeof(restaurant.restaurant.thumb) !== "undefined" && restaurant.restaurant.thumb !== ""))  { 
      picUrl = restaurant.restaurant.thumb;
    }
  $('.name1').text(name);
  $('.type1').text(type);
  $('.pic1').attr('src', picUrl);
  $('.address1').text('Address: '+address);
  $('.address1').attr('target:', '_blank');
  $('.hours1').text('Hours: '+hours);
  $('.url1').attr('href', infoUrl);
  $('.rating1').text('Avg Customer Rating: '+usrRating+' ('+ratingText+')');
  $('.contact1').attr('href', 'tel:'+phoneLink); //call from mobile device
  $('.call1').text('  '+phone);
}
 
 function paintTwo(restaurant) {
  var name = restaurant.restaurant.name,
      address = restaurant.restaurant.location.address,
      hours = restaurant.restaurant.timings,
      infoUrl = restaurant.restaurant.menu_url,
      usrRating = restaurant.restaurant.user_rating.aggregate_rating,
      ratingText = restaurant.restaurant.user_rating.rating_text,
      type = restaurant.restaurant.cuisines,
      phone = restaurant.restaurant.phone_numbers,
      picUrl = 'https://sanitainsicilia.it/wp-content/uploads/2019/06/Cibo-e-cultura.jpg';

      //use only first phone number provided when they are multiple.
      var phoneArr = phone.split(',');
      phone = phoneArr[0];

      //reformat phone number for a clickable call link.
      var phoneLink = phone.replace("(", "");
      phoneLink = phoneLink.replace(")", "");
      phoneLink = phoneLink.replace("-", "");
      phoneLink = phoneLink.replace(" ", "");

      //try to find missing images elsewhere in data or leave them set to a default pic.
      if (typeof(restaurant.restaurant.photos) !== "undefined" && restaurant.restaurant.photos[0].photo.thumb_url !== "") {
        picUrl = restaurant.restaurant.photos[0].photo.thumb_url;
      } else if ((typeof(restaurant.restaurant.thumb) !== "undefined" && restaurant.restaurant.thumb !== ""))  { 
        picUrl = restaurant.restaurant.thumb;
      }
  $('.name2').text(name);
  $('.type2').text(type);
  $('.pic2').attr('src', picUrl);
  $('.address2').text('Address: '+address);
  $('.address2').attr('target:', '_blank');
  $('.hours2').text('Hours: '+hours);
  $('.url2').attr('href', infoUrl);
  $('.rating2').text('Avg Customer Rating: '+usrRating+' ('+ratingText+')');
  $('.contact2').attr('href', 'tel:'+phoneLink); //call from mobile device
  $('.call2').text('  '+phone);
 }
 

 function paintThree(restaurant) {
  var name = restaurant.restaurant.name,
      address = restaurant.restaurant.location.address,
      hours = restaurant.restaurant.timings,
      infoUrl = restaurant.restaurant.menu_url,
      usrRating = restaurant.restaurant.user_rating.aggregate_rating,
      ratingText = restaurant.restaurant.user_rating.rating_text,
      type = restaurant.restaurant.cuisines,
      phone = restaurant.restaurant.phone_numbers,
      picUrl = 'https://sanitainsicilia.it/wp-content/uploads/2019/06/Cibo-e-cultura.jpg';

      //use only first phone number provided when they are multiple.
      var phoneArr = phone.split(',');
      phone = phoneArr[0];

      //reformat phone number for a clickable call link.
      var phoneLink = phone.replace("(", "");
      phoneLink = phoneLink.replace(")", "");
      phoneLink = phoneLink.replace("-", "");
      phoneLink = phoneLink.replace(" ", "");

      //try to find missing images elsewhere in data or leave them set to a default pic.
      if (typeof(restaurant.restaurant.photos) !== "undefined" && restaurant.restaurant.photos[0].photo.thumb_url !== "") {
        picUrl = restaurant.restaurant.photos[0].photo.thumb_url;
      } else if ((typeof(restaurant.restaurant.thumb) !== "undefined" && restaurant.restaurant.thumb !== ""))  { 
        picUrl = restaurant.restaurant.thumb;
      }
  $('.name3').text(name);
  $('.type3').text(type);
  $('.pic3').attr('src', picUrl);
  $('.address3').text('Address: '+address);
  $('.address3').attr('target:', '_blank');
  $('.hours3').text('Hours: '+hours);
  $('.url3').attr('href', infoUrl);
  $('.rating3').text('Avg Customer Rating: '+usrRating+' ('+ratingText+')');
  $('.contact3').attr('href', 'tel:'+phoneLink); //call from mobile device
  $('.call3').text('  '+phone);
  }

function setInLocalStorage(cuisine) {
  var searches; 
        
  if (localStorage.getItem("search") === null) {
    searches = [];
  } else {
    searches = JSON.parse(localStorage.getItem("search"));
  }
  if (searches.includes(cuisine)){return}
  searches.push(cuisine);
  localStorage.setItem("search", JSON.stringify(searches));
  showHistory(cuisine);
}

function showHistory() {
  var history;  
  if (localStorage.getItem("search") === null) {
    history = [];
  } else {
    history = JSON.parse(localStorage.getItem("search"));
  }
  //reset current list
  document.querySelector("#history").textContent = "";

  var container = document.getElementById('history'),
      ul = document.createElement("ul");

  ul.className = 'menu-list';

  //The rest of them
  history.forEach(function(search)  {
    var a = document.createElement("a"),
        li = document.createElement("li");

    a.addEventListener('click', function(){
      $("#search-query").val(search)
      $('#search-btn').click()
    })
    a.appendChild(document.createTextNode(search));
    li.appendChild(a);
    ul.appendChild(li);
  })
  container.appendChild(ul);
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

});
