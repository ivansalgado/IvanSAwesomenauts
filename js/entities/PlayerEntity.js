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
        this.type = "PlayerEntity";
        this.health = game.data.playerHealth;
        //moving 5 units right
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        //keeps track of which direction your player is going
        this.facing = "right";
        //keeps track pf time
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.dead = false;
        this.attack = game.data.playerAttack;
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
        if (this.health <= 0){
            this.dead = true;
        }
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
    loseHealth: function(damage) {
        this.health = this.health - damage;
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
             //   this.pos.x = this.pos.x - 1;
            }
            else if (xdif < 70 && this.facing === 'left' && (xdif > 0)) {
                this.body.vel.x = 0;
             //   this.pos.x = this.pos.x + 1;
            }
            if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
                this.lastHit = this.now;
                
                response.b.loseHealth(game.data.playerAttack);
            }
        }else if(response.b.type==='EnemyCreep'){
            var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;
            
            //keeps the player from walking through the enemy
            if(xdif>0){
           //     this.pos.x = this.pos.x + 1;
                if(this.facing==="left"){
                    this.body.vel.x = 0;
                }
            }else{
            //    this.pos.x = this.pos.x -1;
                if(this.facing==="right"){
                    this.body.vel.x = 0;
                }
            }
            
            
            if(this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer
                  && (Math.abs(ydif) <= 40) && 
                  ((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right")
                  ){
                this.lastHit = this.now;
                //if the creep's health is less than our attack, execute code in if statement 
                if(response.b.health <= game.data.playerAttack){
                    game.data.gold += 1;
                    
                }
                response.b.loseHealth(game.data.playerAttack);
            }
        }
    }
});