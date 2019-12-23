ig.module("game.entities.input")
	.requires("impact.entity")
	.defines(function() {
		EntityInput = ig.Entity.extend({
			isShown: true,

			init: function(x, y, settings) {
				this.parent(x, y, settings);

				this.createInputField();

				// this.height = 30;
			},
			update: function() {
				this.parent();
			},
			draw: function() {
				this.parent();
			},

			createInputField: function() {
				var boxName = this.name + "Box";
				var box = $("#" + boxName);

				box = $("<input>");
				box.attr("id", boxName);
				$("body").append(box);
				box.attr("type", "text");
				box.attr("placeholder", this.placeholder ? this.placeholder : "");
				box.attr("maxLength", "300");

				if (ig.ua.mobile) {
					//box.attr("onfocus");
					//box.attr("onblur");
				}

				box.css({
					position: "absolute",
					margin: "0",
					background: "#fff",
					border: "none",
					textAlign: "center",
					outline: "none",
					zIndex: 2000,
					fontFamily: "DBHeaventRounded",
					color: "#000",
					boxSizing: "border-box",
					fontSize: Math.floor(this.fontSize) + "px",
					padding: Math.floor(this.padding) + "px",
					borderRadius: Math.floor(this.borderRadius) + "px"
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

				if (ig.ua.mobile) {
					box.css({
						width: this.width + "px",
						left: this.pos.x + "px",
						top: this.pos.y + "px",
						fontSize: Math.floor(this.fontSize) + "px",
						padding: Math.floor(this.padding) + "px",
						borderRadius: Math.floor(this.borderRadius) + "px"
					});
				} else {
					var canvas = $("#canvas");
					var offsets = canvas.offset();
					var offsetLeft = offsets.left;
					var offsetTop = offsets.top;

					box.css({
						width: this.width * ig.game.sizeRatioMultiplier.x + "px",
						left: offsetLeft + this.pos.x * ig.game.sizeRatioMultiplier.x + "px",
						top: offsetTop + this.pos.y * ig.game.sizeRatioMultiplier.y + "px",
						fontSize: Math.floor(this.fontSize * ig.game.sizeRatioMultiplier.y) + "px",
						padding: Math.floor(this.padding * ig.game.sizeRatioMultiplier.y) + "px",
						borderRadius: Math.floor(this.borderRadius * ig.game.sizeRatioMultiplier.y) + "px"
					});
				}
			},

			hide: function() {
				if (!this.isShown) return;
				var boxName = this.name + "Box";
				var box = $("#" + boxName);
				if (box) {
					box.css({
						display: "none"
					});
				}
				this.isShown = false;
			},

			show: function() {
				if (this.isShown) return;
				var boxName = this.name + "Box";
				var box = $("#" + boxName);
				if (box) {
					box.css({
						display: "block"
					});
				}
				this.isShown = true;
			},

			fadeIn: function() {
				if (this.isShown) return;
				var boxName = this.name + "Box";
				var box = $("#" + boxName);
				if (box) {
					box.fadeIn(
						150,
						"linear",
						function() {
							this.isShown = true;
						}.bind(this)
					);
				}
			},

			fadeOut: function() {
				if (!this.isShown) return;
				var boxName = this.name + "Box";
				var box = $("#" + boxName);
				if (box) {
					box.fadeOut(
						150,
						"linear",
						function() {
							this.isShown = false;
						}.bind(this)
					);
				}
			}
		});
	});
