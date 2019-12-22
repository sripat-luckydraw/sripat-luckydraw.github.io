ig.module("game.levels.menu")
	.requires("impact.image", "game.entities.menu-controller")
	.defines(function() {
		LevelMenu = /*JSON[*/ {
			"entities": [
				{
					"type": "EntityMenuController",
					"x": 0,
					"y": 0
				}
			],
			"layer": []
		} /*]JSON*/;
	});
