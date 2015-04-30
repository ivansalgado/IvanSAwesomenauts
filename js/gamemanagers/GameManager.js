game.ExperienceManager = Object.extend({
    init: function(x, y, settings){
        //update if game is running
        this.alwaysUpdate = true;
        this.gameover = false;
    },
    
    update: function(){
        //if you've successfully attacked the enemy...
        if(game.data.win === true && !this.gameover){
            this.gameOver(true);
            //...alert the player that he/she won
            alert("YOU'VE WON");
        }else if(game.data.win === false && !this.gameover){
            //if player's base has no health...
            this.gameOver(false);
            //...alert the player that he/she has lost
            alert("GAME OVER");
        }
        return true;
    },
    
    gameOver: function(win){
        if(win){
          game.data.exp += 10;  
        }else{
            game.data.exp += 1;
        }
        
        //save the player's progress when the game has ended
        this.gameover = true;
        me.save.exp = game.data.exp;
        
        
        //when you click on the button, it passes the information to create-user file
        $.ajax({
            type: "POST",
            url: "php/controller/save-user.php",
            data: {
                exp: game.data.exp,
                exp1: game.data.exp1,
                exp2: game.data.exp2,
                exp3: game.data.exp3,
                exp4: game.data.exp4,
                
            },
            dataType: "text"
        })
                .success(function(response) {
                    if (response === "true") {
                        me.state.change(me.state.MENU);
                    } else {
                        alert(response);
                    }
                })
                .fail(function(response) {
                    alert("Fail");
                });
                    
       
    }
    
    
});

