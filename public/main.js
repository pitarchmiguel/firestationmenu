const button = document.querySelector('#open-info');
const closed = document.querySelector('#cerrar-popup');

button.addEventListener('click', () => {
    console.log('Button clicked');
    const popup = document.querySelector('#popup');
    popup.style.left = '0';
    popup.style.bottom = '0';
});

closed.addEventListener('click', () => {
    console.log('Closed clicked');
    const popup = document.querySelector('#popup');
    popup.style.left = '-100%';
});