game.PlayerBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        //dimensions of player base
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
        this.health = game.data.playerBaseHealth;
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
            game.data.win = false;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    loseHealth: function(damage) {
        //the base loses health when attacked 
        this.health = this.health - damage;
    },
    onCollision: function() {

    }
});