// English to Malay dictionary with more words
const engToMalay = {
	What: "Apa",
	No: "Tidak",
	You: "Awak",
	Eat: "Makan",
	Love: "Cinta",
	Stupid: "Bodoh",
	Good: "Baik",
	Bad: "Buruk",
	Hello: "Halo",
	Please: "Tolong",
	Thank: "Terima",
	Yes: "Ya",
	Friend: "Kawan",
	House: "Rumah",
	Cat: "Kucing",
	Dog: "Anjing",
	Water: "Air"
};

// Malay to English dictionary with more words
const malayToEng = {
	Apa: "What",
	Tidak: "No",
	Awak: "You",
	Makan: "Eat",
	Cinta: "Love",
	Bodoh: "Stupid",
	Baik: "Good",
	Buruk: "Bad",
	Halo: "Hello",
	Tolong: "Please",
	Terima: "Thank",
	Ya: "Yes",
	Kawan: "Friend",
	Rumah: "House",
	Kucing: "Cat",
	Anjing: "Dog",
	Air: "Water"
};

// Function to translate from English to Malay
function translateEngToMalay() {
	const word = document.getElementById('inputWord').value.trim();
	const translation = engToMalay[word] || "Translation not available";
	document.getElementById('outputWord').innerText = translation;
}

// Function to translate from Malay to English
function translateMalayToEng() {
	const word = document.getElementById('inputWord').value.trim();
	const translation = malayToEng[word] || "Translation not available";
	document.getElementById('outputWord').innerText = translation;
}
