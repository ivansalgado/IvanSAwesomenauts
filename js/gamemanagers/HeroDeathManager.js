game.HeroDeathManager = Object.extend({
    
    init: function(x, y, settings){
        this.alwaysUpdate = true;
    },
    
    update: function(){
        //when player dies, reset him to the beginning of the map
        if (game.data.player.dead) {
            me.game.world.removeChild(game.data.player);
            me.state.current().resetPlayer(10, 0);
        }
        return true;
    }
});

