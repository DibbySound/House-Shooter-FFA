// =======================
// CANVAS E ELEMENTOS
// =======================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const playBtn = document.getElementById("playBtn");
const loadoutBtn = document.getElementById("loadoutBtn");
const pauseBtn = document.getElementById("pauseBtn");
const menuBtn = document.getElementById("menuBtn");
const hud = document.getElementById("hud");
const scoreDisplay = document.getElementById("score");
const ammoDisplay = document.getElementById("ammo");
const weaponList = document.getElementById("weaponList");
const backBtn = document.getElementById("backBtn");

// =======================
// SONS
// =======================
const sounds = {
    shoot_pistol: new Audio("sounds/shoot_pistol.ogg"),
    shoot_smg: new Audio("sounds/shoot_smg.wav"),
    shoot_rifle: new Audio("sounds/shoot_rifle.wav"),
    shoot_sniper: new Audio("sounds/shoot_sniper.wav"),
    reload_pistol: new Audio("sounds/reload_pistol.mp3"),
    reload_smg: new Audio("sounds/reload_smg.wav"),
    reload_rifle: new Audio("sounds/reload_rifle.wav"),
    reload_sniper: new Audio("sounds/reload_sniper.mp3"),
    //hit_enemy: new Audio("sounds/hit_enemy.mp3"),
    //enemy_dead: new Audio("sounds/enemy_dead.mp3"),
    //button_click: new Audio("sounds/button_click.mp3"),
    //game_over: new Audio("sounds/game_over.mp3")
};

// =======================
// ARMA ATUAL E LOADOUT
// =======================
let totalScore = parseInt(localStorage.getItem("totalScore")) || 0;
let unlockedWeapons = JSON.parse(localStorage.getItem("weapons")) || ["Pistol"];
let currentWeapon = weapons[0]; // arma inicial

// HUD Pontos Totais
const totalScoreDisplay = document.createElement("h3");
totalScoreDisplay.textContent = "Pontos totais: " + totalScore;
totalScoreDisplay.style.color = "#00ff88";
totalScoreDisplay.style.position = "absolute";
totalScoreDisplay.style.top = "40px";
totalScoreDisplay.style.left = "10px";
document.body.appendChild(totalScoreDisplay);

//=======================
// Reload System
//=======================
function reload() {
    if (isReloading) return;
    if (currentAmmo === currentWeapon.magazineSize) return;
    console.log(currentWeapon.soundReload);

    isReloading = true;
    ammoDisplay.textContent = "A recarregar...";
    currentWeapon.soundReload?.play();

    setTimeout(() => {
        currentAmmo = currentWeapon.magazineSize;
        isReloading = false;
        updateAmmoHUD();
    }, currentWeapon.reloadTime);
}

// =======================
// Player
// =======================
let player = {
    x: 400,
    y: 300,
    width: 40,
    height: 40,
    speed: 4,
    bullets: [],
    color: "#00ff88",
};

let currentAmmo = currentWeapon.magazineSize;
let isReloading = false;

function updateAmmoHUD() {
    ammoDisplay.textContent = "Munição: " + currentAmmo + " / " + currentWeapon.magazineSize;
}

// =======================
// Inimigos
// =======================
let enemies = [];
let floatingTexts = [];
let enemyTypes = [
    { color: "red", speed: 2 },
    { color: "orange", speed: 3 },
    { color: "purple", speed: 1.5 }
];

// =======================
// Paredes do mapa
// =======================
let walls = [
    { x: 0, y: 0, width: 800, height: 10 },
    { x: 0, y: 590, width: 800, height: 10 },
    { x: 0, y: 0, width: 10, height: 600 },
    { x: 790, y: 0, width: 10, height: 600 },
    { x: 200, y: 150, width: 400, height: 10 },
    { x: 200, y: 150, width: 10, height: 300 },
    { x: 590, y: 150, width: 10, height: 300 },
    { x: 200, y: 440, width: 400, height: 10 },
];

// =======================
// Controles
// =======================
let keys = {};
let mouse = { x: 0, y: 0, clicked: false };

