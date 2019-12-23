ig.module("game.entities.button-auth")
	.requires("impact.entity")
	.defines(function() {
		EntityButtonAuth = ig.Entity.extend({
			init: function(x, y, settings) {
				this.parent(x, y, settings);
				this.createDiv();
			},

			update: function() {
				this.parent();
			},

			draw: function() {
				this.parent();
			},

			createDiv: function() {
				var boxName = this.name + "Btn";
				var box = $("#" + boxName);

				box = $("<div>");
				box.attr("id", boxName);
				$("body").append(box);

				box.css({
					position: "absolute",
					margin: "0"
				});

				box.attr("onclick", this.callback ? this.callback : "");

				this.updateSizePos();

				window.addEventListener("resize", this.updateSizePos.bind(this));
			},
			updateSizePos: function() {
				var boxName = this.name + "Btn";
				var box = $("#" + boxName);

				if (ig.ua.mobile) {
					box.css({
						width: this.width + "px",
						height: this.height + "px",
						left: this.pos.x + "px",
						top: this.pos.y + "px"
					});
				} else {
					var canvas = $("#canvas");
					var offsets = canvas.offset();
					var offsetLeft = offsets.left;
					var offsetTop = offsets.top;

					box.css({
						width: this.width * ig.game.sizeRatioMultiplier.x + "px",
						height: this.height * ig.game.sizeRatioMultiplier.x + "px",
						left: offsetLeft + this.pos.x * ig.game.sizeRatioMultiplier.x + "px",
						top: offsetTop + this.pos.y * ig.game.sizeRatioMultiplier.y + "px"
					});
				}
			}
		});
	});
