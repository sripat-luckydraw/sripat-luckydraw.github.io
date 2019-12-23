ig.module("game.entities.button")
	.requires("impact.entity")
	.defines(function() {
		EntityButton = ig.Entity.extend({
			zIndex: 200,
			type: ig.Entity.TYPE.B,
			gravityFactor: 0,
			alpha: 1,
			offset: { x: 0, y: 0 },
			scale: { x: 1, y: 1 },
			anchor: { x: 0.5, y: 0.5 },

			sprite: new ig.Image("media/graphics/btn-import.png"),

			enabled: true,
			isclick: false,
			shown: true,

			init: function(x, y, settings) {
				this.parent(x, y, settings);
				this.size.x = this.sprite.width;
				this.size.y = this.sprite.height;
				ig.game.sortEntitiesDeferred();
			},

			update: function() {
				this.parent();
			},

			draw: function() {
				// if (!this.shown) return;
				var ctx = ig.system.context;
				this.sprite.draw(this.pos.x, this.pos.y);
				this.parent();
			},

			show_tween: null,
			value_tween: null,
			tween_value: 0,
			show: function(delay) {
				this.tween_value = 0;
				this.show_tween = this.tween({ tween_value: 1 }, 0.5, {
					// easing: ig.Tween.Easing.Back.EaseIn,
					delay: delay ? delay : 0,
					onUpdate: function() {}.bind(this),
					onComplete: function() {
						this.shown = true;
						this.enabled = true;
						this.onShown();
					}.bind(this)
				}).start();
			},
			hide: function(delay) {
				this.enabled = false;
				this.tween_value = 1;
				this.hide_tween = this.tween({ tween_value: 0 }, 0.5, {
					// easing: ig.Tween.Easing.Back.EaseIn,
					delay: delay ? delay : 0,
					onUpdate: function() {}.bind(this),
					onComplete: function() {
						this.shown = false;
						this.onHidden();
					}.bind(this)
				}).start();
			},

			onShown: function() {},
			onHidden: function() {},

			click_tween: null,
			click_value: 0,
			clicked: function() {
				if (!this.enabled) return;
				this.isclick = true;

				this.click_value = 0;
				this.click_tween = this.tween({ tween_value: 1.25 }, 0.1, {
					//easing: ig.Tween.Easing.Back.EaseIn,
					loop: ig.Tween.Loop.Reverse,
					loopCount: 1,
					onUpdate: function() {}.bind(this),
					onComplete: function() {}.bind(this)
				});
				this.click_tween.start();
				this.onClicked();
				// ig.soundHandler.sfxPlayer.play("button");
			},
			clicking: function() {
				if (!this.isclick) return;
				this.onClicking();
			},
			released: function() {
				if (!this.isclick) return;
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
