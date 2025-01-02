const menu_btn = document.getElementById('nav_menu')
const menu_colapse = document.getElementById('menu_colapse')
const menu = document.getElementById('menu')

menu_btn.addEventListener('click', function() {
    menu_colapse.classList.toggle("navigation--active")
    menu_btn.classList.toggle("btn--active")
})

window.onkeydown = function( event ) {
    if ( event.keyCode == 27 ) {
        if (menu_colapse.classList.contains('navigation--active') && menu_btn.classList.contains('btn--active')) {
            menu_colapse.classList.toggle("navigation--active")
            menu_btn.classList.toggle("btn--active")
        }
    }
};

window.addEventListener("click", (e) => {
    if(!e.target.closest(".menu")) {
        if (menu_colapse.classList.contains('navigation--active') && menu_btn.classList.contains('btn--active')) {
            menu_colapse.classList.remove("navigation--active")
            menu_btn.classList.remove("btn--active")
        }
    }
    
});

