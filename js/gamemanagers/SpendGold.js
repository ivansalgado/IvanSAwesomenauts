game.SpendGold = Object.extend({
   init: function(x, y, settings){
     this.now = new Date().getTime();
     this.lastBuy = new Date().getTime();
     this.paused = false;
     this.alwaysUpdate = true;
     this.updateWhenPaused = true;
     this.buying = false;
   },
   
   update: function(){
       this.now = new Date().getTime();
       if(me.input.isKeyPressed("buy") && this.now-this.lastBuy >= 1000){
           this.lastBuy = this.now;
           if(!this.buying){
               this.startBuying();
           }else{
               this.stopBuying();
           }
       }
       
       this.checkBuyKeys();
       
       return true;
   },
   
   startBuying: function(){
       this.buying = true;
       me.state.pause(me.state.PLAY);
       game.data.pausePos = me.game.viewport.localToWorld(0, 0);
       game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage('gold-screen'));
       game.data.buyscreen.updateWhenPaused = true;
       game.data.buyscreen.setOpacity(0.4);
       me.game.world.addChild(game.data.buyscreen, 34);
       game.data.player.body.setVelocity(0, 0);
       me.state.pause(me.state.PLAY);
       me.input.bindKey(me.input.KEY.F1, "F1", true);
       me.input.bindKey(me.input.KEY.F2, "F2", true);
       me.input.bindKey(me.input.KEY.F3, "F3", true);
       me.input.bindKey(me.input.KEY.F4, "F4", true);
       me.input.bindKey(me.input.KEY.F5, "F5", true);
       me.input.bindKey(me.input.KEY.F6, "F6", true);
       this.setBuyText();
   },
   
    setBuyText: function() {
        game.data.buytext = new (me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, 'init', [game.data.pausePos.x, game.data.pausePos.y, 300, 50]);
                this.font = new me.Font("Century Gothic", 18, "#000000");
                this.updateWhenPaused = true;
                this.alwaysUpdate = true;
            },
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), "PRESS F1-F6 TO BUY, PRESS A TO EXIT      CURRENT GOLD: " + game.data.gold, this.pos.x + 375, this.pos.y);
                this.font.draw(renderer.getContext(), "SKILLS", this.pos.x + 350, this.pos.y + 50);
                this.font.draw(renderer.getContext(), "DAMAGE   CURRENT LEVEL: " + game.data.skill1 + ", COST: " + ((game.data.skill1+1)*10), this.pos.x + 375, this.pos.y + 75);
                this.font.draw(renderer.getContext(), "SPEED   CURRENT LEVEL: " + game.data.skill2 + ", COST: " + ((game.data.skill2+1)*10), this.pos.x + 375, this.pos.y + 100);
                this.font.draw(renderer.getContext(), "HEALTH   CURRENT LEVEL: " + game.data.skill3 + ", COST: " + ((game.data.skill3+1)*10), this.pos.x + 375, this.pos.y + 125);
                this.font.draw(renderer.getContext(), "ABILITIES", this.pos.x + 350, this.pos.y + 175);
                this.font.draw(renderer.getContext(), "Q: SPEED BURST   CURRENT LEVEL:  " + game.data.ability1 + ", COST: " + ((game.data.ability1+1)*10), this.pos.x + 375, this.pos.y + 200);
                this.font.draw(renderer.getContext(), "W: EAT CREEP   CURRENT LEVEL: " + game.data.ability2 + ", COST: " + ((game.data.ability2+1)*10), this.pos.x + 375, this.pos.y + 225);
                this.font.draw(renderer.getContext(), "E: THROW SPEAR   CURRENT LEVEL: " + game.data.ability3 + ", COST: " + ((game.data.ability3+1)*10), this.pos.x + 375, this.pos.y + 250);
            }

        }));
        me.game.world.addChild(game.data.buytext, 35);
    },
   
   stopBuying: function(){
       this.buying = false;
       me.state.resume(me.state.PLAY);
       game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
       me.game.world.removeChild(game.data.buyscreen);
       //unbinds so that a player cannot make a purchase while playing
       me.input.unbindKey(me.input.KEY.F1, "F1", true);
       me.input.unbindKey(me.input.KEY.F2, "F2", true);
       me.input.unbindKey(me.input.KEY.F3, "F3", true);
       me.input.unbindKey(me.input.KEY.F4, "F4", true);
       me.input.unbindKey(me.input.KEY.F5, "F5", true);
       me.input.unbindKey(me.input.KEY.F6, "F6", true);
       me.game.world.removeChild(game.data.buytext);
   },
   
   checkBuyKeys: function(){
       if(me.input.isKeyPressed("F1")){
           if(this.checkCost(1)){
               this.makePurchase(1);
           }
       }else if(me.input.isKeyPressed("F2")){
           if(this.checkCost(2)){
               this.makePurchase(2);
           }
       }else if(me.input.isKeyPressed("F3")){
           if(this.checkCost(3)){
               this.makePurchase(3);
           }
       }else if(me.input.isKeyPressed("F4")){
           if(this.checkCost(4)){
               this.makePurchase(4);
           }
       }else if(me.input.isKeyPressed("F5")){
           if(this.checkCost(5)){
               this.makePurchase(5);
           }
       }else if(me.input.isKeyPressed("F6")){
           if(this.checkCost(6)){
               this.makePurchase(6);
           }
       } 
   },
   
   //seeing if you have enough money for the skill purchased -> returns true/false
   checkCost: function(skill){
       //if skill1 was the one that was selected and you have more gold than the cost to level up skill1,
       //then return true. If not, return false.
       if(skill===1 && (game.data.gold >= ((game.data.skill1+1)*10))){
           return true;
       }else if(skill===2 && (game.data.gold >= ((game.data.skill2+1)*10))){
           return true;
       }else if(skill===3 && (game.data.gold >= ((game.data.skill3+1)*10))){
           return true;
       }else if(ability===1 && (game.data.gold >= ((game.data.ability1+1)*10))){
           return true;
       }else if(ability===2 && (game.data.gold >= ((game.data.ability2+1)*10))){
           return true;
       }else if(ability===3 && (game.data.gold >= ((game.data.ability3+1)*10))){
           return true;
       }else{
           return false;
       }
   },
   
   makePurchase: function(skill){
    if(skill === 1){
        game.data.gold -= ((game.data.skill1 +1)*10);
        game.data.skill1 += 1;
        game.data.playerAttack += 1;
   }else if(skill === 2){
        game.data.gold -= ((game.data.skill2 +1)*10);
        game.data.skill2 += 1;
        
   }else if(skill === 3){
        game.data.gold -= ((game.data.skill3 +1)*10);
        game.data.skill3 += 1;
        
   }else if(ability === 1){
        game.data.gold -= ((game.data.ability1 +1)*10);
        game.data.ability1 += 1;
        
   }else if(ability === 2){
        game.data.gold -= ((game.data.ability2 +1)*10);
        game.data.ability2 += 1;
        
   }else if(skill === 3){
        game.data.gold -= ((game.data.ability3 +1)*10);
        game.data.ability3 += 1;
        
   }
   }
   
});