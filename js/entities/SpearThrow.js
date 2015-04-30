game.SpearThrow = me.Entity.extend({
    //dimensions of the spear
    init: function(x, y, settings, facing){
        this._super(me.Entity, 'init', [x, y, {
                image: "creep1",
                width: 48,
                height: 48,
                spritewidth: "48",
                spriteheight: "48",
                getShape: function() {
                    return (new me.Rect(0, 0, 48, 48)).toPolygon();
                }
            }]);
        this.alwaysUpdate = true;
        this.body.setVelocity(10, 0);
        //three times the amount of ability3
        this.attack = game.data.ability3*3; 
        this.type = "spear";
        this.facing = facing;
    },
    update: function(delta){
        //shoots to the left, if facing left
        if(this.facing === "left"){
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
    }else{
        //shoots to the right if facing right
        this.body.vel.x += this.body.accel.x * me.timer.tick;
    }
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        
        return true;
    },
    
    collideHandler: function(response) {
        //allow enemies to lose health when hit with the spear
        if (response.b.type === 'EnemyBase' || response.b.type==='EnemyCreep') {
            response.b.loseHealth(game.data.enemyCreepAttack);
            response.b.loseHealth(this.attack);
            me.game.world.removeChild(this);
        }
    }
});