const loadoutMenu = document.getElementById("loadoutMenu");
const backBtn = document.getElementById("backBtn");

loadoutBtn.onclick = () => {
    menu.style.display = "none";
    loadoutMenu.style.display = "flex";
    renderWeapons();
};

backBtn.onclick = () => {
    loadoutMenu.style.display = "none";
    menu.style.display = "flex";
};

function renderWeapons() {
    weaponList.innerHTML = "";

    weapons.forEach((weapon, index) => {

        const weaponDiv = document.createElement("div");
        weaponDiv.style.border = "2px solid white";
        weaponDiv.style.padding = "10px";
        weaponDiv.style.margin = "10px";
        weaponDiv.style.background = "#222";
        weaponDiv.style.color = "white";

        let status = weapon.unlocked ? "Desbloqueada" : "Bloqueada (" + weapon.cost + " pts)";
        if (currentWeapon === weapon) {
            status += " | EQUIPADA";
        }

        weaponDiv.innerHTML = `
            <h3>${weapon.name}</h3>
            <p>Fire Rate: ${weapon.fireRate}</p>
            <p>Velocidade Bala: ${weapon.bulletSpeed}</p>
            <p>${status}</p>
        `;

        weaponDiv.onclick = () => {
            if (!weapon.unlocked) {
                if (totalScore >= weapon.cost) {
                    weapon.unlocked = true;
                    totalScore -= weapon.cost;
                    localStorage.setItem("totalScore", totalScore);
                } else {
                    alert("Não tens pontos suficientes!");
                    return;
                }
            }

            currentWeapon = weapon;
            renderWeapons();
        };

        weaponList.appendChild(weaponDiv);
    });
}
