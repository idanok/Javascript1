// Hamburger menu
function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

async function
fetchAndDisplaySinglePoduct() {
    const response = await fetch("https://api.noroff.dev/api/v1/rainy-days");
    const product = await response.json();
    console.log(product);
}
fetchAndDisplaySinglePoduct();

