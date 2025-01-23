const openInfo = document.querySelector('#open-info');
const popupInfo = document.querySelector('#information');
const closeInfo = document.querySelector('#close-popup');

openInfo.addEventListener('click', () => {
    popupInfo.style.zIndex = "1";

    console.log('abrir')
});

closeInfo.addEventListener('click', () => {
    popupInfo.style.zIndex = "-1";

    console.log('cerrar')
});