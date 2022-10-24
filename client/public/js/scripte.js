//like and unlike
// let btnlike = document.getElementsByClassName('btnlike');
// btnlike.addEventListener( 'click',()=>{
//     btnlike.style.color = 'red';
// });

const menuburger = document.querySelector(".menuburger")
const navList = document.querySelector(".list")

menuburger.addEventListener('click',()=>{
navList.classList.toggle('mobile-menu')
})