document.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
    if (e.key.toLowerCase() === "r") {
        reload();
    }
});
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

canvas.addEventListener("mousedown", () => mouse.clicked = true);
canvas.addEventListener("mouseup", () => mouse.clicked = false);

// =======================
// Shoot system
// =======================
let lastShotTime = 0;

function shoot() {
    console.log("bullets:", player.bullets.length, "enemies:", enemies.length);
    const now = Date.now();
    if (currentAmmo <= 0 || isReloading) return;
    if (now - lastShotTime < currentWeapon.fireRate) return;

    if (currentWeapon.soundShoot) {
        const shotSound = currentWeapon.soundShoot.cloneNode();
        shotSound.volume = 0.3;
        shotSound.play();
    }

    lastShotTime = now;

    currentAmmo--;
    updateAmmoHUD();

    const angle = Math.atan2(
        mouse.y - (player.y + player.height / 2),
        mouse.x - (player.x + player.width / 2)
    );

    player.bullets.push({
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        width: 5,
        height: 5,
        penetrates: currentWeapon.penetrates || false,
        dx: Math.cos(angle) * currentWeapon.bulletSpeed,
        dy: Math.sin(angle) * currentWeapon.bulletSpeed,
        color: "#ffff00"
    });
}

// =======================
// Game state e menu
// =======================
let gameStarted = false;
let isPaused = false;

// =======================
// Loadout
// =======================
function renderWeapons() {
    weaponList.innerHTML = "";

    weapons.forEach((w) => {

        const container = document.createElement("div");
        container.style.border = "1px solid #00ff88";
        container.style.margin = "5px";
        container.style.padding = "5px";
        container.style.color = "#fff";

        const stats = document.createElement("p");
        stats.innerHTML = `
            <strong>${w.name}</strong><br>
            Fire Rate: ${w.fireRate} ms<br>
            Bullet Speed: ${w.bulletSpeed}<br>
            Automatic: ${w.automatic ? "Sim" : "Não"}<br>
            Penetrates: ${w.penetrates ? "Sim" : "Não"}<br>
            Custo: ${w.cost} pontos<br>
            ${unlockedWeapons.includes(w.name) ? "<em>Desbloqueada</em>" : "<em>Trancada</em>"}
        `;
        container.appendChild(stats);

        const btn = document.createElement("button");
        btn.textContent = unlockedWeapons.includes(w.name) ? "Equipar" : "Comprar";

        btn.onclick = () => {

            if (!unlockedWeapons.includes(w.name) && totalScore >= w.cost) {
                totalScore -= w.cost;
                unlockedWeapons.push(w.name);
                localStorage.setItem("weapons", JSON.stringify(unlockedWeapons));
            }

            currentWeapon = w;
            currentAmmo = currentWeapon.magazineSize;
            updateAmmoHUD();

            localStorage.setItem("totalScore", totalScore);

            renderWeapons();
        };

        container.appendChild(btn);
        weaponList.appendChild(container);
    });
}

// =======================
// Botões menu
// =======================
playBtn.onclick = () => {
    startGame();
};
loadoutBtn.onclick = () => {
    menu.style.display = "none";
    document.getElementById("loadoutMenu").style.display = "block";
    renderWeapons();
};
backBtn.onclick = () => {
    document.getElementById("loadoutMenu").style.display = "none";
    menu.style.display = "flex";
};

pauseBtn.onclick = () => {
    isPaused = !isPaused;

    if (isPaused) {
        pauseBtn.textContent = "Continuar";
        menuBtn.style.display = "inline-block";
    } else {
        pauseBtn.textContent = "Pausar";
        menuBtn.style.display = "none";
    }
};

menuBtn.onclick = () => {
    isPaused = false;
    gameStarted = false;

    pauseBtn.textContent = "Pausar";
    menuBtn.style.display = "none";

    enemies = [];
    player.bullets = [];
    score = 0;
    scoreDisplay.textContent = "Pontuação: 0";

    player.x = 400;
    player.y = 300;

    keys = {};
    mouse.clicked = false;

    menu.style.display = "flex";
    canvas.style.display = "none";
    hud.style.display = "none";
};

