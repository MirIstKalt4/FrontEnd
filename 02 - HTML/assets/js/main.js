const header = document.getElementsByTagName('header')[0];
console.log(header);
const pTop = header.offsetTop;

document.addEventListener('scroll', () => window.pageYOffset > pTop ? header.classList.add('sticky') : header.classList.remove('sticky'));