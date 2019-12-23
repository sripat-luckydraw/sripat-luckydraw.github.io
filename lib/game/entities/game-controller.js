ig.module("game.entities.game-controller")
	.requires("impact.entity", "game.entities.button", "game.entities.card-s", "game.entities.scratchcard")
	.defines(function() {
		EntityGameController = ig.Entity.extend({
			bg_content: new ig.Image("media/graphics/bg-content.png"),

			btn_filp_src: new ig.Image("media/graphics/btn-filp.png"),
			btn_shuffle_src: new ig.Image("media/graphics/btn-shuffle.png"),

			cards: [],

			isScrollmove: false,

			mockup: new ig.Image("media/graphics/mockup_1.png"),

			states: {
				SELECT: 0,
				SCRATCH_CARD: 1
			},

			state: 0,

			setState: function(state) {
				this.state = state;

				switch (this.state) {
					case this.states.SELECT:
						break;
					case this.states.SCRATCH_CARD:
						for (var key in this.cards) {
							if (this.cards.hasOwnProperty(key)) {
								var card = this.cards[key];
								card.enabled = false;
							}
						}
						this.scratchcard.show();
						break;
				}
			},

			flipped: false,

			init: function(x, y, settings) {
				this.parent(x, y, settings);

				ig.game.pointer = ig.game.spawnEntity(EntityPointer, 0, 0);

				ig.game.controller = this;

				// ig.game.data = JSON.parse(window.localStorage.getItem("data"));

				ig.game.data = TEMP_DATA;

				ig.game.data_attended = [];
				ig.game.data_unattended = [];

				for (var key in ig.game.data) {
					if (ig.game.data.hasOwnProperty(key)) {
						var element = ig.game.data[key];
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

				this.col_width = 160 + 16;
				this.row_height = 112 + 16;

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

					card.onReleased = function() {
						this.hide(0);
						ig.game.controller.setState(ig.game.controller.states.SCRATCH_CARD);
					}.bind(card);

					this.cards.push(card);
					col++;
				}

				this.btn_filp = ig.game.spawnEntity(EntityButton, 454, 736, {
					sprite: this.btn_filp_src,
					onClicked: function() {
						this.filpAll();
					}.bind(this)
				});

				this.btn_shuffle = ig.game.spawnEntity(EntityButton, 605, 736, {
					sprite: this.btn_shuffle_src,
					onClicked: function() {
						this.shuffleAll();
					}.bind(this)
				});

				this.scratchcard = ig.game.spawnEntity(EntityScratchcard, 0, 0, {});

				$(document).on({
					"mousemove": function(e) {
						this.checkScrolling();
					}.bind(this),
					"touchmove": function(e) {
						this.checkScrolling();
					}.bind(this)
				});

				ig.input.bind(ig.KEY.SPACE, "test");
			},

			filpAll: function() {
				if (this.flipped) return;
				this.flipped = true;
				for (var key in this.cards) {
					if (this.cards.hasOwnProperty(key)) {
						var card = this.cards[key];
						card.flipdown(key * 0.001);
					}
				}
			},

			shuffleAll: function() {
				if (!this.flipped) return;

				var shuffleList = [];
				var shufflePos = [];

				for (var key in this.cards) {
					if (this.cards.hasOwnProperty(key)) {
						var card = this.cards[key];
						if (card.rendered) {
							shuffleList.push(card);
							shufflePos.push(card.pos);
						}
					}
				}

				shufflePos = ig.game.helper.shuffleArr(shufflePos);

				for (var key in shuffleList) {
					if (shuffleList.hasOwnProperty(key)) {
						var card = shuffleList[key];
						card.goTo(shufflePos[key].x, shufflePos[key].y);
					}
				}
			},

			deltaPos: { x: 0, y: 0 },

			pointer_old: { x: 0, y: 0, isPressed: false },

			checkScrolling: false,

			checkScrolling: function() {
				if (
					ig.game.pointer.pos.x < this.bg_content.x + this.bg_content.width &&
					ig.game.pointer.pos.x > this.bg_content.x &&
					ig.game.pointer.pos.y < this.bg_content.y + this.bg_content.height - 88 &&
					ig.game.pointer.pos.y > this.bg_content.y
				) {
					this.isScrollmove = true;
				}
			},

			isScrolling: false,

			update: function() {
				this.parent();

				if (ig.input.pressed("test")) {
					// this.shuffleAll();
				}

				switch (this.state) {
					case this.states.SELECT:
						if (
							ig.game.pointer.pos.x < this.bg_content.x + this.bg_content.width &&
							ig.game.pointer.pos.x > this.bg_content.x &&
							ig.game.pointer.pos.y < this.bg_content.y + this.bg_content.height - 88 &&
							ig.game.pointer.pos.y > this.bg_content.y
						) {
							if (ig.game.pointer.isFirstPressed) {
								this.deltaPos.x = ig.game.pointer.pos.x - this.bg_content.x;
								this.deltaPos.y = ig.game.pointer.pos.y - this.bg_content.y;

								this.isScrolling = true;
							}

							if (ig.game.pointer.isPressed && this.isScrolling && this.isScrollmove) {
								for (var key in this.cards) {
									if (this.cards.hasOwnProperty(key)) {
										var card = this.cards[key];
										card.pos.x = card._POS.x + ig.game.pointer.pos.x - this.deltaPos.x;
										// card.pos.y = card._POS.y + ig.game.pointer.pos.y - this.deltaPos.y;
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

								for (var key in this.cards) {
									if (this.cards.hasOwnProperty(key)) {
										var card = this.cards[key];

										card.pos.x = card.pos.x.limit(
											card.origin.x - this.col_width * this.col_max + this.bg_content.width - 16,
											card.origin.x
										);
										card.pos.y = card.pos.y.limit(
											card.origin.y -
												this.row_height * this.row_max +
												this.bg_content.height -
												16,
											card.origin.y
										);
										card._POS.x = card.pos.x - this.bg_content.x;
										card._POS.y = card.pos.y - this.bg_content.y;
									}
								}
							}
						} else if (this.isScrolling) {
							this.isScrollmove = false;
							this.isScrolling = false;
							for (var key in this.cards) {
								if (this.cards.hasOwnProperty(key)) {
									var card = this.cards[key];

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
						break;
					case this.states.SCRATCH_CARD:
						break;
				}

				this.pointer_old.x = ig.game.pointer.pos.x;
				this.pointer_old.y = ig.game.pointer.pos.y;
				this.pointer_old.isPressed = ig.game.pointer.isPressed;
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
