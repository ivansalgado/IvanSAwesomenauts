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
        //screen follows the player
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        //standing
        this.renderable.addAnimation("idle", [78]);
        //setting walking animation
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        //player stands when game starts
        this.renderable.setCurrentAnimation("idle");
        //attacking
        this.renderable.addAnimation("attack", [], 80);
        
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
        this._super(me.Entity, "update", [delta]);
        return true;
    }
});

game.PlayerBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return(new me.Rect(0, 0, 100, 100)).toPolygon();
                }
            }]);
        //does not start as a broken tower
        this.broken = false;
        //has ten lives
        this.health = 10;
        //always updates the health
        this.alwaysUpdate = true;
        //if someone runs into the tower, it will be able to collide with it
        this.body.onCollision = this.onCollision.bind(this);
        //a type of collision (to identify it when there are multiple collisions)
        this.type = "PlayerBaseEntity";
        //adding the normal tower as the base
        this.renderable.addAnimation("idle", [0]);
        //adding the broken tower as the base
        this.renderable.addAnimation("broken", [1]);
        //the tower begins as a normal (not broken) tower
        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        //if the health is less than or equal to 0, then the player is dead
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    onCollision: function() {

    }
});

game.EnemyBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return(new me.Rect(0, 0, 100, 100)).toPolygon();
                }
            }]);
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        //if someone runs into the tower, it will be able to collide with it
        this.body.onCollision = this.onCollision.bind(this);
        //a type of collision (to identify it when there are multiple collisions)
        this.type = "EnemyBaseEntity";
        //adding the normal tower as the base
        this.renderable.addAnimation("idle", [0]);
        //adding the broken tower as the base
        this.renderable.addAnimation("broken", [1]);
        //the tower begins as a normal (not broken) tower
        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
//        //if the health is less than or equal to 0, then the player is dead
//        if (this.health <= 0) {
//            this.broken = true;
//            this.renderable.setCurrentAnimation("broken");
//        }
//        this.body.update(delta);
//        this._super(me.Entity, "update", [delta]);
//        return true;
    },
    onCollision: function() {

    }
});