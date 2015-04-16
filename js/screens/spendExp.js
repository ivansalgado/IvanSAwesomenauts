game.SpendExp = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('exp-screen')), -10); // TODO
                
                
                me.game.world.addChild(new (me.Renderable.extend({
                    init: function(){
                        this._super(me.Renderable, 'init', [330, 40, 300, 50]);
                        this.font = new me.Font("Century Gothic", 18, "white");
                    },
                    
                    draw: function(renderer){
                        this.font.draw(renderer.getContext(), "PRESS F5 TO BUY, PRESS F5 TO SKIP", this.pos.x, this.pos.y);
                        this.font.draw(renderer.getContext(), "CURRENT EXP: " + game.data.exp.toString(), this.pos.x, this.pos.y + 50);
                    }
                   
                })));
        },
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		
        }
});