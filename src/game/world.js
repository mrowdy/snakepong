define(['app/core', 'game/vector2', 'game/item/ball', 'game/item/player', 'game/item/wall'], function(core, Vector2, Ball, Player, Wall) {
    return function(){

        this.size = new Vector2(300, 200);
        this.gravity = new Vector2(0, -9.81);

        this.items = [
            new Ball(this.size.x / 2, this.size.y / 2, 5),
            new Player(10, this.size.y / 2, 3, 30),
            new Player(this.size.x - 10, this.size.y / 2, 3, 30),
            new Wall(this.size.x / 2, 2.5, this.size.x, 5),
            new Wall(2.5, this.size.y / 2, 5, this.size.y),
            new Wall(this.size.x / 2, this.size.y - 2.5, this.size.x, 5),
            new Wall(this.size.x - 2.5, this.size.y / 2, 5, this.size.y)
        ];

        this.update = function(deltaTime){
            var deltaG = new Vector2(this.gravity.x, this.gravity.y);
            deltaG.mulScalar(deltaTime);
            for(var i = 0; i < this.items.length; i++){
                item = this.items[i];
                item.update(deltaTime);
                if(item.TYPE == 'BALL'){
                    item.addForce(deltaG);

                    if(item.position.y < item.size.y / 2){
                        item.position.y = item.size.y / 2;
                        item.velocity.mulScalar(-1);
                    }
                }
            }
        }
    }
});