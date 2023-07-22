// $(document).ready(() => {
//     // Function to add "active" class to the active-menu link
//     function setActiveMenu() {
//         const currentURL = window.location.pathname; // Use pathname to ignore query parameters

//         $('#sidebar .sidebar-nav li').each(function () {
//             const link = $(this).find('a').attr('href');
//             const normalizedLink = link.endsWith('/') ? link.slice(0, -1) : link; // Normalize the link URL
//             const normalizedCurrentURL = currentURL.endsWith('/') ? currentURL.slice(0, -1) : currentURL; // Normalize the current URL

//             // Check if the current URL includes the link URL
//             if (normalizedCurrentURL === normalizedLink && !$(this).hasClass('exclude-active')) {
//                 $(this).addClass('active-menu');
//             } else {
//                 $(this).removeClass('active-menu');
//             }
//         });

//         // Add active-menu class to the "Dashboard" menu if on the homepage
//         if (currentURL === '/' || currentURL === '/index/') {
//             $('#sidebar .sidebar-nav li.exclude-active').addClass('active-menu');
//         }
//     }

//     // Call the function on page load
//     setActiveMenu();

//     // Handle click event to update active-menu link
//     $('#sidebar .sidebar-nav a').on('click', function () {
//         // Remove the active-menu class from all links
//         $('#sidebar .sidebar-nav li').removeClass('active-menu');

//         // Add the active-menu class to the clicked link's parent li
//         $(this).parent('li').addClass('active-menu');
//     });
// });