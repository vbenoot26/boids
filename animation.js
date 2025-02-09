// Constants --------------------
const boidsAmount = 100
const standardVelocity = 5.0
const boids = createBoids()
// Main script -----------------
const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
let raf

const ball = {
    x: 100,
    y: 100,
    vx: 3,
    vy: 2,
    color: "blue",
    draw() {
        context.beginPath();
        context.arc(this.x, this.y, 2, 0, Math.PI * 2, true);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
    }
}

function draw() {
    console.log(canvas.height)
    context.clearRect(0, 0, canvas.width, canvas.height)
    console.log("updating")
    ball.x = (ball.x + ball.vx) % canvas.width
    ball.y = (ball.y + ball.vy) % canvas.height
    console.log(`ball.x = ${ball.x}, ball.y = ${ball.y}`)
    ball.draw()
    raf = window.requestAnimationFrame(draw)
}

canvas.addEventListener("mouseover", (e) => {
    raf = window.requestAnimationFrame(draw);
});

canvas.addEventListener("mouseout", (e) => {
    window.cancelAnimationFrame(raf);
});

ball.draw();

// BOIDS
function createBoids() {
    const result = []
    for (let i = 0; i < boidsAmount; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height

        const vx = Math.random() * standardVelocity;
        const vy = Math.sqrt(vx ** 2 - standardVelocity ** 2)

        result.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy
        })
    }

    return result
}
