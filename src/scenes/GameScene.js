let player1;
let player2;
let item;
let platforms;
let fire;
let cursors;
let score = 0;
let gameover = false;
let scoreText1;
let scoreText2;

let keyA;
let keyW;
let keyS;
let keyD;

let overpic
let logs;
let stars;

let width;
let height;
let x;
let y;

class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });
    }

    preload() {
        this.load.image("bg",'./../images/bg.jpg');
        this.load.image("ground",'./../images/ground.png');
        this.load.image("platform",'./../images/long_path.png');
        this.load.image("fire",'./../images/fire.png');
        this.load.spritesheet("beaver","./../images/player.png",{ frameWidth: 68, frameHeight: 68});
        this.load.spritesheet("dude","./../images/dude.png",{ frameWidth: 32, frameHeight: 48});
        this.load.image("over",'./../images/game_over.png');
        this.load.image("log",'./../images/log.png');
        this.load.image("star",'./../images/star.png');        
    }

    create() {

        //set ขนาดให้กับ map ของเกม
        width = this.scene.scene.physics.world.bounds.width;
        height = this.scene.scene.physics.world.bounds.height;

        x = width * 0.5;
        y = height * 0.5;

        //set ให้ขนาดภาพใหญ่ขึ้นจากตัวภาพมันแค่ 800 x 600 ขยาย scale
        //ใช้ setScale()
        this.add.image(800, 600, 'bg').setScale(2)
    
        platforms = this.physics.add.staticGroup()
        
        platforms.create(300, 680, 'ground').setSize(4000, 200, true).setScale(2);
        platforms.create(700, 680, 'ground').setSize(4000, 200, true).setScale(2);
        platforms.create(200, 400, 'platform')
        platforms.create(700, 500, 'platform');
        platforms.create(750, 220, 'platform');

        player1 = this.physics.add.sprite(250, 300, 'beaver');
        player2 = this.physics.add.sprite(900, 300, 'dude').setScale(1.5);
    
        //ไม่หลุดออกนอกโลก
        player1.setBounce(0.2)
        player1.setCollideWorldBounds(true)
        player2.setBounce(0.2)
        player2.setCollideWorldBounds(true)

        //ไม่ให้ตกพื้น
        this.physics.add.collider(player1, platforms)
        this.physics.add.collider(player2, platforms)

        //สร้าง anime ให้ player1
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('beaver', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'beaver', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('beaver', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //สร้าง anime ให้ player2
        this.anims.create({
            key: 'KeyA',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'KeyS',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'KeyD',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //สร้างปุ่มกด
        cursors = this.input.keyboard.createCursorKeys()
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        //Object ตัวไฟ
        fire = this.physics.add.image(400, 400, 'fire').setScale(1.5);
        this.physics.add.collider(fire, platforms);

        //ถ้าชนไฟ จะทำฟังก์ชั่น hitFire 
        this.physics.add.overlap(player1, fire, hitFire);
        this.physics.add.overlap(player2, fire, hitFire);

        
        //set ให้รูปยังไม่ขึ้นถ้ายังไม่แพ้
        overpic = this.add.image(750, y, 'over').setScale(2);
        overpic.setVisible(false);
        
        //text score 
        scoreText1 = this.add.text(16, 16, 'Score : 0', { fontSize: '32px', fill: '#000' });
        scoreText2 = this.add.text(1200, 16, 'Score : 0', { fontSize: '32px', fill: '#000' });
        
        //สร้าง Object logs สำหรับ beaver
        logs = this.physics.add.group({
            key: 'log',
            repeat: 4,
            setXY: { x: 12, y: 0, stepX: 70 }
            
            // repeat: จำนวนที่เราจะspawn
            // setXY: ตำแหน่ง x y ที่spawn, stepxคือระยะห่างxระหว่างแต่ละตัว
        });
        logs.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
        });
        
        this.physics.add.collider(logs, platforms);

        stars = this.physics.add.group({
            key: 'star',
            repeat: 4,
            setXY: { x: 500, y: 0, stepX: 70 }
            
            // repeat: จำนวนที่เราจะspawn
            // setXY: ตำแหน่ง x y ที่spawn, stepxคือระยะห่างxระหว่างแต่ละตัว
        });
        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
        });
        
        this.physics.add.collider(stars, platforms);
        
        //ถ้าชนเพชร จะทำฟังก์ชั่น increaseScore
        this.physics.add.overlap(player1, logs, increaseScoreBeaver);
        this.physics.add.overlap(player2, stars, increaseScoreDude);

    }

    update() {
        if(gameover == true){
            this.physics.pause();
            overpic.setVisible(true);
            player1.anims.play('turn')
            player2.anims.play('KeyS')
        }

        if(keyA.isDown){
            player1.setVelocityX(-330)
            player1.anims.play('left', true)
        }else if(keyD.isDown){
            player1.setVelocityX(330)
            player1.anims.play('right', true)
        }else{
            player1.setVelocityX(0)
            player1.anims.play('turn', true)
        }

        if(cursors.left.isDown){
            player2.setVelocityX(-330)
            player2.anims.play('KeyA', true)
        }else if(cursors.right.isDown){
            player2.setVelocityX(330)
            player2.anims.play('KeyD', true)
        }else{
            player2.setVelocityX(0)
            player2.anims.play('KeyS', true)
        }

        if(cursors.up.isDown && player2.body.touching.down){
            player2.setVelocityY(-330)
        }
        if(keyW.isDown && player1.body.touching.down){
            player1.setVelocityY(-330)
        }
        
    }
}

function hitFire(player1, player2, fire){
    console.log("collider");
    gameover = true;
}

function increaseScoreBeaver(player1, log){
    log.disableBody(true, true);
    score += 100;
    scoreText1.setText('Beaver : ' + score);

    
}

function increaseScoreDude(player2, star){
    star.disableBody(true, true);
    score += 100;
    scoreText2.setText('Dude : ' + score);
}

export default GameScene;
