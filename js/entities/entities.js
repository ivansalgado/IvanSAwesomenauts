game.PlayerEntity = me.Entity.extend({

init: function(x, y, settings) {
        this.setSuper(x, y);
        this.setPlayerTimers();
        this.setAttributes();
        this.type = "PlayerEntity";
        this.setFlags();
        //screen follows the player
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.addAnimation();
        //player stands when game starts
        this.renderable.setCurrentAnimation("idle");
},

        setSuper: function(x, y) {
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
        },

        setPlayerTimers: function() {
        this.now = new Date().getTime();
                this.lastHit = this.now;
                this.lastAttack = new Date().getTime();
        },
    
        setAttributes: function() {
        this.health = game.data.playerHealth;
                //moving 5 units right
                this.body.setVelocity(game.data.playerMoveSpeed, 20);
                this.attack = game.data.playerAttack;
        },
    
        setFlags: function(){
        //keeps track of which direction your player is going
        this.facing = "right";
        this.dead = false;
        this.attacking = false;
        },
    
        addAnimation: function(){
        //standing
        this.renderable.addAnimation("idle", [130]);
                //setting walking animation
                this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
                //attacking
                this.renderable.addAnimation("attack", [169, 170, 171, 172, 173, 174], 80);
        },

update: function(delta) {
        this.now = new Date().getTime();
        this.dead = this.checkIfDead();
        this.checkKeyPressesAndMove();
        this.setAnimation();

        me.collision.check(this, true, this.collideHandler.bind(this), true);

        //delta is the change in time
        this.body.update(delta);
        //updates animations
        this._super(me.Entity, "update", [delta]);
        return true;
        },
    
        checkIfDead: function(){
        if (this.health <= 0) {
        return true;
        }
        return false;
        },
    
        checkKeyPressesAndMove: function(){
        //checks whether right key is pressed
        if (me.input.isKeyPressed("right")) {
        this.moveRight();
        }
        else if (me.input.isKeyPressed("left")) {
        this.moveLeft();
        }
        //if the right key is not pressed, the player does not move
        else {
        this.body.vel.x = 0;
        }

        if (me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling) {
        this.jump();
        }
        this.attacking = me.input.isKeyPressed("attack");
        },
    
        moveRight: function(){
        //adds to the position of x by the velocity in setVelocity()
        //and multiplies it by me.timer.tick (which makes the movement
        //look smooth)
        this.body.vel.x += this.body.accel.x * me.timer.tick;
                this.facing = "right";
                //flips the desired animation 
                this.flipX(true);
        },
    
        moveLeft: function(){
        this.facing = "left";
                this.body.vel.x -= this.body.accel.x * me.timer.tick;
                this.flipX(false);
        },
    
        jump: function(){
        this.body.jumping = true;
                this.body.vel.y -= this.body.accel.y * me.timer.tick;
        },
    
        setAnimation: function(){
        if (this.attacking) {
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
        },      

loseHealth: function(damage) {
        this.health = this.health - damage;
        },

collideHandler: function(response) {
        if (response.b.type === 'EnemyBaseEntity') {
        this.collideWithEnemyBase(response);
        }

        else if (response.b.type === 'EnemyCreep') {
        this.collideWithEnemyCreep(response);
        }
        },
        
        collideWithEnemyBase: function(response){
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;
            if (ydif < - 40 && xdif < 70 && xdif > 35) {
        this.body.falling = false;
                this.body.vel.y = - 1;
        }
        else if (xdif > - 35 && this.facing === 'right' && (xdif < 0) && ydif > - 50) {
        this.body.vel.x = 0;
        }
        else if (xdif < 70 && this.facing === 'left' && (xdif > 0)) {
        this.body.vel.x = 0;
        }
        if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
                this.lastHit = this.now;
                response.b.loseHealth(game.data.playerAttack);
        }
        },
        
        collideWithEnemyCreep:function(response){
            var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;
            
            this.stopMovement(xdif);
            if(this.checkAttack(xdif, ydif)){
                this.hitCreep(response);
            };
            
        },
        
        stopMovement: function(xdif){
            //keeps the player from walking through the enemy
            if (xdif > 0) {
                if (this.facing === "left") {
                this.body.vel.x = 0;
                }
            }
            else {
                if (this.facing === "right") {
                this.body.vel.x = 0;
                }
            }
        },
        
        checkAttack: function(xdif, ydif){
            if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer
            && (Math.abs(ydif) <= 40) &&
            (((xdif > 0) && this.facing === "left") || ((xdif < 0) && this.facing === "right"))
            ) {
                this.lastHit = this.now;
                return true;
            }
            return false;
        },
        
        hitCreep: function(response){
            //if the creep's health is less than our attack, execute code in if statement 
                if (response.b.health <= game.data.playerAttack) {
                    game.data.gold += 1;
                }
                response.b.loseHealth(game.data.playerAttack);
        }
});