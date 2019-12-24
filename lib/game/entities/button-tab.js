ig.module("game.entities.button-tab")
	.requires("impact.entity")
	.defines(function() {
		EntityButtonTab = ig.Entity.extend({
			zIndex: 200,
			type: ig.Entity.TYPE.B,
			gravityFactor: 0,
			alpha: 1,
			offset: { x: 0, y: 0 },
			scale: { x: 1, y: 1 },
			anchor: { x: 0.5, y: 0.5 },

			enabled: true,
			isclick: false,
			shown: true,

			selected: false,

			index: "left",

			init: function(x, y, settings) {
				this.parent(x, y, settings);

				switch (this.index) {
					case "left":
						this.pos.x = 416;
						break;
					case "center":
						this.pos.x = 536;
						break;
					case "right":
						this.pos.x = 656;
						break;
				}

				this.pos.y = 32;

				this.size.x = 121;
				this.size.y = 41;
				ig.game.sortEntitiesDeferred();
			},

			update: function() {
				this.parent();
			},

			draw: function() {
				// if (!this.shown) return;
				var ctx = ig.system.context;
				this.parent();

				var textColor = "";

				if (this.selected) {
					ctx.fillStyle = "#fff";
					textColor = "#5748BB";
				} else {
					ctx.fillStyle = "#5748BB";
					textColor = "#fff";
				}

				ctx.font = "24px DBHeaventRounded";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";

				switch (this.index) {
					case "left":
						this.roundRect(
							ctx,
							416,
							32,
							121,
							41,
							{
								tl: 8, //
								tr: 0,
								br: 0,
								bl: 0
							},
							true,
							false
						);

						ctx.fillStyle = textColor;
						ctx.fillText("รอบที่1", 416 + 121 / 2, 32 + 41 / 2);

						break;
					case "center":
						this.roundRect(
							ctx,
							536,
							32,
							121,
							41,
							{
								tl: 0, //
								tr: 0,
								br: 0,
								bl: 0
							},
							true,
							false
						);
						ctx.fillStyle = textColor;
						ctx.fillText("รอบที่2", 536 + 121 / 2, 32 + 41 / 2);
						break;
					case "right":
						this.roundRect(
							ctx,
							656,
							32,
							121,
							41,
							{
								tl: 0, //
								tr: 8,
								br: 0,
								bl: 0
							},
							true,
							false
						);
						ctx.fillStyle = textColor;
						ctx.fillText("ผู้ได้รางวัล", 656 + 121 / 2, 32 + 41 / 2);
						break;
				}
			},

			roundRect: function(ctx, x, y, width, height, radius, fill, stroke) {
				if (typeof stroke === "undefined") {
					stroke = true;
				}
				if (typeof radius === "undefined") {
					radius = 5;
				}
				if (typeof radius === "number") {
					radius = { tl: radius, tr: radius, br: radius, bl: radius };
				} else {
					var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
					for (var side in defaultRadius) {
						radius[side] = radius[side] || defaultRadius[side];
					}
				}
				ctx.beginPath();
				ctx.moveTo(x + radius.tl, y);
				ctx.lineTo(x + width - radius.tr, y);
				ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
				ctx.lineTo(x + width, y + height - radius.br);
				ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
				ctx.lineTo(x + radius.bl, y + height);
				ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
				ctx.lineTo(x, y + radius.tl);
				ctx.quadraticCurveTo(x, y, x + radius.tl, y);
				ctx.closePath();
				if (fill) {
					ctx.fill();
				}
				if (stroke) {
					ctx.stroke();
				}
			},

			clicked: function() {
				if (!this.enabled) return;
				this.isclick = true;

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
