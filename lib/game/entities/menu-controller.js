ig.module("game.entities.menu-controller")
	.requires("impact.entity", "game.entities.button", "game.entities.input", "game.entities.button-auth")
	.defines(function() {
		EntityMenuController = ig.Entity.extend({
			name: "URL",

			logo: new ig.Image("media/graphics/logo-s.png"),
			logo_title: new ig.Image("media/graphics/logo-title.png"),

			dataFound: [false, false],

			init: function(x, y, settings) {
				this.parent(x, y, settings);

				ig.game.pointer = ig.game.spawnEntity(EntityPointer, 0, 0);

				ig.game.controller = this;

				this.input = ig.game.spawnEntity(EntityInput, 312, 448, {
					name: this.name,
					padding: 10,
					fontSize: 24,
					borderRadius: 6,
					width: 569,
					placeHolder: "กรอก Link สำหรับนำเข้ารายชื่อ"
				});

				this.btn_auth = ig.game.spawnEntity(EntityButtonAuth, 537, 512, {
					name: this.name,
					width: 120,
					height: 40,
					borderRadius: 30,
					callback: "ig.game.controller.auth()"
				});

				// this.createSubmitBtn();
				// this.createInputField();

				var boxName = this.name + "Box";
				var box = $("#" + boxName);
				box.val(
					"https://docs.google.com/spreadsheets/d/1NS188WTu_VmLAj4V5Y1LcRai5iGXkHHNKvC1Zc_OosE/edit#gid=0"
				);

				this.btn_import = ig.game.spawnEntity(EntityButton, 537, 512, {});

				this.logged = "";
				this.vNo = "v.1.1";
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

				ctx.font = "20px DBHeaventRounded";
				ctx.textAlign = "left";
				ctx.textBaseline = "bottom";
				ctx.fillStyle = "#fff";
				ctx.fillText(this.vNo, 0, ig.system.height);

				ctx.font = "30px DBHeaventRounded";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillStyle = "#fff";
				if (this.logged != "") {
					ctx.fillText(this.logged + ". please try again.", ig.system.width / 2, ig.system.height / 2 + 200);
				}
			},

			auth: function() {
				gapi.auth2
					.getAuthInstance()
					.signIn()
					.then(
						function name() {
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
					ig.game.key = url.split("https://docs.google.com/spreadsheets/d/")[1].split("/")[0];
				}

				ig.game.data = {
					round1: [],
					round2: [],
					result1:[],
					result2:[]
				};

				gapi.client.sheets.spreadsheets.values
					.get({
						spreadsheetId: ig.game.key,
						range: "round1!A1:E999"
					})
					.then(
						function(response) {
							var range = response.result;
							if (range.values.length > 0) {
								console.log("data1 found");
								for (i = 0; i < range.values.length; i++) {
									var row = range.values[i];
									ig.game.data.round1.push({
										name: row[0],
										status: row[1]
									});
								}

								this.dataFound[0] = true;
								this.loadComplete();
							} else {
								console.log("no data found");
								this.logged = "no data found";
							}
						}.bind(this),
						function(response) {
							console.log("cannot recieve data");
							console.log(response.result.error.message);
							this.logged = "cannot recieve data";
						}
					);

				gapi.client.sheets.spreadsheets.values
					.get({
						spreadsheetId: ig.game.key,
						range: "round2!A1:E999"
					})
					.then(
						function(response) {
							var range = response.result;
							if (range.values.length > 0) {
								console.log("data2 found");
								for (i = 0; i < range.values.length; i++) {
									var row = range.values[i];
									ig.game.data.round2.push({
										name: row[0],
										status: row[1]
									});
								}
								this.dataFound[1] = true;
								this.loadComplete();
							} else {
								console.log("no data found");
								this.logged = "no data found";
							}
						}.bind(this),
						function(response) {
							console.log("cannot recieve data");
							console.log(response.result.error.message);
							this.logged = "cannot recieve data";
						}
					);
			},
			loadComplete: function() {
				if (!this.dataFound[0] || !this.dataFound[1]) return;
				window.localStorage.setItem("data", JSON.stringify(ig.game.data));

				var boxName = this.name + "Box";
				var box = $("#" + boxName);
				box.css({
					display: "none"
				});

				var boxName = this.name + "Btn";
				var box = $("#" + boxName);
				box.css({
					display: "none"
				});

				ig.game.loadLevel(LevelGame);
			}
		});
	});
