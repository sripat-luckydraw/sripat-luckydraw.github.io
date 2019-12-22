ig.module("game.levels.game")
	.requires("impact.image", "game.entities.game-controller")
	.defines(function() {
		LevelGame = /*JSON[*/ {
			"entities": [
				{
					"type": "EntityGameController",
					"x": 0,
					"y": 0
				}
			],
			"layer": []
		} /*]JSON*/;
	});
