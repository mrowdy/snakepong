define(['app/core', 'game/vector2', 'game/item/ball', 'game/item/player', 'game/item/wall'], function(core, Vector2, Ball, Player, Wall) {
    return function(){

        this.size = new Vector2(300, 200);
        this.gravity = new Vector2(0, -9.81);
        this.ball = new Ball(this.size.x / 2, this.size.y / 2, 5);
        this.player = [
            new Player(10, this.size.y / 2, 3, 30),
            new Player(this.size.x - 10, this.size.y / 2, 3, 30)
        ];

        this.wall = [
            new Wall(this.size.x / 2, 2.5, this.size.x, 5),
            new Wall(2.5, this.size.y / 2, 5, this.size.y),
            new Wall(this.size.x / 2, this.size.y - 2.5, this.size.x, 5),
            new Wall(this.size.x - 2.5, this.size.y / 2, 5, this.size.y)

        ];

        var init = function(){

        }

        this.update = function(deltaTime){
            var deltaG = new Vector2(this.gravity.x, this.gravity.y);
            deltaG.mulScalar(deltaTime);
            this.ball.update(deltaTime);
            this.ball.addForce(deltaG);

            for(var i = 0; i < this.player.length; i++){
                this.player[i].update(deltaTime);
            }

            if(this.ball.position.y < this.ball.size.y / 2){
                this.ball.position.y = this.ball.size.y / 2;
                this.ball.velocity.mulScalar(-1);
            }
        }

        init();
    }
});