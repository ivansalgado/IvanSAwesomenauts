game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);

        //moving 5 units right
        this.body.setVelocity(5, 20);
        //standing
        this.renderable.addAnimation("idle", [78]);
        //setting walking animation
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        //player stands when game starts
        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        //checks whether right key is pressed
        if (me.input.isKeyPressed("right")) {
            //adds to the position of x by the velocity in setVelocity()
            //and multiplies it by me.timer.tick (which makes the movement
            //look smooth)
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            //flips the desired animation 
            this.flipX(true);
        }
        //if the right key is not pressed, the player does not move
        else {
            this.body.vel.x = 0;
        }

        if (this.body.vel.x !== 0) {
            //checks whether the current animation is NOT walking
            if (!this.renderable.isCurrentAnimation("walk")) {
                //walks right when user presses the right button
                this.renderable.setCurrentAnimation("walk");
            }
        }
        //delta is the change in time
        this.body.update(delta);
        //updates animations
        this._super(me.Enitiy, "update", [delta]);
        return true;
    }
});