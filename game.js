var game = new Phaser.Game(800, 320, Phaser.AUTO, 'game', { preload: preload, create: create, update: update});

// load images and resources
function preload() {
    game.load.atlasJSONHash('player', 'assets/playeranimations/playeranimations.png', 'assets/playeranimations/playeranimations.json');

    game.load.tilemap('tilemap', 'assets/samplelevel1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/sampletileset.png');
    game.load.image('bullet', 'assets/bullet.png');
}

var player;
var facing = 'left';
var jumpTimer = 0;
var jumpCount = 0;
var isCrouching;

var bullets;
    var bullet;
    var bulletTime = 0;
    var bulletV = 1000;
    var bulletDelay = 500;

var cursors;
var jumpButton;
var crouchButton;
var shootButton;

var map;
var groundLayer;
var backgroundLayer;

// start of game
function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.desiredFps = 30;

    game.stage.backGroundColor = '#a9f0ff'

    map = game.add.tilemap('tilemap');
    map.addTilesetImage('sts', 'tiles');

    backgroundLayer = map.createLayer('BackgroundLayer');
    groundLayer = map.createLayer('GroundLayer');

    map.setCollisionBetween(1,100,true, 'GroundLayer');
    groundLayer.resizeWorld();

    game.physics.arcade.gravity.y = 700;

    player = game.add.sprite(32, 32, 'player', 'paMiddle.png');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.1;
    player.body.collideWorldBounds = true;
    game.camera.follow(player);

    // player bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(40, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('body.allowGravity', false);

    player.animations.add('left', [
        'paLeft1.png',
        'paLeft2.png'
    ], 10, true, false);
    player.animations.add('turn', [
        'paMiddle.png'
    ], 20, true, false);
    player.animations.add('right', [
        'paRight1.png',
        'paRight2.png'
    ], 10, true, false);
    player.animations.add('shootRight', [
        'paShootRight.png',
        'paShootRight.png',
        'paShootRight.png',
        'paShootRight.png'
    ], 10, true, false);
    player.animations.add('shootLeft', [
        'paShootLeft.png',
        'paShootLeft.png',
        'paShootLeft.png',
        'paShootLeft.png'
    ], 10, true, false);
    player.animations.add('crouch', [
        'paCrouch1.png',
        'paCrouch2.png'
    ], 10, true, false);

    cursors = game.input.keyboard.createCursorKeys();
    shootButton = game.input.keyboard.addKey(Phaser.Keyboard.N);

    cursors.up.onDown.add(jump, this);
}

// called every update (runs game)
function update() {

    game.physics.arcade.collide(player, groundLayer);

    player.body.velocity.x = 0;

    // go left
    if (cursors.left.isDown) {
        player.body.velocity.x = -150;

        if (facing != 'left') {
            player.animations.play('left');
            facing = 'left';
        }
    }

    // go right
    else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
        if (facing != 'right') {
            player.animations.play('right');
            facing = 'right';
        }
    }

    // stand still / crouch
    else {
        if (facing != 'idle') {
            player.animations.stop();

            // set frame to idle
            if(facing === 'left') {
                player.frameName = 'paLeft2.png';
            } else if(facing === 'right') {
                player.frameName = 'paRight2.png';
            }
            facing = 'idle';
        }

        // crouching
        if(cursors.down.isDown) {
            isCrouching = true;
        } else {
            isCrouching = false;
        }

        if(isCrouching) {
            if(player.frameName != 'paCrouch2.png') {
                player.animations.play('crouch');    
            }
            player.frameName = 'paCrouch2.png';
        }
    }

    if(shootButton.isDown) {
        shootBullet(player);
    }
    
    if(player.body.onFloor()) {
        jumpCount = 0;
    }
}

function jump() {
    if (cursors.up.isDown && jumpCount < 2) {
        jumpCount++;    
        player.body.velocity.y = -300;
    }
}

function shootBullet(p) {
    var offset = 1;
    var anima;
    if(facing == 'left') {
        offset *= -1;
        anima = 'shootLeft';
    } else {
        anima = 'shootRight'
    }
    var bullet = bullets.getFirstExists(false);
    if(bullet) {
        if(game.time.now > bulletTime) {
            player.animations.play(anima);
            bullet.reset(p.x+(offset*20), p.y+player.height/4);
            bullet.body.velocity.x = bulletV*offset;
            bullet.lifespan = 500;
            bulletTime = game.time.now + bulletDelay;
        }
    }
}