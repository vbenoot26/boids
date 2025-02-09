const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
let raf

const ball = {
    x: 100,
    y: 100,
    vx: 10,
    vy: 10,
    color: "blue",
    draw() {
        context.beginPath();
        context.arc(this.x, this.y, 25, 0, Math.PI * 2, true);
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
