ig.module("game.entities.game-controller")
	.requires("impact.entity", "game.entities.button", "game.entities.card-s")
	.defines(function() {
		EntityGameController = ig.Entity.extend({
			bg_content: new ig.Image("media/graphics/bg-content.png"),

			btn_filp_src: new ig.Image("media/graphics/btn-filp.png"),
			btn_shuffle_src: new ig.Image("media/graphics/btn-shuffle.png"),

			cards: [],

			isScrolling: false,

			mockup: new ig.Image("media/graphics/mockup_1.png"),

			init: function(x, y, settings) {
				this.parent(x, y, settings);

				ig.game.pointer = ig.game.spawnEntity(EntityPointer, 0, 0);

				ig.game.controller = this;

				ig.game.data = JSON.parse(window.localStorage.getItem("data"));

				ig.game.data_attended = [];
				ig.game.data_unattended = [];

				for (const key in ig.game.data) {
					if (ig.game.data.hasOwnProperty(key)) {
						const element = ig.game.data[key];
						if (element.status != "ไม่มา") {
							ig.game.data_attended.push(element);
						} else {
							ig.game.data_unattended.push(element);
						}
					}
				}

				console.log(
					" " +
						ig.game.data.length +
						" " +
						ig.game.data_attended.length +
						" " +
						ig.game.data_unattended.length
				);

				this.bg_content.x = ig.system.width / 2 - this.bg_content.width / 2;
				this.bg_content.y = 72;

				var drawpos = {
					x: ig.system.width / 2 - this.bg_content.width / 2,
					y: 72
				};

				this.row_max = 5;
				this.col_max = (ig.game.data_attended.length / this.row_max).ceil();

				this.col_width = 168 + 8;
				this.row_height = 120 + 8;

				var col = 0;
				var row = 0;

				var offset = {
					x: 16,
					y: 16
				};

				for (var i = 0; i < ig.game.data_attended.length; i++) {
					var data = ig.game.data_attended[i];

					if (col == this.col_max) {
						row++;
						col -= this.col_max;
					}

					var card = ig.game.spawnEntity(
						EntityCardS,
						drawpos.x + offset.x + col * this.col_width,
						drawpos.y + offset.y + row * this.row_height,
						{
							name: data.name,
							status: data.status
						}
					);

					this.cards.push(card);
					col++;
				}

				this.btn_filp = ig.game.spawnEntity(EntityButton, 454, 736, {
					sprite: this.btn_filp_src,
					onClicked: function() {
						for (const key in this.cards) {
							if (ig.game.data.hasOwnProperty(key)) {
								const card = this.cards[key];
								card.show(key * 0.001);
							}
						}
					}.bind(this)
				});

				this.btn_shuffle = ig.game.spawnEntity(EntityButton, 605, 736, {
					sprite: this.btn_shuffle_src,
					onClicked: function() {}.bind(this)
				});
			},

			deltaPos: { x: 0, y: 0 },

			update: function() {
				this.parent();

				if (
					ig.game.pointer.pos.x < this.bg_content.x + this.bg_content.width &&
					ig.game.pointer.pos.x > this.bg_content.x &&
					ig.game.pointer.pos.y < this.bg_content.y + this.bg_content.height &&
					ig.game.pointer.pos.y > this.bg_content.y
				) {
					if (ig.game.pointer.isFirstPressed) {
						this.deltaPos.x = ig.game.pointer.pos.x - this.bg_content.x;
						this.deltaPos.y = ig.game.pointer.pos.y - this.bg_content.y;
						this.isScrolling = true;
					}
					if (ig.game.pointer.isPressed && this.isScrolling) {
						for (const key in this.cards) {
							if (ig.game.data.hasOwnProperty(key)) {
								const card = this.cards[key];

								card.pos.x = card._POS.x + ig.game.pointer.pos.x - this.deltaPos.x;
								// card.pos.y = card._POS.y + ig.game.pointer.pos.y - this.deltaPos.y;
							}
						}
					}
					if (!ig.game.pointer.isPressed && this.isScrolling) {
						this.isScrolling = false;

						for (const key in this.cards) {
							if (this.cards.hasOwnProperty(key)) {
								const card = this.cards[key];

								card.pos.x = card.pos.x.limit(
									card.origin.x - this.col_width * this.col_max + this.bg_content.width - 16,
									card.origin.x
								);
								card.pos.y = card.pos.y.limit(
									card.origin.y - this.row_height * this.row_max + this.bg_content.height - 16,
									card.origin.y
								);

								card._POS.x = card.pos.x - this.bg_content.x;
								card._POS.y = card.pos.y - this.bg_content.y;
							}
						}
					}
				} else if (this.isScrolling) {
					this.isScrolling = false;

					for (const key in this.cards) {
						if (this.cards.hasOwnProperty(key)) {
							const card = this.cards[key];

							card.pos.x = card.pos.x.limit(
								card.origin.x - this.col_width * this.col_max + this.bg_content.width - 16,
								card.origin.x
							);
							card.pos.y = card.pos.y.limit(
								card.origin.y - this.row_height * this.row_max + this.bg_content.height - 16,
								card.origin.y
							);

							card._POS.x = card.pos.x - this.bg_content.x;
							card._POS.y = card.pos.y - this.bg_content.y;
						}
					}
				}
			},
			draw: function() {
				this.parent();

				var ctx = ig.system.context;

				ctx.fillStyle = "#F0F3F5";
				ctx.fillRect(0, 0, ig.system.width, ig.system.height);

				this.bg_content.draw(this.bg_content.x, this.bg_content.y);

				//var tempAlpha = ctx.globalAlpha;

				//ctx.globalAlpha = 0.5;
				//
				//this.mockup.draw(0, 0);
				//
				//ctx.globalAlpha = tempAlpha;
			}
		});
	});
