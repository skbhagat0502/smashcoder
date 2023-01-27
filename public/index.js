
const hamburgerMenu = document.querySelector("#hamburger");
const navigationList = document.querySelector("#main-nav");
const listItems = document.querySelectorAll(".nav-list li");
const links = document.querySelectorAll("#mobile-nav-social-icons a");
const loginButton = document.querySelector("#login-button");

hamburgerMenu.addEventListener("click", () => {
    navigationList.classList.toggle("hamburgerButtonClicked");
    listItems.forEach((listItem) => {
        listItem.classList.toggle("fade");
    });
    links.forEach((link) => {
        link.classList.toggle("fade");
    });
    loginButton.classList.toggle("fade");
});