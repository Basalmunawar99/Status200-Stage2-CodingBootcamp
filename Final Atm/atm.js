// User data and note stock
let userId = ["basil", "ezaz", "adil"];
let userPassword = [123123, 1456456, 789789];
let userBalance = [5000, 3000, 2000];
let noteStock = { 100: 10, 50: 20, 20: 30, 10: 50 };
let currentUserIndex = null;

// Show/hide sections
function showSection(section) {
  const sections = ['withdraw', 'deposit', 'balance'];
  sections.forEach(sec => {
    document.getElementById(sec + 'Section').style.display = (sec === section) ? 'block' : 'none';
  });
}

// Login function
function login() {
  const username = document.getElementById('username').value;
  const pin = parseInt(document.getElementById('userPin').value, 10);
  const message = document.getElementById('loginMessage');

  const index = userId.indexOf(username);
  if (index !== -1 && userPassword[index] === pin) {
    currentUserIndex = index;
    message.textContent = "";
    document.getElementById('pinSection').style.display = 'none';
    document.getElementById('buttonSection').style.display = 'block';
    showSection('balance');
    updateBalance();
  } else {
    message.textContent = "Invalid username or PIN.";
  }
}

// Withdraw function
function withdraw() {
  const amount = parseInt(document.getElementById('withdrawAmount').value, 10);
  const message = document.getElementById('withdrawMessage');

  if (amount > 0 && amount <= userBalance[currentUserIndex]) {
    if (validateAndUpdateNotes(amount)) {
      userBalance[currentUserIndex] -= amount;
      message.textContent = "Withdrawal successful!";
      updateBalance();
      updateNotesStockDisplay();
    } else {
      message.textContent = "ATM cannot dispense this amount with available notes.";
    }
  } else {
    message.textContent = "Invalid withdrawal amount or insufficient balance.";
  }

  message.style.display = "block";
}

// Deposit function
function deposit() {
  const amount = parseInt(document.getElementById('depositAmount').value, 10);
  const message = document.getElementById('depositMessage');

  if (amount > 0) {
    userBalance[currentUserIndex] += amount;
    message.textContent = "Deposit successful!";
    updateBalance();
  } else {
    message.textContent = "Invalid deposit amount.";
  }

  message.style.display = "block";
}

// Update balance display
function updateBalance() {
  document.getElementById('userBalance').textContent = 'Current Balance: ' + userBalance[currentUserIndex];
}

// Update notes stock display
function updateNotesStockDisplay() {
  let stockDisplay = '';
  
  for (let note in noteStock) {
    if (stockDisplay !== '') {
      stockDisplay += ', ';
    }
    stockDisplay += `$${note}: ${noteStock[note]} notes`;
  }
  
  document.getElementById('notesStock').textContent = `Notes Stock: ${stockDisplay}`;
}

// Validate notes and update stock
function validateAndUpdateNotes(amount) {
    const notes = [100, 50, 20, 10];
    let remainingAmount = amount;
    const usedNotes = {};

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const count = Math.floor(remainingAmount / note);
        if (count > 0 && count <= noteStock[note]) {
            usedNotes[note] = count;
            remainingAmount -= count * note;
        } else if (count > noteStock[note]) {
            usedNotes[note] = noteStock[note];
            remainingAmount -= noteStock[note] * note;
        }
    }

    if (remainingAmount === 0) {
        for (let note in usedNotes) {
            noteStock[note] -= usedNotes[note];
        }
        return true;
    }

    return false;
}

