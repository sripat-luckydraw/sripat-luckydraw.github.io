ig.module("game.entities.menu-controller")
	.requires("impact.entity", "game.entities.button")
	.defines(function() {
		EntityMenuController = ig.Entity.extend({
			name: "URL",

			logo: new ig.Image("media/graphics/logo-s.png"),

			logo_title: new ig.Image("media/graphics/logo-title.png"),

			urlPos: {
				x: 312,
				y: 448
			},

			submitPos: {
				x: 537,
				y: 512
			},

			init: function(x, y, settings) {
				this.parent(x, y, settings);

				ig.game.pointer = ig.game.spawnEntity(EntityPointer, 0, 0);

				ig.game.controller = this;


				this.createSubmitBtn();

				this.createInputField();


				var boxName = this.name + "Box";
				var box = $("#" + boxName);
				box.val(
					"https://docs.google.com/spreadsheets/d/1NS188WTu_VmLAj4V5Y1LcRai5iGXkHHNKvC1Zc_OosE/edit#gid=0"
				);

				this.btn_import = ig.game.spawnEntity(EntityButton, 537, 512, {
					//onClicked: function() {
					//	// gapi.auth2.getAuthInstance().signIn();
					//
					//}.bind(this)
				});

				this.logged = "v.06";
			},
			update: function() {
				this.parent();
			},
			draw: function() {
				this.parent();

				var ctx = ig.system.context;

				ctx.fillStyle = "#15AC9A";
				ctx.fillRect(0, 0, ig.system.width, ig.system.height);

				this.logo.draw(
					ig.system.width / 2 - this.logo.width / 2, //
					200
				);

				this.logo_title.draw(
					ig.system.width / 2 - this.logo_title.width / 2, //
					351
				);

				ctx.font = "20px Kanit";
				ctx.textAlign = "left";
				ctx.textBaseline = "bottom";
				ctx.fillStyle = "#fff";
				ctx.fillText(this.logged, 0, ig.system.height);
			},

			auth: function() {
				gapi.auth2
					.getAuthInstance()
					.signIn()
					.then(
						function name() {
							this.logged = "success";
							this.processData();
						}.bind(this),
						function name(error) {
							this.logged = "error";
							console.log("error");
						}.bind(this)
					);
			},

			processData: function() {
				//process data to JSON

				var boxName = this.name + "Box";
				var box = $("#" + boxName);

				var url = box.val();
				// var url = "https://docs.google.com/spreadsheets/d/1NS188WTu_VmLAj4V5Y1LcRai5iGXkHHNKvC1Zc_OosE/edit";

				if (!url.includes("https://docs.google.com/spreadsheets/d/")) {
					console.log("invalid URL");
					this.logged = "invalid URL";
					return;
				} else {
					var key = url.split("https://docs.google.com/spreadsheets/d/")[1].split("/")[0];
				}

				ig.game.data = [];

				gapi.client.sheets.spreadsheets.values
					.get({
						spreadsheetId: key,
						range: "Name!A1:E"
					})
					.then(
						function(response) {
							var range = response.result;
							if (range.values.length > 0) {
								console.log("data found");
								for (i = 0; i < range.values.length; i++) {
									var row = range.values[i];
									ig.game.data.push({
										name: row[0],
										status: row[1]
									});
								}
								//console.log(ig.game.data);
								window.localStorage.setItem("data", JSON.stringify(ig.game.data));

								var boxName = this.name + "Box";
								var box = $("#" + boxName);

								box.css({
									display: "none"
								});

								ig.game.loadLevel(LevelGame);
							} else {
								console.log("no data found");
								this.logged = "no data found";
							}
						}.bind(this),
						function(response) {
							//appendPre("Error: " + response.result.error.message);

							console.log("cannot recieve data");
							this.logged = "cannot recieve data";
						}
					);
			},

			createSubmitBtn: function() {
				var btnName = this.name + "Btn";
				var btn = $("#" + btnName);
				//if (box) {
				//	return;
				//}
				btn = $("<div>");
				btn.attr("id", btnName);
				$("body").append(btn);

				// btn.attr("onclick", "handleAuthClick();");
				btn.attr("onclick", "ig.game.controller.auth()");

				this.submitSize = {
					x: 120,
					y: 40
				};
				this.submitBorderRadius = 30;

				btn.css({
					position: "absolute",
					left: "0px",
					top: "0px",
					width: "100px",
					height: "100px"
				});
			},

			createInputField: function() {
				var boxName = this.name + "Box";
				var box = $("#" + boxName);
				//if (box) {
				//	return;
				//}
				box = $("<input>");
				box.attr("id", boxName);
				$("body").append(box);
				box.attr("type", "text");
				box.attr("placeholder", "กรอก Link สำหรับนำเข้ารายชื่อ");
				box.attr("maxLength", "300");

				this.padding = 10;
				this.fontSize = 24;
				this.borderRadius = 6;

				this.boxWidth = 569;

				if (ig.ua.mobile) {
					box.attr("onfocus", "if(ig.game.homecontrol)ig.game.homecontrol.inputFocus();");
					box.attr("onblur", "if(ig.game.homecontrol)ig.game.homecontrol.inputBlur();");
				}
				box.css({
					position: "absolute",
					// left: "312px",
					// top: "448px",
					// width: "569px",
					// height: "48px",
					margin: "0",
					padding: this.padding + "px",
					background: "#fff",
					border: "none",
					textAlign: "center",
					//alignItems: "center",
					outline: "none",
					zIndex: 2000,
					fontFamily: "Kanit",
					// color: "#C8C7CC",
					color: "#000",
					borderRadius: this.borderRadius + "px",
					fontSize: this.fontSize + "px",
					boxSizing: "border-box"
					//border: "4px solid #0eb9f6"
				});
				this.updateSizePos();

				if (ig.ua.mobile) {
					box.keypress(function(e) {
						if (e.keyCode == 13) {
							$(this).blur();
						}
					});
				}

				window.addEventListener("resize", this.updateSizePos.bind(this));
			},

			updateSizePos: function() {
				var boxName = this.name + "Box";
				var box = $("#" + boxName);

				var btnName = this.name + "Btn";
				var btn = $("#" + btnName);

				if (ig.ua.mobile) {
					box.css({
						width: this.boxWidth * ig.game.sizeRatio.x + "px",
						left: this.urlPos.x * ig.game.sizeRatio.x + "px",
						top: this.urlPos.y * ig.game.sizeRatio.y + "px",
						fontSize: Math.floor(this.fontSize * ig.game.sizeRatio.y) + "px",
						padding: Math.floor(this.padding * ig.game.sizeRatio.y) + "px",
						borderRadius: Math.floor(this.borderRadius * ig.game.sizeRatio.y) + "px"
					});

					btn.css({
						width: this.submitSize.x * ig.game.sizeRatio.x + "px",
						height: this.submitSize.y * ig.game.sizeRatio.x + "px",
						left: this.submitPos.x * ig.game.sizeRatio.x + "px",
						top: this.submitPos.y * ig.game.sizeRatio.y + "px",
						borderRadius: Math.floor(this.submitBorderRadius * ig.game.sizeRatio.y) + "px"
					});
				} else {
					var canvas = $("#canvas");
					var offsets = canvas.offset();
					var offsetLeft = offsets.left;
					var offsetTop = offsets.top;

					//console.log(this.boxWidth * ig.game.sizeRatio.x );

					box.css({
						width: this.boxWidth * ig.game.sizeRatio.x + "px",
						left: offsetLeft + this.urlPos.x * ig.game.sizeRatio.x + "px",
						top: offsetTop + this.urlPos.y * ig.game.sizeRatio.y + "px",
						fontSize: Math.floor(this.fontSize * ig.game.sizeRatio.y) + "px",
						padding: Math.floor(this.padding * ig.game.sizeRatio.y) + "px",
						borderRadius: Math.floor(this.borderRadius * ig.game.sizeRatio.y) + "px"
					});
					btn.css({
						width: this.submitSize.x * ig.game.sizeRatio.x + "px",
						height: this.submitSize.y * ig.game.sizeRatio.x + "px",
						left: offsetLeft + this.submitPos.x * ig.game.sizeRatio.x + "px",
						top: offsetTop + this.submitPos.y * ig.game.sizeRatio.y + "px",
						borderRadius: Math.floor(this.submitBorderRadius * ig.game.sizeRatio.y) + "px"
					});
				}
			}
		});
	});
