ig.module("game.entities.game-controller")
	.requires(
		"impact.entity",
		"game.entities.button",
		"game.entities.card-s",
		"game.entities.scratchcard",
		"game.entities.button-tab",
		"game.entities.result"
	)
	.defines(function() {
		EntityGameController = ig.Entity.extend({
			bg_content: new ig.Image("media/graphics/bg-content.png"),

			btn_filp_src: new ig.Image("media/graphics/btn-filp.png"),
			btn_shuffle_src: new ig.Image("media/graphics/btn-shuffle.png"),

			cards: {
				round1: [],
				round2: []
			},

			isScrollmove: false,

			mockup: new ig.Image("media/graphics/mockup_1.png"),

			states: {
				SELECT: 0,
				SCRATCH_CARD: 1,
				RESULT: 2
			},
			state: 0,

			btn_tabs: [],

			setState: function(state) {
				this.state = state;

				switch (this.state) {
					case this.states.SELECT:
						this.btn_filp.enabled = true;
						this.btn_shuffle.enabled = true;
						this.btn_filp.shown = true;
						this.btn_shuffle.shown = true;

						break;
					case this.states.SCRATCH_CARD:
						this.btn_filp.enabled = false;
						this.btn_shuffle.enabled = false;

						for (var key in this.cards[this.round]) {
							if (this.cards[this.round].hasOwnProperty(key)) {
								var card = this.cards[this.round][key];
								card.enabled = false;
							}
						}

						var data = ig.game.data_attended[this.round].random();

						this.scratchcard.setData(data);
						this.scratchcard.show(0);

						break;
					case this.states.RESULT:
						this.btn_filp.enabled = false;
						this.btn_shuffle.enabled = false;
						this.btn_filp.shown = false;
						this.btn_shuffle.shown = false;
						this.showResult();
						break;
				}
			},

			rounds: {
				round1: "round1",
				round2: "round2"
			},

			round: 1,

			setRound: function(round) {
				this.round = round;

				this.setState(this.states.SELECT);

				for (const key in this.cards[this.rounds.round1]) {
					if (this.cards[this.rounds.round1].hasOwnProperty(key)) {
						const element = this.cards[this.rounds.round1][key];
						element.quickHide();
					}
				}
				for (const key in this.cards[this.rounds.round2]) {
					if (this.cards[this.rounds.round2].hasOwnProperty(key)) {
						const element = this.cards[this.rounds.round2][key];
						element.quickHide();
					}
				}

				switch (this.state) {
					case this.states.SELECT:
						for (const key in this.cards[this.round]) {
							if (this.cards[this.round].hasOwnProperty(key)) {
								const element = this.cards[this.round][key];
								element.quickShow();
								this.flipped[this.round] = false;
							}
						}
						break;
					case this.states.SCRATCH_CARD:
						break;
				}
			},

			scratchFinished: function(data) {
				var eraseData = null;

				console.log(data);

				for (const key in ig.game.data[this.round]) {
					if (ig.game.data[this.round].hasOwnProperty(key)) {
						const element = ig.game.data[this.round][key];
						if (element.name == data.name) eraseData = element;
					}
				}
				if (eraseData == null) {
					console.log("can't remove name");
					return;
				}

				ig.game.data[this.round].erase(eraseData);
				var card = this.cards[this.round][this.cards[this.round].length - 1];
				this.cards[this.round].erase(card);
				card.kill();
				this.shuffleAll();

				for (var key in this.cards[this.round]) {
					if (this.cards[this.round].hasOwnProperty(key)) {
						var card = this.cards[this.round][key];
						card.enabled = true;
					}
				}

				this.setState(this.states.SELECT);
			},

			setTab: function(index) {
				for (const key in this.btn_tabs) {
					if (this.btn_tabs.hasOwnProperty(key)) {
						const element = this.btn_tabs[key];
						element.selected = false;
					}
				}

				this.btn_tabs[index].selected = true;

				switch (index) {
					case 0:
						this.setRound(this.rounds.round1);
						break;
					case 1:
						this.setRound(this.rounds.round2);
						break;
					case 2:
						this.setState(this.states.RESULT);

						break;
				}
			},

			watchResult: false,

			showResult: function() {
				for (const key in this.cards[this.rounds.round1]) {
					if (this.cards[this.rounds.round1].hasOwnProperty(key)) {
						const element = this.cards[this.rounds.round1][key];
						element.quickHide();
					}
				}
				for (const key in this.cards[this.rounds.round2]) {
					if (this.cards[this.rounds.round2].hasOwnProperty(key)) {
						const element = this.cards[this.rounds.round2][key];
						element.quickHide();
					}
				}

				gapi.client.sheets.spreadsheets.values
					.get({
						spreadsheetId: ig.game.key,
						range: "result1!A1:E999"
					})
					.then(
						function(response) {
							var range = response.result;
							if (range.values.length > 0) {
								var data = [];
								for (i = 0; i < range.values.length; i++) {
									var row = range.values[i];
									data.push(row);
								}
								this.result[this.rounds.round1].updateData(data);
							} else {
								console.log("no data found");
							}
						}.bind(this),
						function(response) {
							console.log("cannot recieve data");
							console.log(response.result.error.message);
						}
					);


					gapi.client.sheets.spreadsheets.values
					.get({
						spreadsheetId: ig.game.key,
						range: "result2!A1:E999"
					})
					.then(
						function(response) {
							var range = response.result;
							if (range.values.length > 0) {
								var data = [];
								for (i = 0; i < range.values.length; i++) {
									var row = range.values[i];
									data.push(row);
								}
								this.result[this.rounds.round2].updateData(data);
							} else {
								console.log("no data found");
							}
						}.bind(this),
						function(response) {
							console.log("cannot recieve data");
							console.log(response.result.error.message);
						}
					);

			},

			flipped: {
				round1: false,
				round2: false
			},

			init: function(x, y, settings) {
				this.parent(x, y, settings);

				ig.game.pointer = ig.game.spawnEntity(EntityPointer, 0, 0);

				ig.game.controller = this;

				ig.game.data = JSON.parse(window.localStorage.getItem("data"));

				// ig.game.data = TEMP_DATA;

				ig.game.data_attended = {
					round1: [],
					round2: []
				};
				ig.game.data_unattended = {
					round1: [],
					round2: []
				};

				for (var key in ig.game.data.round1) {
					if (ig.game.data.round1.hasOwnProperty(key)) {
						var element = ig.game.data.round1[key];
						if (element.status != "ไม่มา") {
							ig.game.data_attended.round1.push(element);
						} else {
							ig.game.data_unattended.round1.push(element);
						}
					}
				}
				for (var key in ig.game.data.round2) {
					if (ig.game.data.round2.hasOwnProperty(key)) {
						var element = ig.game.data.round2[key];
						if (element.status != "ไม่มา") {
							ig.game.data_attended.round2.push(element);
						} else {
							ig.game.data_unattended.round2.push(element);
						}
					}
				}

				this.bg_content.x = ig.system.width / 2 - this.bg_content.width / 2;
				this.bg_content.y = 72;

				var drawpos = {
					x: ig.system.width / 2 - this.bg_content.width / 2,
					y: 72
				};

				this.row_max = 5;
				this.col_max = (ig.game.data_attended.round1.length / this.row_max).ceil();

				this.col_width = 160 + 16;
				this.row_height = 112 + 16;

				var col = 0;
				var row = 0;

				var offset = {
					x: 16,
					y: 16
				};

				for (var i = 0; i < ig.game.data_attended.round1.length; i++) {
					var data = ig.game.data_attended.round1[i];

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
							status: data.status,
							round: this.rounds.round1
						}
					);

					card.onReleased = function() {
						//this.hide(0);
						ig.game.controller.setState(ig.game.controller.states.SCRATCH_CARD);
					}.bind(card);

					this.cards[this.rounds.round1].push(card);
					col++;
				}

				var col = 0;
				var row = 0;

				for (var i = 0; i < ig.game.data_attended.round2.length; i++) {
					var data = ig.game.data_attended.round2[i];

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
							status: data.status,
							round: this.rounds.round2
						}
					);

					card.onReleased = function() {
						//this.hide(0);
						ig.game.controller.setState(ig.game.controller.states.SCRATCH_CARD);
					}.bind(card);

					this.cards[this.rounds.round2].push(card);
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

				this.btn_tabs.push(
					ig.game.spawnEntity(EntityButtonTab, 0, 0, {
						sprite: this.btn_shuffle_src,
						index: "left",
						onClicked: function() {
							this.setTab(0);
						}.bind(this)
					})
				);
				this.btn_tabs.push(
					ig.game.spawnEntity(EntityButtonTab, 0, 0, {
						sprite: this.btn_shuffle_src,
						index: "center",
						onClicked: function() {
							this.setTab(1);
						}.bind(this)
					})
				);
				this.btn_tabs.push(
					ig.game.spawnEntity(EntityButtonTab, 0, 0, {
						sprite: this.btn_shuffle_src,
						index: "right",
						onClicked: function() {
							this.setTab(2);
						}.bind(this)
					})
				);

				this.result = {};

				this.result[this.rounds.round1] = ig.game.spawnEntity(EntityResult, 57, 129, {
					round: this.rounds.round1
				});
				this.result[this.rounds.round2] = ig.game.spawnEntity(EntityResult, 609, 129, {
					round: this.rounds.round2
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

				this.setState(this.states.SELECT);
				this.setRound(this.rounds.round1);
				this.setTab(0);
			},

			filpAll: function() {
				if (this.flipped[this.round]) return;
				//if (this.state != this.states.SELECT) return;
				this.flipped[this.round] = true;
				for (var key in this.cards[this.round]) {
					if (this.cards[this.round].hasOwnProperty(key)) {
						var card = this.cards[this.round][key];
						card.flipdown(key * 0.001);
					}
				}
			},

			shuffleAll: function() {
				if (!this.flipped[this.round]) return;

				//if (this.state != this.states.SELECT) return;

				var shuffleList = [];
				var shufflePos = [];

				for (var key in this.cards[this.round]) {
					if (this.cards[this.round].hasOwnProperty(key)) {
						var card = this.cards[this.round][key];
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

				for (var key in this.cards[this.round]) {
					if (this.cards[this.round].hasOwnProperty(key)) {
						var card = this.cards[this.round][key];
						card.enabled = true;
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
								for (var key in this.cards[this.round]) {
									if (this.cards[this.round].hasOwnProperty(key)) {
										var card = this.cards[this.round][key];
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

								for (var key in this.cards[this.round]) {
									if (this.cards[this.round].hasOwnProperty(key)) {
										var card = this.cards[this.round][key];

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
							for (var key in this.cards[this.round]) {
								if (this.cards[this.round].hasOwnProperty(key)) {
									var card = this.cards[this.round][key];

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
