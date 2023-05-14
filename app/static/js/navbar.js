function toggleMenu() {
    const sidePanel = document.getElementById('side-panel');
    sidePanel.style.left = sidePanel.style.left === '0px' ? '-290px' : '0px';
}
  
function toggleSearchInput() {
    const searchInputContainer = document.getElementById('search-input-container');
    searchInputContainer.style.display = searchInputContainer.style.display === 'none' ? 'block' : 'none';

    const secondSearchInputContainer = document.getElementById('second-search-input-container');
    secondSearchInputContainer.style.display = secondSearchInputContainer.style.display === 'none' ? 'block' : 'none';
}