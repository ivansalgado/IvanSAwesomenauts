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
        //keeps track of which direction your player is going
        this.facing = "right";
        //keeps track pf time
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastAttack = new Date().getTime();
        //screen follows the player
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        //standing
        this.renderable.addAnimation("idle", [78]);
        //setting walking animation
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        //attacking
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
        //player stands when game starts
        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        this.now = new Date().getTime();
        //checks whether right key is pressed
        if (me.input.isKeyPressed("right")) {
            //adds to the position of x by the velocity in setVelocity()
            //and multiplies it by me.timer.tick (which makes the movement
            //look smooth)
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            //flips the desired animation 
            this.flipX(true);
        }
        else if (me.input.isKeyPressed("left")) {
            this.facing = "left";
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.flipX(false);
        }
        //if the right key is not pressed, the player does not move
        else {
            this.body.vel.x = 0;
        }

        if (me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling) {
            this.body.jumping = true;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        }

        if (me.input.isKeyPressed("attack")) {
            if (!this.renderable.isCurrentAnimation("attack")) {
                //sets the current animation to attack and once that is over
                //goes back to the idle animation
                this.renderable.setCurrentAnimation("attack", "idle");
                //makes it so that the next time we start this sequence we begin
                //from the first animation, not wherever we left off when we
                //switched to another aninmation
                this.renderable.setAnimationFrame();
            }
        }
        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            //checks whether the current animation is NOT walking
            if (!this.renderable.isCurrentAnimation("walk")) {
                //walks right when user presses the right button
                this.renderable.setCurrentAnimation("walk");
            }
        }
        else if (!this.renderable.isCurrentAnimation("attack")) {
            this.renderable.setCurrentAnimation("idle");
        }

        me.collision.check(this, true, this.collideHandler.bind(this), true);
        //delta is the change in time
        this.body.update(delta);
        //updates animations
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function(response) {
        if (response.b.type === 'EnemyBaseEntity') {
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;

            if (ydif < -40 && xdif < 70 && xdif > 35) {
                this.body.falling = false;
                this.body.vel.y = -1;
            }

            else if (xdif > -35 && this.facing === 'right' && (xdif < 0) && ydif > -50) {
                this.body.vel.x = 0;
                this.pos.x = this.pos.x - 1;
            }
            else if (xdif < 70 && this.facing === 'left' && (xdif > 0)) {
                this.body.vel.x = 0;
                this.pos.x = this.pos.x + 1;
            }
            if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= 1000) {
                this.lastHit = this.now;
                response.b.loseHealth();
            }
        }
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
                    return(new me.Rect(0, 0, 100, 70)).toPolygon();
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
        this.type = "PlayerBase";
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
    loseHealth: function(damage) {
        this.health = this.health - damage;
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
                    return(new me.Rect(0, 0, 100, 70)).toPolygon();
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
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    onCollision: function() {

    },
    loseHealth: function() {
        this.health--;
    }
});

game.EnemyCreep = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "creep1",
                width: 32,
                height: 64,
                spritewidth: "32",
                spriteheight: "64",
                getShape: function() {
                    return (new me.Rect(0, 0, 32, 64)).toPolygon();
                }
            }]);
        this.health = 10;
        this.alwaysUpdate = true;
        //this.attacking lets us know if the enemy is currently attacking
        this.attacking = false;
        //keeps track of when our creep last attacked anything
        this.lastAttacking = new Date().getTime();
        //keeps track of the last time our creep hit anything
        this.lastHit = new Date().getTime;
        this.now = new Date().getTime;
        this.body.setVelocity(3, 20);
        this.type = "EnemyCreep";
        this.renderable.addAnimation("walk", [3, 4, 5], 80);
        this.renderable.setCurrentAnimation("walk");
    },
    update: function(delta) {
        this.now = new Date().getTime;
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);

        return true;
    },
    collideHandler: function(response) {
        if (response.b.type === 'PlayerBase') {
            this.attacking = true;
            //      this.lastAttacking = this.now;
            this.body.vel.x = 0;
            //keeps moving to the right to maintain its position
            this.pos.x = this.pos.x + 1;
            //checks that it has been at least 1 second since this creep hit a base
            if ((this.now - this.lastHit >= 1000)) {
                //updates the lasthit timer
                this.lastHit = this.now;
                //makes the player base call its loseHealth function and passes it
                //a damage of 1
                response.b.loseHealth(1);
            }
        }
    }
});

game.GameManager = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        this.alwaysUpdate = true;
    },
    update: function() {
        this.now = new Date().getTime();

        if (Math.round(this.now / 1000) % 10 === 0 && (this.now - this.lastCreep >= 1000)) {
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
            me.game.world.addChild(creepe, 5);
        }

        return true;
    }
});