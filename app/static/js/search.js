const mapStyles = [
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
            { "saturation": -50 }
        ]
    }
];

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

    addAddress()
}

let pendingAddresses = [];

function addAddress() {

    // Initialize the markers but don't set a position yet
    let marker1 = new google.maps.Marker({ map: map });
    let marker2 = new google.maps.Marker({ map: map });

    // Get the input elements
    let input1 = document.getElementById('address-input');
    let input2 = document.getElementById('second-address-input');

    // Initialize the autocompletes
    let autocomplete1 = new google.maps.places.Autocomplete(input1);
    let autocomplete2 = new google.maps.places.Autocomplete(input2);

    autocomplete1.addListener('place_changed', function() {
        updateMap(autocomplete1, marker1, input1);
    });

    autocomplete2.addListener('place_changed', function() {
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
        pendingAddresses.push({ address: place.formatted_address, input: input, marker: marker });

        // If two addresses have been entered, add them to the side panel and clear the array
        if (pendingAddresses.length === 2) {
            for (let { address, input, marker } of pendingAddresses) {
                addAddressToPanel(address, input, marker);
            }
            pendingAddresses = [];
            
            // Hide the "Add Address" button
            document.getElementById('add-address-btn').style.display = 'none';
        }
    } else {
        console.log("The place doesn't have a geometry.");
    }
}

function addAddressToPanel(address, input, marker) {
    // Create a new div for the address
    let addressDiv = document.createElement('div');
    addressDiv.textContent = address;

    // Create a delete button
    let deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function() {
        // Remove the address div from the side panel
        addressDiv.remove();

        // Remove the marker from the map
        marker.setMap(null);

        // Show the add address button again
        document.getElementById('add-address-btn').style.display = 'block';
    });

    // Append the delete button to the address div
    addressDiv.appendChild(deleteBtn);

    // Append the address div to the side panel
    let sidePanel = document.getElementById('side-panel');
    let addAddressBtn = document.getElementById('add-address-btn');
    sidePanel.insertBefore(addressDiv, addAddressBtn);

    // Clear the input box and hide it
    input.value = '';
    input.parentElement.style.display = 'none';
}

window.onload = initMap;