// =======================
// Inimigos e spawn
// =======================
function spawnEnemy() {
    let type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    let x, y;
    let safeDistance = 300;
    do {
        x = Math.random() * (canvas.width - 40);
        y = Math.random() * (canvas.height - 40);
    } while (Math.hypot(player.x - x, player.y - y) < safeDistance);

    enemies.push({ x, y, width: 40, height: 40, speed: type.speed, color: type.color });
}

// =======================
// Update do jogo
// =======================
function update() {
    if (!gameStarted || isPaused) return;

    // Movimento player
    if (keys["w"] && player.y > 0) player.y -= player.speed;
    if (keys["s"] && player.y + player.height < canvas.height) player.y += player.speed;
    if (keys["a"] && player.x > 0) player.x -= player.speed;
    if (keys["d"] && player.x + player.width < canvas.width) player.x += player.speed;

    // Disparo
    if (mouse.clicked) {
        shoot();
        console.log("diparou");
        if (!currentWeapon.automatic) mouse.clicked = false;
        if (currentAmmo <= 0) reload();
    }

    // Movimento inimigos
    enemies.forEach(e => {
        let angle = Math.atan2(player.y - e.y, player.x - e.x);
        e.x += Math.cos(angle) * e.speed;
        e.y += Math.sin(angle) * e.speed;
    });

    // Colisão bullets → inimigos
    player.bullets.forEach((b, bi) => {
        b.x += b.dx;
        b.y += b.dy;

        let hits = [];

        enemies.forEach((e, ei) => {
            if (
                b.x < e.x + e.width &&
                b.x + b.width > e.x &&
                b.y < e.y + e.height &&
                b.y + b.height > e.y
            ) {
                hits.push(ei);
            }
        });

        if (hits.length > 0) {

            hits.sort((a, b) => b - a).forEach(ei => {
                const enemy = enemies[ei];
                enemies.splice(ei, 1);

                score += 1;
                totalScore += 1;

                floatingTexts.push({
                    text: "+1",
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y,
                    alpha: 1
                });
            });

            if (!b.penetrates) player.bullets.splice(bi, 1);

            scoreDisplay.textContent = "Pontuação: " + score;
            totalScoreDisplay.textContent = "Pontos totais: " + totalScore;
            localStorage.setItem("totalScore", totalScore);
        }
    });

    // Colisão inimigo → player
    enemies.forEach(e => {
        if (
            player.x < e.x + e.width &&
            player.x + player.width > e.x &&
            player.y < e.y + e.height &&
            player.y + player.height > e.y
        ) {
            alert("GAME OVER 😵 Pontuação: " + score);
            enemies = [];
            player.bullets = [];
            score = 0;
            scoreDisplay.textContent = "Pontuação: 0";
            player.x = 400;
            player.y = 300;
            currentAmmo = currentWeapon.magazineSize;
            updateAmmoHUD();
        }
    });

    // Spawn
    if (Math.random() < 0.01) spawnEnemy();

    // Update floating texts
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        let t = floatingTexts[i];
        t.y -= 0.5;
        t.alpha -= 0.02;
        if (t.alpha <= 0) floatingTexts.splice(i, 1);
    }
}

// =======================
// Draw
// =======================
function draw() {
    if (!gameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chão
    ctx.fillStyle = "#1a1a3b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Paredes
    ctx.fillStyle = "#555";
    walls.forEach(w => ctx.fillRect(w.x, w.y, w.width, w.height));

    // Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Bullets
    player.bullets.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });

    // Inimigos
    enemies.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y, e.width, e.height);
    });

    // Floating texts
    floatingTexts.forEach(ft => {
        ctx.globalAlpha = ft.alpha;
        ctx.fillStyle = "#00ff88";
        ctx.font = "20px Arial";
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1;
    });
}

// =======================
// Loop principal
// =======================
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

function startGame() {
    menu.style.display = "none";
    canvas.style.display = "block";
    hud.style.display = "block";
    gameStarted = true;
}