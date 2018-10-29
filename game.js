"use strict";
// a list of our game elements put at the beginning
// so preload, create and update can access them.

// Things that change how the game works
var gravity = 500;
var playerMoveSpeed = 100;
var playerJumpSpeed = 300;

// Parts of the game
var game;
var player;
var coins;
var walls;
var enemies;

// Keeping track of the player
var currentLevel;
var level1;
var level2;
var level3;
var score;

// Noises in the game
var splatNoise;
var winNoise;

// The following javascript object called playState contains all the active code for this simple game.
// You can add other states like, win, lose, start etc
var playState = {};
playState.init = function (levelToRun) {
    // Here reset score when play state starts
    score = 0;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    currentLevel = levelToRun;

};

playState.preload = function () {
    // Here we preload the image assets - make more here http://piskelapp.com
    game.load.crossOrigin = "anonymous";
    game.load.image("player", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAKUlEQVRIie3NoQEAAAgDoP3/8ZKeoYFAJtPOhYjFYrFYLBaLxWKx+G+8cOTYhPAlQ2YAAAAASUVORK5CYII=");
    //game.load.spritesheet('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABACAYAAAB7jnWuAAAAPUlEQVRoge3SMQEAAAyDsPo3vcngCQpysIsbAAAAAAAAAAAAAAAAAEAOkPIJAQAAAAAAAAAAAAAAAABqwAOdyOO0PP/+wQAAAABJRU5ErkJggg==',32,32); 
    game.load.image("wall", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAALElEQVRIie3NMQEAAAQAMIcw+qfQihgcO3YvsnouhFgsFovFYrFYLBaL/8YLUq7ap4GwZIYAAAAASUVORK5CYII=");
    game.load.image("coin", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAK0lEQVRIie3NoQEAAAQAMMH/xVO+4gzCwvKiK+dCiMVisVgsFovFYrH4b7wNhlLxXKUgugAAAABJRU5ErkJggg==");
    game.load.image("enemy", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAKElEQVRIie3NoQEAAAjAoP3/tJ6hgUCmqbmQWCwWi8VisVgsFov/xgvVbAFikbDobAAAAABJRU5ErkJggg==");

    // Here we preload the audio assets - make more here http://sfbgames.com/chiptone/
    game.load.audio("win", "https://cdn.glitch.com/f555a7cf-4ed2-4768-8167-e545853a6981%2Fct_coin_1.wav?1537903834353");
    game.load.audio("splat", "https://cdn.glitch.com/5d318c12-590d-47a1-b471-92a5dc0aae9d%2Fsplat.wav?1539513041296");

};

playState.create = function () {
    // Here we create the game

    game.stage.backgroundColor = "#5699ab";

    // These two lines add physics to the game world
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.enableBody = true;

    // set up cursor keys to allow user input (the options are set in update)
    game.cursor = game.input.keyboard.createCursorKeys();

    // add the main player to the game 70 pixels to the left and 100 pixels down from the top
    player = game.add.sprite(20, 100, "player");
    //player.animations.add("move", [0, 1], 3, true);
    //player.animations.play("move");

    //add gravity to the player so that it falls down
    player.body.gravity.y = gravity;

    // don't let the player leave the screen area
    player.body.collideWorldBounds = true;


    // add audio to two variable ready to play later in other functions
    splatNoise = game.add.audio("splat");
    winNoise = game.add.audio("win");


    //create groups for the walls, coins and enemies - what ever happens to the group happens
    // to all the members of the group

    walls = game.add.group();
    coins = game.add.group();
    enemies = game.add.group();

    // Design the level. x = platform, o = coin, h = hazard.
    level3 = [
        "                 ",
        "                o",
        "                 ",
        "      o h    xxxx",
        "      xxx        ",
        "    o            ",
        "                 ",
        "  xxxx          o",
        "     o    xxxx   ",
        "                 ",
        "    o   h    h   ",
        "xxxxxxxxxxxxxxxxx"
    ];

    level2 = [
        "                o",
        "                 ",
        "                 ",
        "                 ",
        "         o       ",
        "        xxxxx    ",
        "                 ",
        "     o          ",
        "   xxxx          ",
        "                 ",
        "    o        h   ",
        "xxxxxxxxxxxxxxxxx"
    ];

    level1 = [
        "                 ",
        "                 ",
        "    o            ",
        "                 ",
        "  xxxxx          ",
        "                ",
        "                 ",
        "                o",
        "             xxxx",
        "                 ",
        "    o   h    h   ",
        "xxxxxxxxxxxxxxxxx"
    ];

    if (!currentLevel || currentLevel === 1) {
        loadLevel(level1);
    } else if (currentLevel === 2) {
        loadLevel(level2);
    } else if (currentLevel === 3) {
        loadLevel(level3);
    }
};

playState.update = function () {
    // Here we update the game 60 times per second - all code here is run all the time

    // stop the player if no key is pressed
    player.body.velocity.x = 0;

    // Make the player and the walls collide , so player can't move through them
    game.physics.arcade.collide(player, walls);

    // Call the 'takeCoin' function when the player takes a coin
    game.physics.arcade.overlap(player, coins, playState.takeCoin, null, playState);

    // Call the 'lose' function when the player touches the enemy
    game.physics.arcade.overlap(player, enemies, playState.restart, null, playState);


    // add the controls for the cursor keys
    if (game.cursor.left.isDown) {
        player.body.velocity.x = -playerMoveSpeed;
    } else if (game.cursor.right.isDown) {
        player.body.velocity.x = playerMoveSpeed;
    } else {
        player.body.velocity.x = 0;
    }

    // Make the player jump if he is touching the ground
    if (game.cursor.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -playerJumpSpeed;
    }

    if (coins.total === 0) {
        playState.nextlevel();
    }

};

playState.takeCoin = function (player, coin) {
    // Function to kill/disappear a coin if player touches it
    coin.kill();
    winNoise.play();

};

// Function to restart the game
playState.restart = function () {
    currentLevel = 1;
    game.state.start("main", true, false, currentLevel);
    splatNoise.play();

};

playState.nextlevel = function () {
    winNoise.play();
    if (!currentLevel) {
        currentLevel = 1;
    }
    currentLevel = currentLevel + 1;
    game.state.start("main", true, false, currentLevel);
};

// Initialize the game at a certain size
game = new Phaser.Game(550, 400, Phaser.AUTO, "", "main", false, false);

//Add and start our play state
game.state.add("main", playState);
game.state.start("main");

function loadLevel (level) {
    // Create the level from the array of strings
    var i;
    var j;
    var wall;
    var coin;
    var enemy;
    for (i = 0; i < level.length; i = i + 1) {
        for (j = 0; j < level[i].length; j = j + 1) {
            if (level[i][j] === "x") { // Create a wall and add it to the 'walls' group
                wall = game.add.sprite(0 + 32 * j, 0 + 32 * i, "wall");
                wall.body.immovable = true;
                walls.add(wall);
            } else if (level[i][j] === "o") { // Create a coin and add it to the 'coins' group
                coin = game.add.sprite(0 + 32 * j, 0 + 32 * i, "coin");
                coins.add(coin);
            } else if (level[i][j] === "h") { // Create a enemy and add it to the 'enemies' group
                enemy = game.add.sprite(0 + 32 * j, 0 + 32 * i, "enemy");
                enemies.add(enemy);
            }
        }
    }
}
