$(document).ready(() => {

    var navLinks = document.querySelectorAll('.nav-tabs .nav-item a')
    var windowPathname = window.location.pathname

    navLinks.forEach((navLink) => {
        console.log(navLink)
        if(navLink.getAttribute('href') == windowPathname){
            navLink.classList.add('active-tab')
        }
    })

});