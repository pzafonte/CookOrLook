$(document).ready(function () {
  $("#headerRow").hide();
  var edamamAppId = "919ca68b";
  var edamamApiKey = "025e31a83b87bf9cc6cdf813e6a3da39";

  //Henry's FOURSQUARE API INFO
  // var foursquareClientId = "CCB33WHFYPDPAAVR3D2YNRFEMWT1TM3HWHWFBDMM5MVKWE0X";
  // var foursquareClientSecret = "G2QO2ALFA2RJHREZIZIVHD35AFIUSIIOPAW2YPUCIXJE4N03";

  //Peter's FOURSQUARE API Info
  // var foursquareClientId = "1M52NGCBLS0MUK3HBG1AVRDIOCGW3ZPXW3AVQOLS5FS4CIYW";
  // var foursquareClientSecret = "LACZZB5UQAIAGQWRB25EMBTVZOECUP4JLQMMZTCAIS1MKVF3";

  //Patrick's FOURSQUARE API Info
  var foursquareClientId = "B0HAMAHTQD4FPS54HEDYVX5DSK5NUAHKYMU151KU0A5YXGAV";
  var foursquareClientSecret = "QTBOGBUPYD0HFOV30CVNMYQGADU2HBE0FTZYMCUNKOHGHZ53";


  var getRecipes = function (searchTerm) {
    var queryURL = `https://api.edamam.com/search?q=${searchTerm}&app_id=${edamamAppId}&app_key=${edamamApiKey}&from=0&to=6`

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {

      console.log(response);
      parseRecipeObjToDOM(response);

    });
  }

  var getRestaurants = function (searchTerm, location) {

    var restaurantQueryURL = `https://api.foursquare.com/v2/venues/search?client_id=${foursquareClientId}&client_secret=${foursquareClientSecret}&limit=3&near=${location}&query=${searchTerm}&v=20180323`;

    $.ajax({
      url: restaurantQueryURL,
      method: "GET"
    }).then(function (venueObj) {
  
      console.log(venueObj);
      $("#restaurants").html("");

      getVenueInfo(0);

      function getVenueInfo(i) {
        if (i < venueObj.response.venues.length) {

          parseRestaurantObjToDOM(venueObj, i);
          var venueID = venueObj.response.venues[i].id;
          var photoQueryURL = `https://api.foursquare.com/v2/venues/${venueID}/photos?client_id=${foursquareClientId}&client_secret=${foursquareClientSecret}&v=20180323&limit=1`;

          //get photo
          $.ajax({
            url: photoQueryURL,
            method: "GET"
          }).then(function (venuePhotoObj) {

            var venuePhoto = venuePhotoObj.response.photos.items;
            console.log(venuePhoto);
            $(`#${venueID} img`).attr("src", venuePhoto[0].prefix + "original" + venuePhoto[0].suffix)
            
            // get menu
            return $.ajax({
              url: `https://api.foursquare.com/v2/venues/${venueID}/tips?client_id=${foursquareClientId}&client_secret=${foursquareClientSecret}&v=20180323`,
              method: "GET"
            })
          }).then(function(tipInfo) {
            console.log(tipInfo);
            var tips = tipInfo.response.tips.items;

            console.log(tips);

            for (var k = 0; k < tips.length; k++){
              $(`#${venueID} p`).text(tips[k].text);
              console.log(tips[k].text);
            }
            // var venueMenuLink = menuInfo.response.menu.provider.attributionLink;
            // console.log("Menu Link :" + venueMenuLink);

            //get links
            return $.ajax({
              url: `https://api.foursquare.com/v2/venues/${venueID}/links?client_id=${foursquareClientId}&client_secret=${foursquareClientSecret}&v=20180323`,
              method: "GET"
            })
          }).then(function(linkInfo) {
            console.log(linkInfo);
            var links = linkInfo.response.links.items;

            LinkLoop: //We want to break out of this loop when we get the first image.
            for (var j = 0; j < links.length; j ++)
            {
              if(links[j].url){
                $(`#${venueID} a`).attr("href", links[j].url).text("Link to restaurant!");
                console.log(links[j].url)
                break LinkLoop;
              }
            }

            i++;
            getVenueInfo(i);
          })
        }
      }

    });

  }

  var parseRecipeObjToDOM = function (recipeObj) {
    var recipes = recipeObj.hits;
    var recipeHTML;
    var recipeImgHTML;
    var recipeCardBody;
    var recipeTitle;
    var recipeText;
    var recipeIngredientListHTML;
    $("#recipes").html("");
    for (var i = 0; i < recipes.length; i++) {

      //Create HTML div block for recipe card top level
      recipeHTML = $("<div class='col-12 col-md-5 recipe card' id='r-" + i + "'>").css({"width": "18rem"});

      console.log(recipes[i].recipe.label);
      //Create HTML img block for recipe card second level
      recipeImgHTML = $("<img class='card-img-top'>").attr("src", recipes[i].recipe.image).attr("alt", "Picture of " + recipes[i].recipe.label);

      //Create HTML div block for recipe card second level
      recipeCardBody = $("<div class='card-body'>");
      recipeTitle = $("<h5 class='card-title'>").html(recipes[i].recipe.label);
      recipeText = $("<p class='card-text'>").text("Here are the ingredients you need to make your dish.");
      recipeLink = $("<a>").attr("href", recipes[i].recipe.url).text("Click here for the full recipe!");
      recipeCardBody.append(recipeText).append(recipeLink);

      //Create HTML ul block for recipe list  second level
      recipeIngredientListHTML = $("<ul class='list-group list-group-flush'>");

      for (var j = 0; j < recipes[i].recipe.ingredientLines.length; j++) {
        //loop through ingredients and create list items for recipe
        var recipeIngredientListItemHTML = $("<li class='list-group-item'>").html(recipes[i].recipe.ingredientLines[j]);
        recipeIngredientListHTML.append(recipeIngredientListItemHTML);
      }
      recipeCardBody.append(recipeIngredientListHTML);
      recipeHTML.append(recipeTitle).append(recipeImgHTML).append(recipeCardBody);

      console.log(recipeHTML);

      //write HTML to update the DOM
      $("#recipes").append(recipeHTML);
    }
  }

  var parseRestaurantObjToDOM = function (restaurantObj, i) {
    var restaurants = restaurantObj.response.venues;
    var restaurantHTML;
    var restaurantCardBody;
    var restaurantTitle;
    var restaurantFormattedAddress;

    //Create HTML div block for restaurant card top level
    restaurantHTML = $("<div class='restaurant card' id='l-" + i + "'>");
    restaurantID = restaurants[i].id;;

    //Create HTML img block for restaurant card second level

    restaurantInfo = $("<div id='"+restaurantID+"'>");
    restaurantImageHTML = $("<img class='card-img-top'>");
    var restaurantLink = $("<a class='links'>");
    var restaurantTips = $("<p class='tips'>");

    restaurantInfo.append(restaurantImageHTML);
    restaurantInfo.append(restaurantTips);
    restaurantInfo.append(restaurantLink);

    //Create HTML div block for restaurant card second level
    restaurantCardBody = $("<div class='card-body'>");
    restaurantTitle = $("<h5 class='card-title'>").html(restaurants[i].name);
    restaurantFormattedAddress = $("<p class='card-text'>").html(restaurants[i].location.formattedAddress);
    restaurantCardBody.append(restaurantTitle).append(restaurantFormattedAddress).append(restaurantTips).append(restaurantLink);
    restaurantHTML.append(restaurantInfo).append(restaurantCardBody);

    //write HTML to update the DOM
    $("#restaurants").append(restaurantHTML);
  }

  $("#get-results").on("click", function (event) {
    event.preventDefault();
    var location = $("#location-text").val().trim().toLowerCase();
    var searchTerm = $("#search-text").val().trim().toLowerCase();
    getRestaurants(searchTerm, location);
    getRecipes(searchTerm);
    $("#carouselExampleIndicators").hide();
    $("#headerRow").show();
  });
});