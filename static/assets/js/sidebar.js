$(document).ready(() => {

    var navLinks = document.querySelectorAll('.sidebar-nav .nav-link')
    var windowPathname = window.location.pathname

    navLinks.forEach((navLink) => {      
        
        if(windowPathname === '/announcements/' || windowPathname == '/my-news/'){
            document.getElementById('newsMenu').classList.add('active-menu')
        }
        
        if(navLink.getAttribute('href') == windowPathname ){
            navLink.classList.add('active-menu')
        }
    })

});