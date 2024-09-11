const mapStyles = [
  {
    featureType: "all",
    elementType: "all",
    stylers: [{ saturation: -50 }],
  },
];

// Declare map and marker as global variables
let map;
let marker;

function initMap() {
  // Initialize the map
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
    styles: mapStyles,
  });

  addAddress();
}

let pendingAddresses = [];

function addAddress() {
  // Initialize the markers but don't set a position yet
  let marker1 = new google.maps.Marker({ map: map });
  let marker2 = new google.maps.Marker({ map: map });

  // Get the input elements
  let input1 = document.getElementById("address-input");
  let input2 = document.getElementById("second-address-input");

  // Initialize the autocompletes
  let autocomplete1 = new google.maps.places.Autocomplete(input1);
  let autocomplete2 = new google.maps.places.Autocomplete(input2);

  autocomplete1.addListener("place_changed", function () {
    updateMap(autocomplete1, marker1, input1);
  });

  autocomplete2.addListener("place_changed", function () {
    updateMap(autocomplete2, marker2, input2);
  });
}

function updateMap(autocomplete, marker, input) {
  // Get the place that the user selected
  let place = autocomplete.getPlace();

  // If the place has a geometry, then add it to the map
  if (place.geometry) {
    // Set the position of the marker
    marker.setPosition(place.geometry.location);

    // Center the map to the place the user selected
    map.setCenter(place.geometry.location);

    // Set the zoom level to 10
    map.setZoom(10);

    // Add the address to the pendingAddresses array
    pendingAddresses.push({
      place: place,
      address: place.formatted_address,
      input: input,
      marker: marker,
    });

    // If two addresses have been entered, add them to the side panel and clear the array
    if (pendingAddresses.length === 2) {
      for (let { address, input, marker } of pendingAddresses) {
        addAddressToPanel(address, input, marker);
      }
      midPoint = calculateMidPoint();
      addMidPointMarker(midPoint);
      pendingAddresses = [];

      // Hide the "Add Address" button
      document.getElementById("add-address-btn").style.display = "none";
    }
  } else {
    console.log("The place doesn't have a geometry.");
  }
}

function addAddressToPanel(address, input, marker) {
  // Create a new div for the address
  let addressDiv = document.createElement("div");
  addressDiv.textContent = address;

  // Create a delete button
  let deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", function () {
    // Remove the address div from the side panel
    addressDiv.remove();

    // Remove the marker from the map
    marker.setMap(null);

    // Show the add address button again
    document.getElementById("add-address-btn").style.display = "block";
  });

  // Append the delete button to the address div
  addressDiv.appendChild(deleteBtn);

  // Append the address div to the side panel
  let sidePanel = document.getElementById("side-panel");
  let addAddressBtn = document.getElementById("add-address-btn");
  sidePanel.insertBefore(addressDiv, addAddressBtn);

  // Clear the input box and hide it
  input.value = "";
  input.parentElement.style.display = "none";
}

function calculateMidPoint() {
  address1 = pendingAddresses[0];
  address2 = pendingAddresses[1];

  // Address1 latitude and longitude
  lat1 = toRadians(address1.place.geometry.location.lat());
  lon1 = toRadians(address1.place.geometry.location.lng());

  // Address2 latitude and longitude
  lat2 = toRadians(address2.place.geometry.location.lat());
  lon2 = toRadians(address2.place.geometry.location.lng());

  // Compute the midpoint
  var Bx = Math.cos(lat2) * Math.cos(lon2 - lon1);
  var By = Math.cos(lat2) * Math.sin(lon2 - lon1);
  var midLat = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By)
  );
  var midLon = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);

  // Convert the result back to degrees
  midLat = toDegrees(midLat);
  midLon = toDegrees(midLon);

  return { lat: midLat, lng: midLon };
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

function addMidPointMarker(midPoint) {
  let midPointMarker = new google.maps.Marker({
    position: midPoint,
    map: map,
    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  });

  let circle = new google.maps.Circle({
    map: map,
    radius: 5000,
    fillColor: "#0000FF",
    strokeColor: "blue",
    strokeWeight: 0.5,
  });
  circle.bindTo("center", midPointMarker, "position");

  map.setCenter(midPoint);
  map.setZoom(11);

  // Call the addNearbyRestaurants function here
  addNearbyRestaurants(midPoint, 5000); // 5000 meters radius, you can change this value
}

function addNearbyRestaurants(midPoint, radius) {
  // Create a PlacesService instance
  let service = new google.maps.places.PlacesService(map);

  // Perform a nearby search for restaurants within the circle's radius
  // Only one type can be performed at a time
  service.nearbySearch(
    {
      location: midPoint,
      radius: radius,
      type: ["restaurant"],
    },
    function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
          // Place a marker for each restaurant found
          createRestaurantMarker(results[i]);
        }
      }
    }
  );

  let sidePanel = document.getElementById("side-panel");
  sidePanel.style.left = "-290px";
  console.log(sidePanel);
}

function createRestaurantMarker(place) {
  let marker = new google.maps.Marker({
    position: place.geometry.location,
    map: map,
    icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
  });

  marker.addListener("click", function () {
    let name = place.name;
    let address = place.vicinity;
    let photoUrl = "";
    let rating = place.rating || "N/A";
    let totalRatings = place.user_ratings_total || 0;
    let phoneNumber = place.formatted_phone_number || "Not available";
    let openNow = place.opening_hours && place.opening_hours.open_now;
    let hours = place.opening_hours && place.opening_hours.weekday_text;

    if (place.photos && place.photos.length > 0) {
      photoUrl = place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 });
    }

    let restaurantPanel = document.getElementById("restaurant-panel");
    restaurantPanel.innerHTML = `
            <div class="restaurant-content">
                <h1>${name}</h1>
                <div class="address">📍 ${address}</div>
                <div class="phone">📞 ${phoneNumber}</div>
                <div class="rating">
                    Rating ${rating} 
                    <span class="stars">${"★".repeat(
                      Math.round(rating)
                    )}${"☆".repeat(5 - Math.round(rating))}</span> 
                    ${totalRatings} reviews 
                    <a href="#" class="reviews">See all reviews</a>
                </div>
                <div class="directions">
                    <a href="#" class="directions">Get driving directions</a>
                </div>
                <div class="hours">
                    Opening hours 
                    ${
                      openNow
                        ? '<span class="open">OPEN</span>'
                        : '<span class="closed">CLOSED</span>'
                    }
                    <table>
                        ${
                          hours
                            ? hours
                                .map((day) => `<tr><td>${day}</td></tr>`)
                                .join("")
                            : "Hours not available"
                        }
                    </table>
                </div>
                ${
                  photoUrl
                    ? `<img src="${photoUrl}" alt="${name}" class="restaurant-image">`
                    : ""
                }
            </div>
        `;
    restaurantPanel.style.display = "block";
    document.getElementById("map").style.width = "calc(100% - 400px)";
  });
}

window.onload = initMap;
