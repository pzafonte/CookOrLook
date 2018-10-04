# Cook or Look

## Description

Is a website that helps you find websites or restaurants when you're hungry and can't decide what to do.

## Usage

Enter a search term and location to get both restaurants near the location you input and recipes.

## Under the Hood

Cook or Look uses the foursquare API, edamam API, animate.css, and bootstrap.

### Foursquare API calls

General Venue Search

GET https://api.foursquare.com/v2/venues/search

Venue Photos

GET https://api.foursquare.com/v2/venues/VENUE_ID/photos

Venue Tips

GET https://api.foursquare.com/v2/venues/VENUE_ID/tips

Venue Links

GET https://api.foursquare.com/v2/venues/VENUE_ID/links

### Edamam

GET https://api.edamam.com/search

### animate.css

animate.css is a bunch of cool, fun, and cross-browser animations for you to use in your projects. Great for emphasis, home pages, sliders, and general just-add-water-awesomeness written by Facebook Designer Daniel Eden. All we needed to do was add the correct classes to HTML elements and it animated!

### bootstrap.css

We used bootstrap mostly to create the cards for the restaurants and recipes. We used card-columns to make a nice masonry-style grid for the recipe cards. We also used it for the modal if the user gave no input.


