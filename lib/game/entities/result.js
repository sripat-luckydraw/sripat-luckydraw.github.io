ig.module("game.entities.result")
	.requires("impact.entity")
	.defines(function() {
		EntityResult = ig.Entity.extend({
			zIndex: 500,

			sprite: new ig.Image("media/graphics/bg-result-wide.png"),
			sprite_title: new ig.Image("media/graphics/bg-result-title.png"),

			lists: [],

			list_height: 88,

			textPos: [14, 100, 550, 850, 981],

			updateData: function(data) {
				for (const key in this.lists) {
					if (this.lists.hasOwnProperty(key)) {
						const element = this.lists[key];
						element.kill();
					}
				}

				this.total_height = data.length * this.list_height;

				for (const key in data) {
					if (data.hasOwnProperty(key)) {
						const element = data[key];
						this.lists.push(
							ig.game.spawnEntity(EntityList, this.pos.x, this.pos.y + 55 + this.list_height * key, {
								index: Number(key) + 1,
								name: element[0],
								status: element[1],
								department: element[2],
								reward: element[3],
								time: element[4],
								textPos: this.textPos,
								rect: {
									x: this.pos.x + 5,
									y: this.pos.y + 55 - 5,
									w: this.sprite.width - 10,
									h: this.sprite.height - 55
								}
							})
						);
					}
				}
			},

			deltaPos: {},

			pointer_old: { x: 0, y: 0, isPressed: false },

			init: function(x, y, settings) {
				this.parent(x, y, settings);

				this.sprite.x = x;
				this.sprite.y = y;
			},
			update: function() {
				if (ig.game.controller.state != ig.game.controller.states.RESULT) {
					return;
				}

				this.isScrollmove = ig.game.controller.isScrollmove;

				this.parent();

				if (
					ig.game.pointer.pos.x < this.pos.x + this.sprite.width &&
					ig.game.pointer.pos.x > this.pos.x &&
					ig.game.pointer.pos.y < this.pos.y + this.sprite.height &&
					ig.game.pointer.pos.y > this.pos.y
				) {
					if (ig.game.pointer.isFirstPressed) {
						this.deltaPos.x = ig.game.pointer.pos.x - this.pos.x;
						this.deltaPos.y = ig.game.pointer.pos.y - this.pos.y;
						this.isScrolling = true;
					}

					if (ig.game.pointer.isPressed && this.isScrolling && this.isScrollmove) {
						for (var key in this.lists) {
							if (this.lists.hasOwnProperty(key)) {
								var card = this.lists[key];
								card.pos.y = card._POS.y + ig.game.pointer.pos.y - this.deltaPos.y;
							}
						}
					}
					if (
						!ig.game.pointer.isPressed &&
						this.pointer_old.isPressed &&
						this.isScrolling &&
						this.isScrollmove
					) {
						this.isScrollmove = false;
						this.isScrolling = false;

						for (var key in this.lists) {
							if (this.lists.hasOwnProperty(key)) {
								var card = this.lists[key];

								card.pos.y = card.pos.y.limit(
									card.origin.y - this.total_height + this.sprite.height - 88,
									card.origin.y
								);

								card._POS.x = card.pos.x - this.pos.x;
								card._POS.y = card.pos.y - this.pos.y;
							}
						}
					}
				} else if (this.isScrolling) {
					this.isScrollmove = false;
					this.isScrolling = false;

					for (var key in this.lists) {
						if (this.lists.hasOwnProperty(key)) {
							var card = this.lists[key];

							card.pos.y = card.pos.y.limit(
								card.origin.y - this.total_height + this.sprite.height - 88,
								card.origin.y
							);

							card._POS.x = card.pos.x - this.pos.x;
							card._POS.y = card.pos.y - this.pos.y;
						}
					}
				}

				this.pointer_old.x = ig.game.pointer.pos.x;
				this.pointer_old.y = ig.game.pointer.pos.y;
				this.pointer_old.isPressed = ig.game.pointer.isPressed;
			},
			draw: function() {
				if (ig.game.controller.state != ig.game.controller.states.RESULT) {
					return;
				}
				this.parent();

				this.sprite.draw(this.pos.x, this.pos.y);
				this.sprite_title.draw(this.pos.x + 6, this.pos.y);

				var ctx = ig.system.context;

				ctx.font = "30px DBHeaventRounded";
				ctx.textAlign = "left";
				ctx.textBaseline = "alphabetic";
				ctx.fillStyle = "#2F353A";
				ctx.fillText(
					//	"รอบที่" + (this.round == "round1" ? "1" : "2"),
					"รายชื่อผู้ได้รับรางวัล",
					this.pos.x + this.textPos[0],
					this.pos.y - 20
				);
				ctx.fillText("ลำดับ", this.pos.x + this.textPos[0], this.pos.y + 35);
				ctx.fillText("รายชื่อ", this.pos.x + this.textPos[1], this.pos.y + 35);
				ctx.fillText("แผนก", this.pos.x + this.textPos[2], this.pos.y + 35);
				ctx.fillText("ได้รางวัล", this.pos.x + this.textPos[3], this.pos.y + 35);
				ctx.fillText("เวลา", this.pos.x + this.textPos[4], this.pos.y + 35);
			}
		});
		EntityList = ig.Entity.extend({
			isOdd: false,

			name: "",

			department: "",

			time: "",

			origin: {},
			_POS: {},

			init: function(x, y, settings) {
				this.parent(x, y, settings);

				this.origin.x = x;
				this.origin.y = y;

				this._POS.x = x - this.rect.x;
				this._POS.y = y - this.rect.y + 88;
			},
			update: function() {
				this.parent();
			},
			draw: function() {
				if (ig.game.controller.state != ig.game.controller.states.RESULT) {
					return;
				}
				this.parent();
				var ctx = ig.system.context;

				ctx.save();

				ctx.beginPath();
				ctx.rect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
				ctx.clip();
				ctx.closePath();

				if (this.index % 2 == 0) {
					ctx.fillStyle = "#EFEFF4";
				} else {
					ctx.fillStyle = "#fff";
				}

				ctx.fillRect(this.pos.x, this.pos.y, 1088, 88);

				ctx.font = "24px DBHeaventRounded";
				ctx.textAlign = "left";
				ctx.textBaseline = "alphabetic";
				ctx.fillStyle = "#2F353A";
				ctx.fillText(this.index, this.pos.x + this.textPos[0], this.pos.y + 50);
				ctx.fillText(this.name, this.pos.x + this.textPos[1], this.pos.y + 50);
				ctx.fillText(this.department, this.pos.x + this.textPos[2], this.pos.y + 50);
				ctx.fillText(this.reward, this.pos.x + this.textPos[3], this.pos.y + 50);
				ctx.fillText(this.time, this.pos.x + this.textPos[4], this.pos.y + 50);

				ctx.fillStyle = "#15AC9A";
				ctx.fillText(
					"  "+this.status,
					this.pos.x + this.textPos[1] + ctx.measureText(this.name).width,
					this.pos.y + 50
				);

				ctx.restore();
			}
		});
	});
