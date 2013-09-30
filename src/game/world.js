define(
    [
        'app/core',
        'game/math/vector2',
        'game/item/ball',
        'game/item/player',
        'game/item/wall',
        'game/collision/collision-handler',
        'game/input/keyboard-controller',
        'game/dev'
    ],
    function(core, Vector2, Ball, Player, Wall, CollisionHandler, KeyboardController, Dev) {
        return function(){

            //new Dev();

            this.size = new Vector2(300, 200);
            this.gravity = new Vector2(0, 0);

            this.items = [
                new Wall(this.size.x / 2, 2.5, this.size.x, 5),
                new Wall(this.size.x / 2, this.size.y - 2.5, this.size.x, 5),
            ];

            var ball = new Ball(this.size.x / 2, this.size.y / 2, 10);
            ball.velocity = new Vector2(Math.random() * 10, Math.random() * 10);
            this.items.push(ball);

            var player1 = new Player(10, this.size.y / 2, 10, 40);
            var player2 = new Player(this.size.x - 10, this.size.y / 2, 10, 40);

            this.items.push(player1);
            this.items.push(player2);

            var collisionHandler;
            var keyboardController;

            var init = function(){
                collisionHandler = new CollisionHandler();
                keyboardController = new KeyboardController({
                    87 : function(){ player1.addForce(new Vector2(0,3)); },
                    83 : function(){ player1.addForce(new Vector2(0,-3)); },
                    38 : function(){ player2.addForce(new Vector2(0,3)); },
                    40 : function(){ player2.addForce(new Vector2(0,-3)); }
                }, 100);
            }

            this.update = function(deltaTime){
                var deltaG = new Vector2(this.gravity.x, this.gravity.y);
                deltaG.mulScalar(deltaTime);
                for(var i = 0; i < this.items.length; i++){
                    item = this.items[i];
                    item.update(deltaTime);
                    addGravity(item, deltaG);
                }

                collisionHandler.check(this.items);

            }

            var addGravity = function(item, deltaG){
                if(item.affectedByGravity){
                    item.addForce(deltaG);
                }
            }

            init();
        }
});