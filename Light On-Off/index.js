function OnOff() {
    var lightOff = document.getElementById("lightOff");
    var lightOn = document.getElementById("lightOn");
    var button = document.getElementById("click");

    // Toggle the bulb and button text
    if (lightOff.style.display === "none") {
        lightOff.style.display = "block";
        lightOn.style.display = "none";
        button.textContent = "Light me up";
        button.classList.remove("lightOff");
        button.classList.add("lightOn");
        document.body.style.backgroundColor = "#333";  // Dark background
    } else {
        lightOff.style.display = "none";
        lightOn.style.display = "block";
        button.textContent = "I am visible";
        button.classList.remove("lightOn");
        button.classList.add("lightOff");
        document.body.style.backgroundColor = "#f0f0f0";  // Light background
    }
}
