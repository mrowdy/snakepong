define(
    [
        'app/core',
        'game/math/vector2',
        'game/item/ball',
        'game/item/player',
        'game/item/wall',
        'game/collision/collision-handler',
        'game/dev'
    ],
    function(core, Vector2, Ball, Player, Wall, CollisionHandler, Dev) {
        return function(){

            //new Dev();

            this.size = new Vector2(300, 200);
            this.gravity = new Vector2(0, 0);


            this.items = [
                new Ball(this.size.x / 2, this.size.y / 2, 10),

                new Player(10, this.size.y / 2, 10, 40),
                new Player(this.size.x - 10, this.size.y / 2, 10, 40),
                new Wall(this.size.x / 2, 2.5, this.size.x, 5),
                //new Wall(2.5, this.size.y / 2, 5, this.size.y),
                new Wall(this.size.x / 2, this.size.y - 2.5, this.size.x, 5),
                //new Wall(this.size.x - 2.5, this.size.y / 2, 5, this.size.y)
            ];

            var collisionHandler;

            var init = function(){
                collisionHandler = new CollisionHandler();
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