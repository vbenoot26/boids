// INIT -------------------------
const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
let raf
// Constants --------------------
const boidsAmount = 100
// It seems the most fun to let everything start at the same speed.
const startVelocity = 4
const boids = createBoids()

const shyness = 0.05
const turnfactor = 0.2
const visualRange = 40
const protectedRange = 8
const centeringfactor = 0.0005
const avoidfactor = 0.05
const matchingfactor = 0.05
const maxspeed = 6
const minspeed = 3
// Main script -----------------

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    boids.forEach(drawBoid)
    update()
    raf = window.requestAnimationFrame(draw)
}

function drawBoid(boid) {
    context.beginPath();
    context.arc(boid.x, boid.y, 2, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = "teal";
    context.fill();
}

function update() {
    updateSeperation()
    updateCohesion()
    updateAlignement()

    updateSpeeds()

    boids.forEach(b => {
        b.x = (b.x + b.vx) % canvas.width
        b.y = (b.y + b.vy) % canvas.height
        console.log(b)
    })

}

canvas.addEventListener("load", (e) => {
    raf = window.requestAnimationFrame(draw);
});

draw();

// BOIDS ------------------------
function createBoids() {
    const result = []
    for (let i = 0; i < boidsAmount; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height

        const vx = Math.random() * startVelocity;
        const vy = Math.sqrt(Math.abs((vx ** 2) - (startVelocity ** 2)))

        result.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy
        })
    }

    return result
}

function updateSeperation() {
    boids.forEach(boid1 => {
        let closedx = 0
        let closedy = 0
        boids.filter(tooClose).forEach(boid2 => {
            if (boid2 == boid1) return
            closedx += boid1.x - boid2.x
            closedy += boid1.y - boid2.y
        })
        boid1.vx += closedx * shyness
        boid1.vy += closedy * shyness
    })
}

function updateAlignement() {
    boids.forEach(boid1 => {
        let xvelAvg = 0
        let yvelAvg = 0
        let neighbours = 0
        boids.filter(seeEachother).forEach(boid2 => {
            if (boid2 == boid1) return
            xvelAvg += boid2.vx
            yvelAvg += boid2.vy
            neighbours++
        })

        if (neighbours > 0) {
            xvelAvg /= neighbours
            yvelAvg /= neighbours
        }
        boid1.vx = (xvelAvg - boid1.vx) * matchingfactor
        boid1.vy = (yvelAvg - boid1.vy) * matchingfactor
    })
}

function updateCohesion() {
    boids.forEach(boid1 => {
        let xposAvg = 0
        let yposAvg = 0
        let neighbours = 0
        boids.filter(seeEachother).forEach(boid2 => {
            if (boid1 == boid2) return
            xposAvg += boid2.vx
            yposAvg += boid2.vy
            neighbours++
        })

        if (neighbours > 0) {
            xposAvg /= neighbours
            yposAvg /= neighbours
        }
        boid1.vx = (xposAvg - boid1.x) * centeringfactor
        boid1.vy = (yposAvg - boid1.y) * centeringfactor
    })
}

/**
* Keeps the speeds within the boundaries
*/
function updateSpeeds() {
    boids.forEach(boid => {
        let speed = Math.sqrt(boid.vx ** 2 + boid.vy ** 2)
        if (speed > maxspeed) {
            boid.vx = (boid.vx / speed) * maxspeed
            boid.vy = (boid.vy / speed) * maxspeed
        }
        if (speed < minspeed) {
            boid.vx = (boid.vx / speed) * minspeed
            boid.vy = (boid.vy / speed) * minspeed
        }

    })
}

function seeEachother(boid1, boid2) {
    return distance(boid1.x, boid1.y, boid2.x, boid2.y) < visualRange
}

function tooClose(boid1, boid2) {
    return distance(boid1.x, boid1.y, boid2.x, boid2.y) < protectedRange
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}
