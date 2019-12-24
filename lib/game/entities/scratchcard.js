ig.module("game.entities.scratchcard")
	.requires("impact.entity", "game.entities.input", "game.entities.button")
	.defines(function() {
		EntityScratchcard = ig.Entity.extend({
			zIndex: 500,
			gravityFactor: 0,
			type: ig.Entity.TYPE.B,
			alpha: 1,
			offset: { x: 0, y: 0 },
			scale: { x: 1, y: 1 },
			anchor: { x: 0.5, y: 0.5 },

			sprite: new ig.Image("media/graphics/scratchcard-back.png"),
			sprite_cover: new ig.Image("media/graphics/scratchcard-front.png"),

			confetti: new ig.Image("media/graphics/confetti.png"),

			btn_confirm_src: new ig.Image("media/graphics/btn-confirm.png"),

			enabled: true,
			isclick: false,
			shown: true,

			name: "",
			status: "",

			flipped: false,

			data: {},

			lines: [],
			currentline: [],

			grid_value: [],
			grid_row: 5,
			grid_col: 8,

			scratched: false,

			setData: function(data) {
				this.data = data;
			},

			init: function(x, y, settings) {
				this.parent(x, y, settings);

				this.size.x = this.sprite.width;
				this.size.y = this.sprite.height;

				this.pos.x = ig.system.width / 2 - this.sprite.width / 2;
				this.pos.y = ig.system.height / 2 - this.sprite.height / 2;

				ig.game.sortEntitiesDeferred();

				this.enabled = false;

				this.buffer = document.createElement("canvas");

				this.input = ig.game.spawnEntity(EntityInput, 384, 553, {
					name: "reward",
					padding: 10,
					fontSize: 24,
					borderRadius: 6,
					width: 425,
					placeholder: "กรอกรางวัล"
				});

				this.input.hide();

				this.btn_confirm = ig.game.spawnEntity(EntityButton, 539, 610, {
					zIndex: 501,
					sprite: this.btn_confirm_src,
					shown: false,
					onClicked: function() {
						this.saveData();
					}.bind(this)
				});

				for (var i = 0; i < this.grid_row * this.grid_col; i++) {
					this.grid_value.push(false);
				}

				this.logged = "";

				var emptyArr = [];

				for (let i = 0; i < 999; i++) {
					emptyArr.push(["", "", ""]);
				}

				this.emptyValue = {
					values: emptyArr
				};
			},

			reset: function() {
				this.data = {};
				this.input.val("");
				this.grid_value = [];
				for (var i = 0; i < this.grid_row * this.grid_col; i++) {
					this.grid_value.push(false);
				}

				
			this.lines= []
			this.currentline= []
			this.scratched = false;

				this.logged = "";
			},

			update: function() {
				this.parent();
			},

			draw: function() {
				// if (!this.shown) return;

				this.parent();

				var ctx = ig.system.context;

				ctx.fillStyle = "rgba(0,0,0," + this.tween_value * 0.75 + ")";
				ctx.fillRect(0, 0, ig.system.width, ig.system.height);

				var tween_ease = ig.Tween.Easing.Back.EaseOut(this.tween_value);

				ctx.drawImage(
					this.confetti.data, //
					ig.system.width / 2 -
						this.confetti.width / 2 +
						(this.confetti.width - this.confetti.width * tween_ease) / 2,
					ig.system.height / 2 -
						this.confetti.height / 2 +
						(this.confetti.height - this.confetti.height * tween_ease) / 2,
					this.confetti.width * tween_ease,
					this.confetti.height * tween_ease
				);

				var drawsize = {
					x: this.sprite.width * this.tween_value,
					y: this.sprite.height * this.tween_value
				};

				var drawpos = {
					x: this.pos.x + (this.sprite.width - drawsize.x) / 2,
					y: this.pos.y + (this.sprite.height - drawsize.y) / 2
				};

				ctx.drawImage(this.sprite.data, drawpos.x, drawpos.y, drawsize.x, drawsize.y);

				if (this.enabled) {
					var names = this.data.name.split(" ");
					var centerPos = {
						x: this.pos.x + this.sprite.width / 2,
						y: this.pos.y + this.sprite.height / 2
					};
					ctx.font = "72px DBHeaventRounded";
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillStyle = "#2C3E50";
					ctx.fillText(names[0], centerPos.x, centerPos.y - 40);
					ctx.font = "56px DBHeaventRounded";
					ctx.fillText(names[2], centerPos.x, centerPos.y + 40);

					ctx.font = "30px DBHeaventRounded";
					ctx.fillStyle = "#fff";
					ctx.fillText(this.logged, centerPos.x, centerPos.y + 250);
				}

				if (!this.scratched) {
					this.buffer.width = this.sprite_cover.width;
					this.buffer.height = this.sprite_cover.height;
					var bx = this.buffer.getContext("2d");
					bx.drawImage(this.sprite_cover.data, 0, 0);

					if (this.lines.length > 0) {
						bx.strokeStyle = "#f00";
						bx.lineWidth = 30;
						bx.lineCap = "round";
						bx.lineJoin = "round";
						for (var l in this.lines) {
							if (this.lines.hasOwnProperty(l)) {
								var line = this.lines[l];
								bx.beginPath();
								bx.moveTo(line[0].x - drawpos.x, line[0].y - drawpos.y);
								for (var p in line) {
									if (line.hasOwnProperty(p)) {
										var point = line[p];
										bx.lineTo(point.x - drawpos.x, point.y - drawpos.y);
									}
								}
								bx.globalCompositeOperation = "destination-out";
								bx.stroke();
								bx.closePath();
							}
						}
					}
					ctx.drawImage(this.buffer, drawpos.x, drawpos.y, drawsize.x, drawsize.y);
				}
			},
			tween_value: 0,

			show_tween: null,
			hide_tween: null,

			show: function(delay) {
				this.enabled = false;
				this.tween_value = 0;
				this.show_tween = this.tween({ tween_value: 1 }, 0.5, {
					easing: ig.Tween.Easing.Circular.EaseOut,
					delay: delay ? delay : 0,
					onComplete: function() {
						this.enabled = true;
						this.onShown();
					}.bind(this)
				}).start();

				this.input.show();
				this.input.fadeIn();
			},
			hide: function(delay) {
				this.btn_confirm.hide();

				this.input.hide();

				this.enabled = false;
				this.tween_value = 1;
				this.hide_tween = this.tween({ tween_value: 0 }, 0.25, {
					easing: ig.Tween.Easing.Circular.EaseOut,
					delay: delay ? delay : 0,
					onUpdate: function() {}.bind(this),
					onComplete: function() {
						this.shown = false;
						this.onHidden();
					}.bind(this)
				});

				this.hide_tween.start();
			},

			onShown: function() {},
			onHidden: function() {},

			click_tween: null,
			click_value: 0,
			clicked: function() {
				if (!this.enabled) return;
				this.isclick = true;
				this.onClicked();
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

			onClicked: function() {
				this.currentline = [];
				this.lines.push(this.currentline);
				this.currentline.push(ig.game.pointer.pos);
			},

			onClicking: function() {
				if (ig.game.pointer.pos.x != this.currentline[0].x || ig.game.pointer.pos.y != this.currentline[0].y) {
					this.currentline.push(ig.game.pointer.pos);
				}

				var w = this.sprite_cover.width;
				var h = this.sprite_cover.height;

				var d_w = w / this.grid_col;
				var d_h = h / this.grid_row;

				var indexcount = 0;

				for (var i = 0; i < this.grid_row; i++) {
					for (var j = 0; j < this.grid_col; j++) {
						if (
							ig.game.pointer.pos.x - this.pos.x > j * d_w &&
							ig.game.pointer.pos.x - this.pos.x < j * d_w + d_w &&
							ig.game.pointer.pos.y - this.pos.y > i * d_h &&
							ig.game.pointer.pos.y - this.pos.y < i * d_h + d_h
						) {
							this.grid_value[indexcount] = true;
						}
						indexcount++;
					}
				}

				var touchcount = 0;

				for (var key in this.grid_value) {
					if (this.grid_value.hasOwnProperty(key)) {
						var element = this.grid_value[key];
						if (element) touchcount++;
					}
				}

				if (touchcount / this.grid_value.length >= 0.8 && !this.scratched) {
					this.scratched = true;
					this.btn_confirm.show();
				}
			},

			onReleased: function() {},
			onReleasedOutside: function() {},

			saveData: function() {
				if (this.data.name == "") return;
				if (this.input.val() == "") {
					this.logged = "กรุณากรอกรางวัล";
					return;
				}

				var roundsheet = "";
				var resultkey = "";

				switch (ig.game.controller.round) {
					case ig.game.controller.rounds.round1:
						roundsheet = "result1!A1:C999";
						resultkey = "result1";
						break;
					case ig.game.controller.rounds.round2:
						roundsheet = "result2!A1:C999";
						resultkey = "result2";
				}

				var values = [
					[
						// Cell values ...
						this.data.name,
						this.input.val(),
						Date.now()
					]
					// Additional rows ...
				];

				ig.game.data[resultkey].push(values[0]);

				gapi.client.sheets.spreadsheets.values
					.update({
						spreadsheetId: ig.game.key,
						range: roundsheet,
						valueInputOption: "RAW",
						resource: this.emptyValue
					})
					.then(
						function name(response) {
							gapi.client.sheets.spreadsheets.values
								.update({
									spreadsheetId: ig.game.key,
									range: roundsheet,
									valueInputOption: "RAW",
									resource: body
								})
								.then(
									function name(response) {
										var result = response.result;
										// console.log(`${result.updatedCells} cells updated.`);

										this.hide();
										ig.game.controller.scratchFinished(this.data);
										this.reset();

									}.bind(this),
									function name(response) {
										var result = response.result;
										console.log(response.result.error.message);
										this.logged = "ไม่สามารถบันทึกรางวัลได้ กรุณาลองใหม่อีกครั้ง";
									}
								);
						}.bind(this),
						function name(response) {
							var result = response.result;
							console.log(response.result.error.message);
							this.logged = "ไม่สามารถบันทึกรางวัลได้ กรุณาลองใหม่อีกครั้ง";
						}
					);

				var body = {
					values: ig.game.data[resultkey]
				};
			}
		});
	});
