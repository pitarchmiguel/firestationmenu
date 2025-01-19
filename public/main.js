let openInfo = document.querySelector('#open-info');
let closeInfo = document.querySelector('#close_info');

openInfo.addEventListener('click', () => {
    console.log('click');
    let openedInfo = document.querySelector('.opened_info');
    openedInfo.style.bottom = '0';
})

closeInfo.addEventListener('click', () => {
    let openedInfo = document.querySelector('.opened_info');
    openedInfo.style.bottom = '-100vh';
})