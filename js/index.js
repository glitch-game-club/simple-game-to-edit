
// a list of our game elements put at the beginning so preload, create and update can access them. 
var player;
var gravity=500;
var coins;
var walls;
var enemies;
var splat;
var reload;
var cursor;
var level;
var wlevel;
var level1;
var level2;
var level3;



// the following javascript object called playState contains all the active code for this simple game, you can add other states like, win, lose, start etc

var playState = {  


    init: function(wlevel) {  
        // Here reset score when play state starts
      score = 0;
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;
      wlevel = wlevel;

    },
  
    preload: function() {  
      
      // Here we preload the image assets - make more here http://piskelapp.com
      game.load.crossOrigin = 'anonymous';
      game.load.image('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAKUlEQVRIie3NoQEAAAgDoP3/8ZKeoYFAJtPOhYjFYrFYLBaLxWKx+G+8cOTYhPAlQ2YAAAAASUVORK5CYII=');
      game.load.image('wall', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAALElEQVRIie3NMQEAAAQAMIcw+qfQihgcO3YvsnouhFgsFovFYrFYLBaL/8YLUq7ap4GwZIYAAAAASUVORK5CYII=');
      game.load.image('coin', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAK0lEQVRIie3NoQEAAAQAMMH/xVO+4gzCwvKiK+dCiMVisVgsFovFYrH4b7wNhlLxXKUgugAAAABJRU5ErkJggg==');
      game.load.image('enemy', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAKElEQVRIie3NoQEAAAjAoP3/tJ6hgUCmqbmQWCwWi8VisVgsFov/xgvVbAFikbDobAAAAABJRU5ErkJggg==');
      
          // Here we preload the audio assets - make more here http://sfbgames.com/chiptone/  
      game.load.audio('win', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1171931/win.wav');
      game.load.audio('splat', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1171931/splat.wav');
      
    },

    create: function() {  
        // Here we create the game
      
      game.stage.backgroundColor = '#5699ab';
      
      // These two lines add physics to the game world
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.world.enableBody = true;
      
      // set up cursor keys to allow user input (the options are set in update)
      cursor = game.input.keyboard.createCursorKeys();
      
      // add the main player to the game 70 pixels to the left and 100 pixels down from the top
      player = game.add.sprite(20, 100, 'player');


      //add gravity to the player so that it falls down
      player.body.gravity.y = gravity;
      
      // don't let the player leave the screen area
      player.body.collideWorldBounds=true;

      
      // add audio to two variable ready to play later in other functions
      splat = game.add.audio('splat');
      win = game.add.audio('win');


      //create groups for the walls, coins and enemies - what ever happens to the group happens
      // to all the members of the group 
      
      walls = game.add.group();
      coins = game.add.group();
      enemies = game.add.group();

// Design the level. x = platform, o = coin, h = hazard.
      level3 = [
          '                 ',
          '                o',
          '                 ',
          '      o h    xxxx',
          '      xxx        ',
          '    o            ',
          '                 ',
          '  xxxx          o',
          '     o    xxxx   ',
          '                 ',
          '    o   h    h   ',
          'xxxxxxxxxxxxxxxxx',
      ];
      
      level2 = [
          '                o',
          '                 ',
          '                 ',
          '                 ',
          '         o       ',
          '        xxxxx    ',
          '                 ',
          '     o          ',
          '   xxxx          ',
          '                 ',
          '    o        h   ',
          'xxxxxxxxxxxxxxxxx',
      ];
      
      level1 = [
          '                 ',
          '                 ',
          '    o            ',
          '                 ',
          '  xxxxx          ',
          '                ',
          '                 ',
          '                o',
          '             xxxx',
          '                 ',
          '    o   h    h   ',
          'xxxxxxxxxxxxxxxxx',
      ];
      if (!wlevel ||  wlevel ==1)
        level = level1;
  
      else if (wlevel == 2 )
        level = level2;
 
     else if (wlevel == 3 )
        level = level3;
      
// Create the level by going through the array
for (var i = 0; i < level.length; i++) {
    for (var j = 0; j < level[i].length; j++) {

        // Create a wall and add it to the 'walls' group
        if (level[i][j] == 'x') {
          var wall = game.add.sprite(0+32*j, 0+32*i, 'wall');
          walls.add(wall);
          wall.body.immovable = true; 
        }

        // Create a coin and add it to the 'coins' group
        else if (level[i][j] == 'o') {
            var coin = game.add.sprite(0+32*j, 0+32*i, 'coin');
            coins.add(coin);
        }

        // Create a enemy and add it to the 'enemies' group
        else if (level[i][j] == 'h') {
            var enemy = game.add.sprite(0+32*j, 0+32*i, 'enemy');

            enemies.add(enemy);
        }
    }
}
      
    },

    update: function() {  
        // Here we update the game 60 times per second - all code here is run all the time

        // stop the player if no key is pressed 
        player.body.velocity.x = 0;
      
        // Make the player and the walls collide , so player can't move through them
        game.physics.arcade.collide(player, walls);

        // Call the 'takeCoin' function when the player takes a coin
        game.physics.arcade.overlap(player, coins, this.takeCoin, null, this);

        // Call the 'lose' function when the player touches the enemy
        game.physics.arcade.overlap(player, enemies, this.restart, null, this);
             

        // add the controls for the cursor keys
        if (cursor.left.isDown) 
            player.body.velocity.x = -100;
        else if (cursor.right.isDown) 
            player.body.velocity.x = 100;
        else 
            player.body.velocity.x = 0;
     
              // Make the player jump if he is touching the ground
        if (cursor.up.isDown && player.body.touching.down) 
            player.body.velocity.y = -300;

      if (coins.total == 0)
         this.nextlevel();

    },
  
    // Function to kill/disappear a coin if player touches it
    takeCoin: function(player, coin) {
        coin.kill();
        win.play();  

          },

    // Function to restart the game
    restart: function() {
      wlevel=1;      
      game.state.start('main',true,false, wlevel); 
      splat.play();

},

      nextlevel: function() {      
        win.play();  
        if (!wlevel)
          wlevel=1;
        wlevel = wlevel+1
        game.state.start('main',true,false, wlevel);
},
  
};

// Initialize the game at a certain size 
var game = new Phaser.Game(550, 400, Phaser.AUTO, "", "main", false, false);  

//Add and start our play state 
game.state.add('main', playState);  
game.state.start('main');

