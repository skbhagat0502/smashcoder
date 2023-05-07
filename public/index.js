const hamburgerMenu = document.querySelector("#hamburger");
const navigationList = document.querySelector("#main-nav");
const listItems = document.querySelectorAll(".nav-list li");
const links = document.querySelectorAll("#mobile-nav-social-icons a");
const contact=document.querySelector("#sendemail");

hamburgerMenu.addEventListener("click", () => {
    navigationList.classList.toggle("hamburgerButtonClicked");
    listItems.forEach((listItem) => {
        listItem.classList.toggle("fade");
    });
    links.forEach((link) => {
        link.classList.toggle("fade");
    });
});
document.querySelector(".description1").addEventListener("input", (characters) => {
    const maxlength = characters.target.getAttribute("maxlength");
    const currentLength = characters.target.value.length;
    document.querySelector(".counter1").innerHTML = `${currentLength}/${maxlength}`
});
document.querySelector(".description2").addEventListener("input", (characters) => {
    const maxlength = characters.target.getAttribute("maxlength");
    const currentLength = characters.target.value.length;
    document.querySelector(".counter2").innerHTML = `${currentLength}/${maxlength}`
});
