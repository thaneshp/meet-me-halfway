const mapStyles = [
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
            { "saturation": -50 }
        ]
    }
];

// document.addEventListener('load', () => {
//     console.log('DOM fully loaded and parsed');
//     const sidePanel = document.getElementById('side-panel');
//     const body = document.querySelector('body');
    
//     if (body.classList.contains('search-page')) {
//       sidePanel.style.left = '0px';
//     } else {
//       sidePanel.style.left = '-290px';
//     }
// });

// document.addEventListener('DOMContentLoaded', () => {
//     let input = document.getElementById('address-input');
//     let autocomplete = new google.maps.places.Autocomplete(input);

//     autocomplete.addListener('place_changed', function() {
//         let place = autocomplete.getPlace();
//         console.log(place.formatted_address);
//     });
// });


// Declare map and marker as global variables
let map;
let marker;

function initMap() {
    // Initialize the map
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        styles: mapStyles
    });
    
    // Initialize the marker but don't set a position yet
    marker = new google.maps.Marker({
        map: map
    });

    // Get the input element
    let input = document.getElementById('address-input');

    // Initialize the autocomplete
    let autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', function() {
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
        } else {
            console.log("The place doesn't have a geometry.");
        }
    });
}
