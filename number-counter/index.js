function clickme() {
    var output = "Even Numbers: ";
    var userInput = parseInt(document.getElementById("userInput").value);
    var userNumber = parseInt(document.getElementById("userNumber").value);

    var outputElement = document.getElementById("output");

    if (isNaN(userInput) || isNaN(userNumber)) {
        outputElement.innerHTML = "Please enter valid numbers.";
        outputElement.style.color = "red";
        return;
    }

    outputElement.innerHTML = ""; // Clear previous results
    outputElement.style.color = "#333"; // Reset color

    for (let x = userInput; x <= userNumber; x++) {
        if (x % 2 === 0) {
            output += `<span class="even-number">${x}</span> `;
        }
    }

    if (output === "Even Numbers: ") {
        output = "No even numbers found.";
    }

    outputElement.innerHTML = output;
    outputElement.classList.remove("hidden"); // Show output
}

function resetForm() {
    document.getElementById("userInput").value = '';
    document.getElementById("userNumber").value = '';
    document.getElementById("output").innerHTML = "This is a loop";
    document.getElementById("output").style.color = "#333";
    document.getElementById("output").classList.add("hidden"); // Hide output
}
