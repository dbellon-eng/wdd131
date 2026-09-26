document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

const temp = 18;
const wind = 12;

const calculateWindChill = (t, w) => 
  (13.12 + (0.6215 * t) - (11.37 * Math.pow(w, 0.16)) + (0.3965 * t * Math.pow(w, 0.16))).toFixed(1);

const chillElement = document.getElementById("chill");

if (temp <= 10 && wind > 4.8) {
    chillElement.textContent = `${calculateWindChill(temp, wind)} °C`;
} else {
    chillElement.textContent = "N/A";
}