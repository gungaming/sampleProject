let player;
let item;
let platforms;
let cursors;
let score = 0;
let gameover = false;


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
        this.load.image("bg",'src/images/bg.jpg');
        this.load.image("ground",'src/images/ground.png');
        this.load.image("platform",'src/images/long_path.png');
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
        // platforms.create(1200, 400, 'platform');
    }

    update() {

    }
}

export default GameScene;
