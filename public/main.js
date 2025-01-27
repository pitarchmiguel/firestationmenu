const moreInfo = document.querySelector('#open-info');
const OpenedInfo = document.querySelector('#information');
const closeInfo = document.querySelector('#close-popup');

moreInfo.addEventListener('click', () => {
    OpenedInfo.classList.toggle('hidden');
    console.log('clicked');
});

closeInfo.addEventListener('click', () => {
    OpenedInfo.classList.toggle('hidden');
    console.log('closed');
});