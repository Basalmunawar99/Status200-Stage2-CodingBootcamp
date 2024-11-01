// Improved user credentials storage using an object
const users = {
    "basil": "123",
    "adil": "456",
    "ezaz": "789",
    "asad": "212"
};

let isLoggedIn = false;

function logIn() {
    const username = document.getElementById("carUser").value;
    const password = document.getElementById("carPassword").value;
    const loginMessage = document.getElementById("logoDiv");

    if (users[username] && users[username] === password) {
        isLoggedIn = true;
        document.getElementById("loginDiv").style.display = "none";
        document.getElementById("buttonDiv").style.display = "flex";
        loginMessage.textContent = `Welcome, ${username}! Enjoy exploring your dream cars!`;
    } else {
        loginMessage.textContent = "Invalid username or password.";
    }
}

function showCar(carId) {
    if (isLoggedIn) {
        const carDivs = document.querySelectorAll(".cars");
        carDivs.forEach(car => car.style.display = "none");
        document.getElementById(carId).style.display = "block";

        // Change the background color based on the selected car
        const body = document.body;
        switch (carId) {
            case 'typeR':
                body.style.backgroundColor = '#ffe4e1'; // Light pink
                break;
            case 'typeVTEC':
                body.style.backgroundColor = '#d3d3d3'; // Light grey
                break;
            case 'gtr':
                body.style.backgroundColor = '#e0ffff'; // Light cyan
                break;
            default:
                body.style.backgroundColor = '#f0f0f0'; // Default color
        }
    }
}

function logOut() {
    isLoggedIn = false;
    document.getElementById("buttonDiv").style.display = "none";
    document.getElementById("loginDiv").style.display = "flex";
    document.querySelectorAll(".cars").forEach(car => car.style.display = "none");
    document.body.style.backgroundColor = '#f0f0f0'; // Reset background color
}
