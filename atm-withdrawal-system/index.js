// Define denominations and initial stack sizes
const denominations = [10, 20, 50, 100];
let stacksize_notes = [100, 200, 500, 1000]; // Example initial values

// Function to validate the input amount
function validateAmount(amount) {
    return !isNaN(amount) && amount.trim() !== "" && parseInt(amount) > 0;
}

// Function to check if the amount can be dispensed
function canDispenseAmount(amount) {
    return denominations.some(denom => amount % denom === 0);
}

// Function to handle the Check Amount button click
function CheckAmount() {
    let amount = document.getElementById("withdrawal_amount").value;

    // Validate the input amount
    if (!validateAmount(amount)) {
        document.getElementById("error").innerHTML = "Amount specified is not valid!<br>Try again!";
        document.getElementById("notes_dispensed").innerHTML = ""; // Clear previous results
        return;
    }
    amount = parseInt(amount);

    // Check if the amount can be dispensed
    if (canDispenseAmount(amount)) {
        document.getElementById("error").innerHTML = `${amount} is a valid amount!`;
    } else {
        document.getElementById("error").innerHTML = `The amount ${amount} cannot be dispensed with the available denominations.<br>Try again!`;
    }

    document.getElementById("notes_dispensed").innerHTML = ""; // Clear previous results
}

// Function to show the denominations of notes that will be dispensed
function ShowDenomination() {
    let wd_amount = document.getElementById("withdrawal_amount").value;

    // Validate input
    if (!validateAmount(wd_amount)) {
        document.getElementById("notes_dispensed").innerHTML = "Invalid amount!";
        document.getElementById("notes_dispensed").hidden = false; // Show message
        return;
    }

    wd_amount = parseInt(wd_amount); // Convert to integer
    let noteswithdrawn = new Array(denominations.length).fill(0);

    // Calculate the notes to be dispensed
    for (let i = denominations.length - 1; i >= 0; i--) {
        if (wd_amount <= 0) break;
        let noteCount = Math.min(Math.floor(wd_amount / denominations[i]), stacksize_notes[i]);
        noteswithdrawn[i] = noteCount;
        wd_amount -= noteCount * denominations[i];
    }

    // Check if the exact amount could be dispensed
    if (wd_amount > 0) {
        document.getElementById("notes_dispensed").innerHTML = "Unable to dispense the exact amount with available denominations.";
        document.getElementById("notes_dispensed").hidden = false; // Show message
        return;
    }

    // Display the result
    let notes_output = "You will receive:<br>";
    for (let i = 0; i < noteswithdrawn.length; i++) {
        if (noteswithdrawn[i] > 0) {
            notes_output += `${noteswithdrawn[i]} x ${denominations[i]} notes<br>`;
        }
    }

    // Unhide the notes dispensed section and display the notes
    document.getElementById("notes_dispensed").innerHTML = notes_output;
    document.getElementById("notes_dispensed").hidden = false; // Unhide the paragraph
}

// Function to display the available notes and their stack sizes
function ReadNotesStackSize() {
    let output = "";
    for (let i = 0; i < denominations.length; i++) {
        output += `Notes: ${denominations[i]} RMB: ${stacksize_notes[i]}<br>`;
    }
    document.getElementById("notesstack").innerHTML = output;
}
