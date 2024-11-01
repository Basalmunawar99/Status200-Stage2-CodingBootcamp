// Create a variable with multiple names
var teachers = ["Karel", "Ferry"];

// Function for adding a new name
function newName() {
    var nameInput = document.getElementById("inp-name").value;
    var feedbackElement = document.getElementById("feedback");

    if (nameInput.trim() === "") {
        feedbackElement.textContent = "Please enter a valid name.";
    } else {
        teachers.push(nameInput.trim());
        feedbackElement.textContent = "Teacher added successfully!";
        feedbackElement.style.color = "green";
        document.getElementById("inp-name").value = ""; // Clear input
    }
}

// Function to show the added names
function showNames() {
    var result = "Teachers:<br>";
    for (let i = 0; i < teachers.length; i++) {
        result += `Teacher ${i + 1}: ${teachers[i]}<br>`;
    }
    document.getElementById("result").innerHTML = result;
}
