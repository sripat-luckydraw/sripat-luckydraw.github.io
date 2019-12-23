ig.module("game.main")
	.requires(
		"impact.game",
		"impact.font",
		"impact.input",
		"plugins.tween",

		"game.entities.pointer",
		"impact.sound",

		"game.levels.menu",
		"game.levels.game"
	)
	.defines(function() {
		MyGame = ig.Game.extend({
			// Load a font
			font: new ig.Font("media/04b03.font.png"),
			sound_click: new ig.Sound("media/audio/click.ogg"),
			bgm: new ig.Sound("media/audio/bgm.ogg", false),
			pointer: null,

			_width: 1194,
			_height: 834,

			helper: {
				shuffleArr: function(array) {
					var currentIndex = array.length,
						temporaryValue,
						randomIndex;

					// While there remain elements to shuffle...
					while (0 !== currentIndex) {
						// Pick a remaining element...
						randomIndex = Math.floor(Math.random() * currentIndex);
						currentIndex -= 1;

						// And swap it with the current element.
						temporaryValue = array[currentIndex];
						array[currentIndex] = array[randomIndex];
						array[randomIndex] = temporaryValue;
					}

					return array;
				}
			},

			init: function() {
				// Initialize your game here; bind keys etc.

				ig.game.pointer = ig.game.spawnEntity(EntityPointer, 0, 0);

				ig.input.initMouse();
				ig.input.bind(ig.KEY.MOUSE1, "click");

				//ig.music.add(this.bgm);

				this.eventListenerSetup();
				this.resize();

				//ig.music.volume = 0.5;

				//setTimeout(() => {
				//	ig.music.play();
				//}, 5000);

				//this.loadLevel(LevelMenu);
				this.loadLevel(LevelGame);
			},

			update: function() {
				// Update all entities and backgroundMaps
				this.parent();

				//console.log(ig.input.mouse);

				//if (ig.game.pointer.isFirstPressed) {
				//	console.log("click");
				//
				//	ig.music.play();
				//	this.sound_click.play();
				//}

				// Add your own, additional update code here
			},

			draw: function() {
				// Draw all entities and backgroundMaps
				this.parent();

				//var ctx = ig.system.context;
				//
				//ctx.fillStyle = "#15AC9A";
				//
				//ctx.fillRect(0, 0, ig.system.width, ig.system.height);
			},

			eventListenerSetup: function() {
				window.addEventListener("resize", this.resize.bind(this));

				document.ontouchmove = function(e) {
					window.scrollTo(0, 1);
					e.preventDefault();
				};
			},

			resize: function() {
				var width, height;

				var ratio = {
					x: ig.system.width / ig.system.height,
					y: ig.system.height / ig.system.width
				};

				if (window.innerWidth > window.innerHeight) {
					height = window.innerHeight;
					width = window.innerHeight / ratio.y;
				} else {
					width = window.innerWidth;
					height = window.innerWidth / ratio.x;
				}

				$("#canvas").css({
					width: width,
					height: height
				});

				this.sizeRatio = {
					x: width / this._width,
					y: height / this._height
				};

				//console.log($("#canvas")[0]);
			},
			loadLevel: function(data) {
				// Remember the currently loaded level, so we can reload when
				// the player dies.
				this.currentLevel = data;

				// Call the parent implemenation; this creates the background
				// maps and entities.
				this.parent(data);
			}
		});

		ig.main("#canvas", MyGame, 60, 1194, 834, 1);
	});
