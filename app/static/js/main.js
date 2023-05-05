const mapStyles = [
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
            { "saturation": -50 }
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const sidePanel = document.getElementById('side-panel');
    const body = document.querySelector('body');
    
    if (body.classList.contains('search-page')) {
      sidePanel.style.left = '0px';
    } else {
      sidePanel.style.left = '-290px';
    }
});
  

function toggleMenu() {
  const sidePanel = document.getElementById('side-panel');
  sidePanel.style.left = sidePanel.style.left === '0px' ? '-290px' : '0px';
}


function initMap() {
    new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        styles: mapStyles
    });
}

function toggleSearchInput() {
  const searchInputContainer = document.getElementById('search-input-container');
  searchInputContainer.style.display = searchInputContainer.style.display === 'none' ? 'block' : 'none';
}