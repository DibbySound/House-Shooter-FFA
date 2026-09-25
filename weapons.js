const weapons = [
    {
        name: "Pistol",
        fireRate: 500, // tempo entre tiros em ms
        bulletSpeed: 7,
        automatic: false,
        unlocked: true,
        cost: 0,
        magazineSize: 12,
        reloadTime: 1856,
        soundShoot: new Audio("sounds/shoot_pistol.ogg"),
        soundReload: new Audio("sounds/reload_pistol.mp3")
    },
    {
        name: "SMG",
        fireRate: 200,
        bulletSpeed: 10,
        automatic: true,
        unlocked: false,
        cost: 100,
        penetrates: false,
        magazineSize: 30,
        reloadTime: 2320,
        soundShoot: new Audio("sounds/shoot_smg.wav"),
        soundReload: new Audio("sounds/reload_smg.wav")
    },
    {
        name: "Rifle",
        fireRate: 300,
        bulletSpeed: 15,
        automatic: true,
        unlocked: false,
        cost: 200,
        penetrates: false,
        magazineSize: 30,
        reloadTime: 2050,
        soundShoot: new Audio("sounds/shoot_rifle.wav"),
        soundReload: new Audio("sounds/reload_rifle.wav")
    },
    {
        name: "Sniper",
        fireRate: 2000,
        bulletSpeed: 30,
        automatic: false,
        unlocked: false,
        cost: 10,
        penetrates: true,
        magazineSize: 5,
        reloadTime: 2900,
        soundShoot: new Audio("sounds/shoot_sniper.wav"),
        soundReload: new Audio("sounds/reload_sniper.mp3")
    }
];