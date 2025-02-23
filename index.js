// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const gameSound = new Audio('music.mp3');
let speed = 7;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 4 };

// Select game board correctly
const background = document.getElementById("background");
const scoreBox = document.getElementById("scoreBox");
const highscoreBox = document.getElementById("highscoreBox");

// Load High Score from localStorage
let highscore = localStorage.getItem("highscore");
let hiscoreval = highscore === null ? 0 : JSON.parse(highscore);
highscoreBox.innerHTML = "High Score: " + hiscoreval;

// Main Game Loop
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

// Check Collision Function
function isCollide(snakeArr) {
    // Check if snake bumps into itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y) {
            return true;
        }
    }
    // Check if snake bumps into the wall
    if (snakeArr[0].x >= 18 || snakeArr[0].x < 0 || snakeArr[0].y >= 18 || snakeArr[0].y < 0) {
        return true;
    }
    return false;
}

// Game Engine Function
function gameEngine() {
    // Check for collisions
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        gameSound.pause();
        alert("Game over! Press any key to restart.");
        inputDir = { x: 0, y: 0 };
        snakeArr = [{ x: 13, y: 15 }];
        gameSound.play();
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
    }

    // If snake eats food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;

        // Update high score if necessary
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("highscore", JSON.stringify(hiscoreval));
            highscoreBox.innerHTML = "High Score: " + hiscoreval;
        }

        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });

        // Generate new food position
        let a = 1, b = 16;
        food = {
            x: Math.floor(a + (b - a) * Math.random()),
            y: Math.floor(a + (b - a) * Math.random())
        };
    }

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Display Snake & Food
    background.innerHTML = "";

    // Display Snake
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        background.appendChild(snakeElement);
    });

    // Display Food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    background.appendChild(foodElement);
}

// Start Game
window.requestAnimationFrame(main);

// Handle Key Presses
window.addEventListener('keydown', e => {
    if (inputDir.x === 0 && inputDir.y === 0) gameSound.play(); // Start music when game starts

    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y === 0) {
                inputDir.x = 0;
                inputDir.y = -1;
            }
            break;
        case "ArrowDown":
            if (inputDir.y === 0) {
                inputDir.x = 0;
                inputDir.y = 1;
            }
            break;
        case "ArrowLeft":
            if (inputDir.x === 0) {
                inputDir.x = -1;
                inputDir.y = 0;
            }
            break;
        case "ArrowRight":
            if (inputDir.x === 0) {
                inputDir.x = 1;
                inputDir.y = 0;
            }
            break;
        default:
            break;
    }
});
