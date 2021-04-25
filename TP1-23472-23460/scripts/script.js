let game;
let player;
let platforms;
let bullets;
let cursors;
let bubbles;
let lastFired = 0;
let score = 0;
let contaScore=0;
let speed;
let scoreText;
let gameOver = false;
let soundOn = true;

let gameOptions = {

    defaultSize: {
        width: 750,
        height: 1334,
        maxRatio: 4 / 3
    },

}

window.onload = function() {

    let width = gameOptions.defaultSize.width;
    let height = gameOptions.defaultSize.height;

    let perfectRatio = width / height;

    let innerWidth = window.innerWidth;
    let innerHeight = window.innerHeight;

    let actualRatio = Math.min(innerWidth / innerHeight, gameOptions.defaultSize.maxRatio);

    if(perfectRatio > actualRatio){
        height = width / actualRatio;
    }
    else{
        width = height * actualRatio;
    }

    let gameConfig = {
        type: Phaser.AUTO,

        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: width,
            height: height
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        backgroundColor: 0x132c43,
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    }

    game = new Phaser.Game(gameConfig);

    window.focus();
}


function preload() {

    this.load.image("background", "assets/background.png");
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image("telaini", "assets/telaini.png");
    this.load.image("pointer", "assets/pointer.png");
    this.load.image("playbutton", "assets/playbutton.png");
    this.load.image("mutesound", "assets/mutesound.png");
    this.load.image("tile", "assets/platform.png");
    this.load.image("telafinal", "assets/telafinal.png");

    this.load.audio("death", ["assets/sounds/death.mp3", "assets/sounds/death.ogg"]);
    this.load.audio("run", ["assets/sounds/run.mp3", "assets/sounds/run.ogg"]);
    this.load.audio("stick", ["assets/sounds/stick.mp3", "assets/sounds/stick.ogg"]);
    this.load.audio("click", ["assets/sounds/click.mp3", "assets/sounds/click.ogg"]);

    this.load.spritesheet("hero", "assets/hero.png", {
        frameWidth: 77,
        frameHeight: 98
    });

    this.load.spritesheet("heroEsquerda", "assets/heroEsquerda.png", {
        frameWidth: 77,
        frameHeight: 98
    });

    this.load.spritesheet("bubble", "assets/bubble.png", {
        frameWidth: 77,
        frameHeight: 85
    });




}


