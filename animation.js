// INIT -------------------------
const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
let raf

let mousex
let mousey
let mousein = false
// Constants --------------------
const boidsAmount = 1000
// It seems the most fun to let everything start at the same speed.
const startVelocity = 4
const boids = createBoids()

const fleeingFactor = 1
const shyness = 0.05
const turnfactor = 0.5
const visualRange = 40
const protectedRange = 8
const centeringfactor = 0.0005
const avoidfactor = 0.05
const matchingfactor = 0.05
const maxspeed = 6
const minspeed = 3
const margin = 20
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
    steerFromEdges()
    flee()

    boids.forEach(b => {
        b.x = b.x + b.vx
        b.y = b.y + b.vy
    })

}

// LISTENERS --------------------

canvas.addEventListener("mousemove", (event) => {
    mousex = event.clientX
    mousey = event.clientY
})

canvas.addEventListener("mouseenter", () => {
    mousein = true
})

canvas.addEventListener("mouseleave", () => {
    mousein = false
})

canvas.addEventListener("load", () => {
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
    boids.forEach(b1 => {
        let closedx = 0
        let closedy = 0
        boids.filter(b2 => tooClose(b1, b2)).forEach(b2 => {
            if (b2 == b1) return
            closedx += b1.x - b2.x
            closedy += b1.y - b2.y
        })
        b1.vx += closedx * shyness
        b1.vy += closedy * shyness
    })
}

function updateAlignement() {
    boids.forEach(b1 => {
        let xvelAvg = 0
        let yvelAvg = 0
        let neighbours = 0
        boids.filter(b2 => seeEachother(b1, b2)).forEach(b2 => {
            if (b2 == b1) return
            xvelAvg += b2.vx
            yvelAvg += b2.vy
            neighbours++
        })

        if (neighbours === 0) return
        xvelAvg /= neighbours
        yvelAvg /= neighbours

        b1.vx += (xvelAvg - b1.vx) * matchingfactor
        b1.vy += (yvelAvg - b1.vy) * matchingfactor
    })
}

function updateCohesion() {
    boids.forEach(b1 => {
        let xposAvg = 0
        let yposAvg = 0
        let neighbours = 0
        boids.filter(b2 => seeEachother(b1, b2)).forEach(b2 => {
            if (b1 == b2) return
            xposAvg += b2.vx
            yposAvg += b2.vy
            neighbours++
        })

        if (neighbours === 0) return
        xposAvg /= neighbours
        yposAvg /= neighbours

        b1.vx += (xposAvg - b1.x) * centeringfactor
        b1.vy += (yposAvg - b1.y) * centeringfactor
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

function steerFromEdges() {
    boids.forEach(b => {
        if (b.x < margin) {
            b.vx += turnfactor
        }
        if (b.y < margin) {
            b.vy += turnfactor
        }
        if (b.x > canvas.width - margin) {
            b.vx -= turnfactor
            console.log(b.vx)
        }
        if (b.y > canvas.height - margin) {
            b.vy -= turnfactor
        }
    })
}

function flee() {
    boids.forEach(b => {
        if (distance(b.x, b.y, mousex, mousey) < visualRange) {
            if (b.x < mousex) b.vx -= fleeingFactor
            if (b.x > mousex) b.vx += fleeingFactor
            if (b.y < mousey) b.vy -= fleeingFactor
            if (b.y > mousey) b.vy += fleeingFactor
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
