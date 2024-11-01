// JavaScript for smooth scrolling and hiding/showing sections
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });
        // Show the clicked section
        const targetSection = document.querySelector(this.getAttribute('href'));
        targetSection.classList.remove('hidden');
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});