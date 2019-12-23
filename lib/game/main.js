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

				this.eventListenerSetup();
				this.resize();

				this.loadLevel(LevelMenu);
				//this.loadLevel(LevelGame);
			},

			update: function() {
				this.parent();
			},

			draw: function() {
				this.parent();
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

				this.windowSize = {
					x: window.innerWidth, //
					y: window.innerHeight
				};

				this.actualSize = {
					x: window.innerWidth, //
					y: window.innerHeight
				};

				var tempSize = {
					x: this._width, //
					y: this._height
				};

				this.sizeRatioMultiplier = {
					x: this.actualSize.x / tempSize.x,
					y: this.actualSize.y / tempSize.y
				};

				var multiplier = Math.min(this.sizeRatioMultiplier.x, this.sizeRatioMultiplier.y);

				this.actualSize.x = tempSize.x * multiplier;
				this.actualSize.y = tempSize.y * multiplier;

				this.sizeRatioMultiplier.x = multiplier;
				this.sizeRatioMultiplier.y = multiplier;


				var elem = $("canvas");

				if (ig.ua.mobile) {
					var l = Math.floor(this.windowSize.x / 2 - this.actualSize.x / 2);
					var t = Math.floor(this.windowSize.y / 2 - this.actualSize.y / 2);
					if (l < 0) l = 0;
					if (t < 0) t = 0;

					elem.width(Math.floor(ig.sizeHandler.mobile.actualSize.x).toFixed(2));
					elem.height(Math.floor(ig.sizeHandler.mobile.actualSize.y).toFixed(2));
					elem.css("left", l);

					if (window.innerHeight > window.innerWidth) {
						var scaleRatioMultiplier = new Vector2(
							window.innerWidth / this._width,
							window.innerHeight / this._height
						);

						var temp_multiplier = Math.min(scaleRatioMultiplier.x, scaleRatioMultiplier.y);

						var w = this._width * temp_multiplier;
						var h = this._height * temp_multiplier;

						var l = Math.floor(this.windowSize.x / 2 - w / 2);
						var t = Math.floor(this.windowSize.y / 2 - h / 2);
						if (l < 0) l = 0;
						if (t < 0) t = 0;

						elem.width(Math.floor(w));
						elem.height(Math.floor(h));
						elem.css("left", l);
					}
				} else {
					var l = Math.floor(this.windowSize.x / 2 - this.actualSize.x / 2);
					var t = Math.floor(this.windowSize.y / 2 - this.actualSize.y / 2);
					if (l < 0) l = 0;
					if (t < 0) t = 0;

					elem.width(Math.floor(this.actualSize.x));
					elem.height(Math.floor(this.actualSize.y));
					elem.css("left", l);	
				}
			},
			loadLevel: function(data) {
				this.currentLevel = data;
				this.parent(data);
			}
		});

		ig.main("#canvas", MyGame, 60, 1194, 834, 1);
	});
