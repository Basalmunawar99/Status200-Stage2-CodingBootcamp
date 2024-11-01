var nameArray = [];
var ageArray = [];
var professionArray = [];
var genderArray = [];

function storeData() {
    var nameInput = document.getElementById("nameInput").value;
    var ageInput = Math.floor(document.getElementById("ageInput").value * 1);
    var professionInput = document.getElementById("professionInput").value;
    var genderInput = document.getElementById("genderInput").value;

    // Validation for empty fields
    if (nameInput === "" || isNaN(ageInput) || professionInput === "" || genderInput === "") {
        alert("Please fill out all fields.");
        return false;
    }

    nameArray.push(nameInput);
    ageArray.push(ageInput);
    professionArray.push(professionInput);
    genderArray.push(genderInput);

    var currentAverageAge = 0;
    var output = "";

    // Calculate current average age and find people over 40
    for (let i = 0; i < ageArray.length; i++) {
        currentAverageAge += ageArray[i];
        if (ageArray[i] > 40) {
            output += "Name: " + nameArray[i] + " (Gender: " + genderArray[i] + "), Profession: " + professionArray[i] + "<br>";
        }
    }
    currentAverageAge = parseInt(currentAverageAge / ageArray.length);

    // Output data to the page
    document.getElementById("output").innerHTML = 
        "Current Average Age: " + currentAverageAge + 
        "<br><br>People over 40:<br>" + output;

    // Clear form inputs after submission
    document.getElementById("dataForm").reset();

    return false;
}
