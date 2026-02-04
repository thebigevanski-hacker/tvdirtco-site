// --- PARTICLE SYSTEM ---
const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const MAX_PARTICLES = 300;
let mouse = { x: null, y: null, lastX: null, lastY: null };

// Particle Class
class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'dust', 'dirt', 'rock'

        if (type === 'dust') {
            this.size = Math.random() * 4 + 2;
            this.speedX = (Math.random() - 0.5) * 1;
            this.speedY = (Math.random() - 0.5) * 1;
            this.color = `rgba(170, 137, 100, ${Math.random() * 0.2 + 0.05})`;
            this.life = 100;
            this.decay = Math.random() * 1.2 + 0.3;
            this.blur = Math.random() * 2;
        } else if (type === 'dirt') {
            this.size = Math.random() * 3 + 2;
            this.speedX = (Math.random() - 0.5) * 4;
            this.speedY = (Math.random() - 0.5) * 4;
            this.color = Math.random() > 0.5 ? '#634b35' : '#AA8964';
            this.life = 100;
            this.decay = Math.random() * 2 + 1;
            this.blur = 0;
        } else { // Rock
            this.size = Math.random() * 4 + 3;
            this.speedX = (Math.random() - 0.5) * 6;
            this.speedY = (Math.random() - 1) * 5;
            this.gravity = 0.2;
            this.color = '#444';
            this.life = 100;
            this.decay = 0.8;
            this.rotate = Math.random() * Math.PI;
            this.rotateSpeed = (Math.random() - 0.5) * 0.2;
            this.blur = 0;
        }
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.gravity) this.speedY += this.gravity;
        this.life -= this.decay;
        if (this.type === 'rock') this.rotate += this.rotateSpeed;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life / 100;
        if (this.blur) ctx.filter = `blur(${this.blur}px)`;
        ctx.fillStyle = this.color;

        if (this.type === 'rock') {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotate);
            ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
        ctx.filter = 'none';
    }
}

// Initialize Canvas
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', initCanvas);
initCanvas();

// Spawn Particles
function spawnParticles(x, y, distance) {
    // Always dust
    particles.push(new Particle(x, y, 'dust'));

    // Dirt & rocks on faster movement
    if (distance > 15) {
        for(let i=0;i<2;i++) particles.push(new Particle(x, y, 'dirt'));
        if (Math.random() > 0.6) particles.push(new Particle(x, y, 'rock'));
    }

    // Limit total particles
    if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES);
    }
}

// Mouse / Touch Movement
function handlePointerMove(x, y) {
    if (mouse.lastX !== null) {
        const dx = x - mouse.lastX;
        const dy = y - mouse.lastY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if (distance > 2) spawnParticles(x, y, distance);
    }
    mouse.lastX = x;
    mouse.lastY = y;
}

// Mouse
window.addEventListener('mousemove', e => handlePointerMove(e.clientX, e.clientY));
// Touch
window.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    handlePointerMove(touch.clientX, touch.clientY);
});

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}

window.onload = () => {
    initCanvas();
    animate();
};