function create() {

    //ANIMAÇÕES - Bolha

    this.anims.create({
        key: "bolhaRebenta",
        frames: this.anims.generateFrameNumbers("bubble", {
            start: 1,
            end: 6
        }),
        frameRate: 10,
        repeat: 0
    });

    //ANIMAÇÕES - Player

    this.anims.create({
        key: "idle",
        frames: this.anims.generateFrameNumbers("hero", {
            start: 0,
            end: 11
        }),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: "runRight",
        frames: this.anims.generateFrameNumbers("hero", {
            start: 12,
            end: 19
        }),
        frameRate: 20,
        repeat: -1
    });
    this.anims.create({
        key: "runLeft",
        frames: this.anims.generateFrameNumbers("heroEsquerda", {
            start: 19,
            end: 12
        }),
        frameRate: 20,
        repeat: -1
    });

    //PLATAFORMAS
    platforms = this.physics.add.staticGroup();
    platforms.create(900, 1270, 'tile').setScale(5).refreshBody().setDepth(1);

    player = this.physics.add.sprite(900, 1150, 'hero').setVisible(false).setDepth(1);
    player.setOrigin(1, 1);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    //SONS

    const runSound = this.sound.add('run', {
        volume:0.5
    });
    const clickSound = this.sound.add('click', {
        volume:0.5
    });

    const deathSound = this.sound.add('death', {
        volume:0.5
    });

    const bubbleSound = this.sound.add('stick', {
        volume:0.5
    });


    this.input.keyboard.on('keydown-LEFT', () => {
        if(soundOn==true) {
            runSound.play();
        }
    });

    this.input.keyboard.on('keydown-RIGHT', () => {
        if(soundOn==true) {
            runSound.play();
        }
    });
    this.input.keyboard.on('keyup-LEFT', () => {
        runSound.stop();
    });

    this.input.keyboard.on('keyup-RIGHT', () => {
        runSound.stop();
    });

    //TELA FINAL

    let telafinal = this.add.sprite(this.game.renderer.width/2 , this.game.renderer.height*0.35, "telafinal").setDepth(1).setScale(0.5);

    telafinal.setVisible(false);

    //MENU
    let telaini = this.add.sprite(this.game.renderer.width/2 , this.game.renderer.height * 0.30, "telaini").setDepth(1).setScale(0.5);
    let background = this.add.sprite(-50,-50,"background").setOrigin(0).setDepth(0);
    background.displayWidth = game.config.width + 100;
    background.displayHeight = game.config.height +100;

    let playButton = this.add.sprite(this.game.renderer.width/2 , this.game.renderer.height * 0.50, "playbutton").setDepth(1).setScale(1.3);
    let muteButton = this.add.sprite(this.game.renderer.width/2 , this.game.renderer.height * 0.50+100, "mutesound").setDepth(1).setScale(0.35);
    let hoverSprite = this.add.sprite(100,100,"pointer").setDepth(2);
    hoverSprite.setVisible(false);


    playButton.setInteractive();
    playButton.on("pointerover", ()=>{
        if(soundOn==true){
            clickSound.play();
        }
        hoverSprite.setVisible(true);
        hoverSprite.x = playButton.x - playButton.width+80;
        hoverSprite.y = playButton.y;
    });
    playButton.on("pointerout", ()=>{
        hoverSprite.setVisible(false);
    });

    muteButton.setInteractive();

    muteButton.on("pointerover", ()=>{
        if(soundOn==true){
            clickSound.play();
        }
        hoverSprite.setVisible(true);
        hoverSprite.x = 640;
        hoverSprite.y = muteButton.y;
    });
    muteButton.on("pointerout", ()=>{
        hoverSprite.setVisible(false);
    });

    muteButton.on("pointerdown", ()=>{
        if(soundOn==true){
            soundOn=false;
        }
        else{
            soundOn=true;
        }
    });

    playButton.on("pointerdown", ()=>{
        telaini.setVisible(false);
        playButton.setVisible(false);
        hoverSprite.setVisible(false);
        muteButton.setVisible(false);
        if(soundOn==true){
            clickSound.play();
        }



        //PLAYER
        player.setVisible(true);



        //BUBBLE

        bubbles = this.physics.add.group();
        this.physics.add.collider(bubbles, platforms);
        this.physics.add.collider(player, bubbles, hitBubble, null, this);


        function hitBubble (player, bubble)
        {
            if(soundOn==true) {
                deathSound.play();
            }
            this.physics.pause();

            player.setTint(0xff0000);

            gameOver = true;

            telafinal.setVisible(true);
            soundOn=false;
        }
        if(score==0){
            makeBubble ();
        }
        function makeBubble ()
        {

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bubble = bubbles.create(x, 16, 'bubble');
            bubble.setBounce(1);
            bubble.setCollideWorldBounds(true);
            bubble.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bubble.allowGravity = false;
            bubble.setScale(1);


        }
        //BULLET

        let Bullet = new Phaser.Class({

            Extends: Phaser.Physics.Arcade.Image,

            initialize:

                function Bullet (scene)
                {
                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

                    this.speed = Phaser.Math.GetSpeed(400, 0.5);
                },

            fire: function (x, y)
            {
                this.setPosition(x, y - 50);

                this.setActive(true);
                this.setVisible(true);
            },

            update: function (time, delta)
            {
                this.setVelocityY(-this.speed * 1000);
                if (this.y < -50)
                {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }

        });

        bullets = this.physics.add.group({
            allowGravity: false,
            classType: Bullet,
            maxSize: 1,
            runChildUpdate: true,
            immovable:true
        });

        function hitBullet (bullet,bubble)
        {
            bullet.setActive(false);
            bullet.setVisible(false);
            bullet.destroy();

            bubble.anims.play('bolhaRebenta');
            bubble.setVelocity(0,0);
            bubble.once('animationcomplete', ()=>{

                bubble.disableBody(true);
                bubble.setActive(false);
                bubble.setVisible(false);
                makeBubble();
            });


            if(soundOn==true) {
                bubbleSound.play();
            }
            //Atualiza o score
            score += 10;
            contaScore += 10;
            if(contaScore == 30){
                contaScore=0;
                makeBubble();
            }
            scoreText.setText('Score: ' + score);


        }

        this.physics.add.collider(bullets, bubbles, hitBullet, null,this);


        //SCORE

        scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });
        speed = Phaser.Math.GetSpeed(400, 0.5);
    });

    cursors = this.input.keyboard.createCursorKeys();

}

function update(time) {

    //MOVIMENTO

    if (cursors.left.isDown){
        player.setVelocityX(-300);
        player.anims.play('runLeft', true);
    }
    else if (cursors.right.isDown){
        player.setVelocityX(300);
        player.anims.play('runRight', true);
    }
    else{
        player.setVelocityX(0);
        player.anims.play('idle', true);
    }

    //BULLET
    if(cursors.space.isDown){
        var bullet = bullets.get();
        if (bullet)
        {
            bullet.fire(player.x, player.y);
            lastFired = time + 50;
        }
    }
}










