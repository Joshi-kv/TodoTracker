$(document).ready(() => {

    //function to higlight selected menu
    var navLinks = document.querySelectorAll('.sidebar-nav .nav-link')
    var windowPathname = window.location.pathname

    navLinks.forEach((navLink) => {      
        
        if(windowPathname === '/announcements/' || windowPathname == '/my-news/'){
            document.getElementById('newsMenu').classList.add('active-menu')
        }
        
        if(navLink.getAttribute('href') == windowPathname ){
            navLink.classList.add('active-menu')
        }

        if(windowPathname.includes('project') || windowPathname.includes('projects') || windowPathname.includes('tasks') || windowPathname.includes('task')) {
            document.getElementById('projectMenu').classList.add('active-menu')
        }
    })

});