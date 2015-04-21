game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('title')), -10); // TODO
                
                me.game.world.addChild(new (me.Renderable.extend({
                    init: function(){
                        this._super(me.Renderable, 'init', [600, 80, 300, 50]);
                        this.font = new me.Font("Century Gothic", 18, "white");
                        //listens to see if you're clicking within the dimensions above
                        me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
                    },
                    draw: function(renderer){
                        this.font.draw(renderer.getContext(), "START A NEW GAME", this.pos.x, this.pos.y);
                    },
                    
                    update: function(dt){ //dt=delta
                        return true;
                    },
                    
                    newGame: function(){
                        console.log("new1");
                        me.input.releasePointerEvent('pointerdown', this);
                        me.input.releasePointerEvent('pointerdown', game.data.option2);
                        me.state.change(me.state.NEW);
                    }
                })));
                
                me.game.world.addChild(new (me.Renderable.extend({
                    init: function(){
                        this._super(me.Renderable, 'init', [653, 140, 250, 50]);
                        this.font = new me.Font("Century Gothic", 12, "white");
                        //listens to see if you're clicking within the dimensions above
                        me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
                    },
                    draw: function(renderer){
                        this.font.draw(renderer.getContext(), "CONTINUE", this.pos.x, this.pos.y);
                    },
                    
                    update: function(dt){
                        return true;
                    },
                    
                    newGame: function(){
                        me.input.releasePointerEvent('pointerdown', this);
                        me.state.change(me.state.LOAD);
                    }
                })));
                
        },
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		
        }
});
