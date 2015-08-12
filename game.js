var game = new Phaser.Game(800, 320, Phaser.AUTO, 'game', { preload: preload, create: create, update: update});

// load images and resources
function preload() {
    game.load.atlasJSONHash('player', 'assets/playeranimations/playerspritesheet.png', 'assets/playeranimations/playerspritesheet.json');

    game.load.tilemap('tilemap', 'assets/samplelevel1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/sampletileset.png')
}

var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;

var map;
var groundLayer;
var backgroundLayer;

var level = 1;
var startLevel = true;

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
    // player.body.setSize(20, 32, 5, 16);

    game.camera.follow(player);

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

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

// called every update (runs game)
function update() {

    game.physics.arcade.collide(player, groundLayer);

    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        player.body.velocity.x = -150;

        if (facing != 'left') {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = 150;

        if (facing != 'right') {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else {
        if (facing != 'idle') {
            player.animations.stop();
            if (facing == 'left') {
                player.frame = 2;
            }
            else {
                player.frame = 2;
            }
            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
        player.body.velocity.y = -380;
        jumpTimer = game.time.now + 750;
    }
}