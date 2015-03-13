game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;
                
                //telling which map to look at
                me.levelDirector.loadLevel("level01");
                
                var player = me.pool.pull("player", 0, 240, {});
                me.game.world.addChild(player, 5);
                //goes right when right key is pressed
                me.input.bindKey(me.input.KEY.RIGHT, "right");
                //goes left when left key is pressed
                me.input.bindKey(me.input.KEY.LEFT, "left");
                //attecks when spacebar is pressed
                me.input.bindKey(me.input.KEY.SPACEBAR, "attack");

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	}
});
