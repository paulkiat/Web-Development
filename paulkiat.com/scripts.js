// Smooth Scrolling for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Interactive Portfolio Gallery
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', function () {
        // Implement logic to enlarge or show more info
        // For instance, changing the class of the item to enlarge it
        this.classList.toggle('enlarged');
    });
});

// Animation on Scroll
AOS.init();

// Responsive Nav-Bar Toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav ul');

menuToggle.addEventListener('click', function () {
    nav.classList.toggle('active');
});

// Contact Form Validation and Submission
const contactForm = document.querySelector('#contact-form');
contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // Add form validation logic
    // Submit the form or show error messages
});


// Three.js Integration
let scene, camera, renderer;

function initThreeJS() {
    // Create a scene
    scene = new THREE.Scene();

    // Add a camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create a renderer and add it to the DOM
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('threejs-container').appendChild(renderer.domElement);

    // Add a basic object
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add animation loop
    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
}

// Handle window resize
window.addEventListener('resize', () => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize Three.js scene
initThreeJS();