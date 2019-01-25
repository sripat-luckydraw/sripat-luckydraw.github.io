ig.module('game.entities.test-entities')
.requires(
	'impact.entity'
)
.defines(function() {
    EntityTestEntities = ig.Entity.extend({
        
        tweeny:0,
        
        init:function(x,y,settings){
            this.parent(x,y,settings);

		    this.tween({tweeny:80},3,{
		    	easing:ig.Tween.Easing.Elastic.EaseOut
		    }).start();
			
        },
        update:function(){            
            this.parent();            
        },
        draw:function(){
            this.parent();
						
		var ctx = ig.system.context;

		ctx.font = "20pt arty-mouse";
		ctx.fillStyle = "#ffffff";
		ctx.textAlign = "center";
        ctx.fillText("Test font naja", ig.system.width/2, this.tweeny);
        
        }
    });
});