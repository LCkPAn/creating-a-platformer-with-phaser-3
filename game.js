//test1
const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  heigth: 640,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: true,
    },
  }
};

const game = new Phaser.Game(config);

function preload() {

  this.load.image('background', 'assets/images/background.png');
  this.load.image('spike', 'assets/images/spike.png');
  // At last image must be loaded with its JSON
  this.load.atlas('player', 'assets/images/kenney_player.png','assets/images/kenney_player_atlas.json');
  this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');
  // Load the export Tiled JSON
  this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');



}

function create() {

  // Loading a Tiled Map
  const backgroundImage = this.add.image(0, 0,'background').setOrigin(0, 0);
  backgroundImage.setScale(2, 0.8);
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('kenney_simple_platformer', 'tiles');
  const platforms = map.createStaticLayer('Platforms', tileset, 0, 200);

// Adding player
  this.player = this.physics.add.sprite(50, 300, 'player');
  this.player.setBounce(0.1);
  this.player.setCollideWorldBounds(true);
  this.physics.add.collider(this.player, platforms);

  // Adding Animations

  this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNames('player', {
      prefix: 'robo_player_',
      start: 2,
      end: 3,
    }),
    frameRate: 10,
    repeat: -1
  });

  // Create an idle animation i.e the first frame
  this.anims.create({
    key: 'idle',
    frames: [{ key: 'player', frame: 'robo_player_0' }],
    frameRate: 10,
  });

  // Use the second frame of the atlas for jumping
  this.anims.create({
    key: 'jump',
    frames: [{ key: 'player', frame: 'robo_player_1' }],
    frameRate: 10,
  });

  // Enable user input via cursor keys
  this.cursors = this.input.keyboard.createCursorKeys();

  // Create a sprite group for all spikes, set common properties to ensure that
  // sprites in the group don't move via gravity or by player collisions
  this.spikes = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  // Get the spikes from the object layer of our Tiled map. Phaser has a
  // createFromObjects function to do so, but it creates sprites automatically
  // for us. We want to manipulate the sprites a bit before we use them
  const spikeObjects = map.getObjectLayer('Spikes')['objects'];
  spikeObjects.forEach(spikeObject => {
    // Add new spikes to our sprite group
    const spike = this.spikes.create(spikeObject.x, spikeObject.y + 200 - spikeObject.height, 'spike').setOrigin(0, 0);
    // By default the sprite has loads of whitespace from the base image, we
    // resize the sprite to reduce the amount of whitespace used by the sprite
    // so collisions can be more precise
    spike.body.setSize(spike.width, spike.height - 20).setOffset(0, 20);
  });

  // Add collision between the player and the spikes
  this.physics.add.collider(this.player, this.spikes, playerHit, null, this);
}

function update() { }