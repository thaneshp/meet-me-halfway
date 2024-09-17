const mapStyles = [
    {
        featureType: "all",
        elementType: "all",
        stylers: [{ saturation: -50 }],
    },
];

let map;
let marker;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        styles: mapStyles,
        fullscreenControl: false,
    });

    addAddress();
}

let pendingAddresses = [];

function addAddress() {
    let marker1 = new google.maps.Marker({ map: map });
    let marker2 = new google.maps.Marker({ map: map });

    let input1 = document.getElementById("address-input");
    let input2 = document.getElementById("second-address-input");

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
    let place = autocomplete.getPlace();

    if (place.geometry) {
        marker.setPosition(place.geometry.location);
        map.setCenter(place.geometry.location);
        map.setZoom(10);

        pendingAddresses.push({
            place: place,
            address: place.formatted_address,
            input: input,
            marker: marker,
        });

        if (pendingAddresses.length === 2) {
            for (let { address, input, marker } of pendingAddresses) {
                addAddressToPanel(address, input, marker);
            }
            midPoint = calculateMidPoint();
            addMidPointMarker(midPoint);
            pendingAddresses = [];

            document.getElementById("add-address-btn").style.display = "none";
        }
    } else {
        console.log("The place doesn't have a geometry.");
    }
}

function addAddressToPanel(address, input, marker) {
    let addressDiv = document.createElement("div");
    addressDiv.textContent = address;

    let sidePanel = document.getElementById("side-panel");
    let addAddressBtn = document.getElementById("add-address-btn");
    sidePanel.insertBefore(addressDiv, addAddressBtn);

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

    addNearbyRestaurants(midPoint, 5000);
}

function addNearbyRestaurants(midPoint, radius) {
    // Create a PlacesService instance
    let service = new google.maps.places.PlacesService(map);

    service.nearbySearch(
        {
            location: midPoint,
            radius: radius,
            type: ["restaurant"],
        },
        function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < results.length; i++) {
                    createRestaurantMarker(results[i]);
                }
            }
        }
    );

    let sidePanel = document.getElementById("side-panel");
    sidePanel.style.left = "-290px";
}

function createRestaurantMarker(place) {
    let marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    });

    marker.addListener("click", function () {
        let service = new google.maps.places.PlacesService(map);
        service.getDetails(
            {
                placeId: place.place_id,
                fields: [
                    "name",
                    "formatted_address",
                    "formatted_phone_number",
                    "rating",
                    "user_ratings_total",
                    "opening_hours",
                    "place_id",
                ],
            },
            function (placeDetails, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    displayPlaceDetails(placeDetails);
                }
            }
        );
    });
}

function displayPlaceDetails(place) {
    let name = place.name;
    let address = place.formatted_address;
    let rating = place.rating || "N/A";
    let totalRatings = place.user_ratings_total || 0;
    let phoneNumber = place.formatted_phone_number || "Not available";
    let openNow = place.opening_hours && place.opening_hours.open_now;
    let hours = place.opening_hours && place.opening_hours.weekday_text;
    let placeId = place.place_id;

    let hoursHTML = "Hours not available";
    if (hours) {
        hoursHTML = `
            <table>
                ${hours
                    .map((day) => {
                        let [dayName, dayHours] = day.split(": ");
                        return `<tr><td>${dayName}</td><td>${dayHours}</td></tr>`;
                    })
                    .join("")}
            </table>
        `;
    }

    let googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        name
    )}&query_place_id=${placeId}`;
    let reviewsUrl = `https://search.google.com/local/reviews?placeid=${placeId}`;
    let restaurantPanel = document.getElementById("restaurant-panel");
    restaurantPanel.innerHTML = `
        <div class="close-btn"><i class="fas fa-times"></i></div>
        <div class="restaurant-content">
            <h1>${name}</h1>
            <div class="address">${address}</div>
            <div class="phone">${phoneNumber}</div>
            <div class="rating">
                Rating ${rating} 
                <span class="stars">${"★".repeat(Math.round(rating))}${"☆".repeat(5 - Math.round(rating))}</span> 
                ${totalRatings} reviews 
                <a href="${reviewsUrl}" target="_blank" rel="noopener noreferrer" class="reviews">
                    See all reviews <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
            <div class="hours">
                Opening hours 
                <span class="${openNow ? "open" : "closed"}">${openNow ? "OPEN" : "CLOSED"}</span>
                ${hoursHTML}
            </div>
            <div class="google-maps-link">
                <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer">
                    Open in Google Maps <i class="fas fa-map-marker-alt"></i>
                </a>
            </div>
        </div>
    `;

    let closeBtn = restaurantPanel.querySelector(".close-btn");
    closeBtn.addEventListener("click", closeRestaurantPanel);

    restaurantPanel.style.display = "block";
    document.getElementById("map").style.width = "calc(100% - 400px)";
}

function closeRestaurantPanel() {
    let restaurantPanel = document.getElementById("restaurant-panel");
    restaurantPanel.style.display = "none";
    document.getElementById("map").style.width = "100%";
}

window.onload = initMap;
