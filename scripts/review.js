document.addEventListener("DOMContentLoaded", () => {
    let reviewCount = Number(window.localStorage.getItem("reviewCounter-ls")) || 0;
    reviewCount++;
    window.localStorage.setItem("reviewCounter-ls", reviewCount);

    const countDisplay = document.getElementById("reviewCount");
    if (countDisplay) {
        countDisplay.textContent = reviewCount;
    }

    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = "Last Modification: " + document.lastModified;
});