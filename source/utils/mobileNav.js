const mobileNav = () => {
    const headerBars = document.querySelector(".header__bars");
    const mobileNav = document.querySelector(".mobile-nav");
    const closeButton = document.querySelector(".mobile-nav__close-btn");

    const openNav = () => {mobileNav.style.display = "flex"}
    const closeNav = () => {mobileNav.style.display = "none"}

    headerBars.addEventListener("click", openNav);
    closeButton.addEventListener("click", closeNav);
};

export default mobileNav;