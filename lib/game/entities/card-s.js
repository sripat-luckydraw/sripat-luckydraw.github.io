ig.module("game.entities.card-s")
	.requires("impact.entity")
	.defines(function() {
		EntityCardS = ig.Entity.extend({
			zIndex: 200,
			type: ig.Entity.TYPE.B,
			gravityFactor: 0,
			alpha: 1,
			offset: { x: 0, y: 0 },
			scale: { x: 1, y: 1 },
			anchor: { x: 0.5, y: 0.5 },

			sprite: new ig.Image("media/graphics/card-front.png"),
			sprite_back: new ig.Image("media/graphics/card-back.png"),

			sprite_shadow: new ig.Image("media/graphics/card-shadow.png"),

			enabled: true,
			isclick: false,
			shown: true,

			name: "",
			status: "",

			_POS: {},

			origin: {},

			flipped: false,

			swapped: false,

			tempPos: {},

			clickPos: {},

			goTo: function(x, y) {
				if (this.goTo_tween && !this.goTo_tween.complete) return;
				this.tempPos = ig.copy(this.pos);
				this.goTo_tween = this.tween({ pos: { x: x, y: y } }, 0.5, {
					easing: ig.Tween.Easing.Circular.EaseInOut,
					onComplete: function() {
						this.pos = ig.copy(this.tempPos);
					}.bind(this)
				});
				this.goTo_tween.start();
			},

			init: function(x, y, settings) {
				this.parent(x, y, settings);
				this.size.x = this.sprite.width;
				this.size.y = this.sprite.height;

				this.origin.x = x;
				this.origin.y = y;

				this._POS.x = x - ig.game.controller.bg_content.x;
				this._POS.y = y - ig.game.controller.bg_content.y;

				ig.game.sortEntitiesDeferred();

				this.enabled = false;
			},

			update: function() {
				//if (
				//	!(
				//		this.pos.x < ig.game.controller.bg_content.x + ig.game.controller.bg_content.width &&
				//		this.pos.x + this.size.x > ig.game.controller.bg_content.x &&
				//		this.pos.y < ig.game.controller.bg_content.y + ig.game.controller.bg_content.height &&
				//		this.pos.y + this.size.y > ig.game.controller.bg_content.y
				//	)
				//) {
				//	return;
				//}

				if (ig.game.controller.round != this.round) {
					return;
				}


				this.parent();
			},

			draw: function() {
				// if (!this.shown) return;

				if (
					!(
						this.pos.x < ig.game.controller.bg_content.x + ig.game.controller.bg_content.width &&
						this.pos.x + this.size.x > ig.game.controller.bg_content.x &&
						this.pos.y < ig.game.controller.bg_content.y + ig.game.controller.bg_content.height &&
						this.pos.y + this.size.y > ig.game.controller.bg_content.y
					)
				) {
					this.rendered = false;
					return;
				} else {
					this.rendered = true;
				}

				this.parent();

				var ctx = ig.system.context;

				var offset = {
					x: 5,
					y: 5
				};

				ctx.save();
				ctx.beginPath();
				ctx.rect(
					ig.game.controller.bg_content.x + offset.x, //
					0, // ig.game.controller.bg_content.y + offset.y, //
					ig.game.controller.bg_content.width - offset.x * 2, //
					ig.system.height // ig.game.controller.bg_content.height - offset.y * 2 //
				);
				ctx.closePath();
				ctx.clip();

				ctx.translate(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);

				ctx.scale(this.tween_value.map(0, 1, 1, 0), 1);

				this.sprite_shadow.draw(-this.sprite_shadow.width / 2, -this.size.y / 2);

				if (!this.flipped) {
					this.sprite.draw(-this.size.x / 2, -this.size.y / 2 - 50 * this.tween_value);
				} else {
					this.sprite_back.draw(-this.size.x / 2, -this.size.y / 2 - 50 * this.tween_value);
				}

				var names = this.name.split(" ");

				if (!this.flipped) {
					var centerPos = {
						x: 0,
						y: -50 * this.tween_value
					};

					ctx.font = "32px DBHeaventRounded";
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillStyle = "#2C3E50";

					if (this.status == "มา") {
						ctx.fillText(names[0], centerPos.x, centerPos.y - 20);
						ctx.fillText(names[2], centerPos.x, centerPos.y + 20);
					} else if (this.status == "เข้าเวร") {
						ctx.fillText(names[0], centerPos.x, centerPos.y - 30);
						ctx.fillText(names[2], centerPos.x, centerPos.y);
						ctx.fillStyle = "#15AC9A";
						ctx.fillText("(เข้าเวร)", centerPos.x, centerPos.y + 30);
					}
				}
				ctx.restore();
			},

			set_POS: function(x, y) {
				// this.pos.x = this._POS.x = x.limit(this.min.x, this.max.x);
				// this.pos.y = this._POS.y = y.limit(this.min.y, this.max.y);
			},

			tween_value: 0,

			flipdown_tween: null,
			flipdown: function(delay) {
				this.tween_value = 0;
				this.flipdown_tween = this.tween({ tween_value: 1 }, 0.25, {
					easing: ig.Tween.Easing.Circular.EaseIn,
					delay: delay ? delay : 0,
					onComplete: function() {
						//tick:
						this.flipped = true;
						this.flipdown_tween = this.tween({ tween_value: 0 }, 0.25, {
							easing: ig.Tween.Easing.Circular.EaseOut,
							onComplete: function() {
								//this.enabled = true;
								this.onFlipped();
							}.bind(this)
						}).start();
					}.bind(this)
				}).start();
			},

			onFlipped: function() {},

			show_tween: null,
			hide_tween: null,

			show: function(delay) {
				this.tween_value = 1;
				this.show_tween = this.tween({ tween_value: 0 }, 0.5, {
					easing: ig.Tween.Easing.Circular.EaseIn,
					delay: delay ? delay : 0,
					onComplete: function() {
						this.onShown();
					}.bind(this)
				}).start();
			},
			hide: function(delay) {
				this.enabled = false;
				this.tween_value = 0;
				this.hide_tween = this.tween({ tween_value: 1 }, 0.25, {
					easing: ig.Tween.Easing.Circular.EaseIn,
					delay: delay ? delay : 0,
					onUpdate: function() {}.bind(this),
					onComplete: function() {
						this.shown = false;
						this.onHidden();
					}.bind(this)
				});

				this.hide_tween.start();
			},

			quickHide: function() {
				this.enabled = false;
				this.shown = false;
				this.flipped = false;
				this.tween_value = 1;
			},
			quickShow: function() {
				this.enabled = false;
				this.shown = true;
				this.flipped = false;
				this.tween_value = 0;
			},

			onShown: function() {},
			onHidden: function() {},

			click_tween: null,
			click_value: 0,
			clicked: function() {
				if (!this.enabled) return;
				this.isclick = true;

				this.clickPos = ig.copy(this.pos);

				// this.click_value = 0;
				// this.click_tween = this.tween({ tween_value: 1.25 }, 0.1, {
				// 	//easing: ig.Tween.Easing.Back.EaseIn,
				// 	loop: ig.Tween.Loop.Reverse,
				// 	loopCount: 1,
				// 	onUpdate: function() {}.bind(this),
				// 	onComplete: function() {}.bind(this)
				// });
				// this.click_tween.start();
				this.onClicked();
			},
			clicking: function() {
				if (!this.isclick) return;
				this.onClicking();
			},
			released: function() {
				if (!this.isclick) return;
				if (this.clickPos.x != this.pos.x || this.clickPos.y != this.pos.y) {
					return;
				}
				this.releasedOutside();
				if (!this.enabled) return;
				this.onReleased();
			},
			releasedOutside: function() {
				this.isclick = false;
				this.onReleasedOutside();
			},

			leave: function() {},

			over: function() {},

			onClicked: function() {},
			onClicking: function() {},
			onReleased: function() {},
			onReleasedOutside: function() {}
		});
	});
