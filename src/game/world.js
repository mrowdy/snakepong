define(
    [
        'app/core',
        'game/math/vector2',
        'game/item/ball',
        'game/item/player',
        'game/item/wall',
        'game/collision/collision-handler',
        'game/input/input-handler',
        'game/dev'
    ],
    function(core, Vector2, Ball, Player, Wall, CollisionHandler, InputHandler, Dev) {
        return function(){

            //new Dev();

            this.size = new Vector2(300, 200);
            this.gravity = new Vector2(0, 0);
            this.roundOver = true;
            this.round = 1;

            this.items = [];

            var instance = this,
                wallLeft,
                wallRight,
                wallTop,
                wallBottom,
                ball,
                player1,
                player2;

            var collisionHandler;
            this.inputHandler = new InputHandler({
                player1Up   : function(){ player1.up(); },
                player1Down : function(){ player1.down(); },
                player2Up   : function(){ player2.up(); },
                player2Down : function(){ player2.down(); }
            });

            this.initWorld = function(){
               this.items = [];
               wallLeft = new Wall(-5, this.size.y / 2, 5, this.size.y);
               wallRight = new Wall(this.size.x + 5, this.size.y / 2, 5, this.size.y);
               wallTop = new Wall(this.size.x / 2, 2.5, this.size.x, 5);
               wallBottom = new Wall(this.size.x / 2, this.size.y - 2.5, this.size.x, 5);
               ball = new Ball(this.size.x / 2, this.size.y / 2, 2);
               player1 = new Player(5, this.size.y / 2, 3, 40);
               player2 = new Player(this.size.x - 5, this.size.y / 2, 3, 40);

               this.initBall();

               this.items.push(wallLeft);
               this.items.push(wallRight);
               this.items.push(wallTop);
               this.items.push(wallBottom);
               this.items.push(ball);
               this.items.push(player1);
               this.items.push(player2);

               var last = ball;

               for(var i = 10; i > 0; i--){
                   var tail = new Ball(last.position.x - i/2 - 1, this.size.y / 2, i/5);
                   tail.noCollision = true;
                   tail.TYPE = 'TAIL';
                   tail.friction = 0.04;
                   last.addChild(tail);
                   last = tail;
                   this.items.push(tail);
               }


                /*
               wallLeft.collision = function(other){
                   ballHitsEnd(other);
               }
               wallRight.collision = function(other){
                   ballHitsEnd(other);
               }*/
            }

            this.initBall = function(){
                ball.position = new Vector2(this.size.x / 2, this.size.y / 2);
                ball.velocity = new Vector2(10,3);
            }

            this.initPlayer = function(){
                player1.speed = 2;
                player2.speed = 2;
            }

            this.initWorld();

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

                if(this.roundOver){
                    newRound();
                }

            }

            var addGravity = function(item, deltaG){
                if(item.affectedByGravity){
                    item.addForce(deltaG);
                }
            }

            var ballHitsEnd = function(other){
                if(other.TYPE = 'BALL'){
                    instance.round++;
                    instance.roundOver = true;
                }
            }

            var newRound = function(){
                instance.roundOver = false;
                instance.initBall();
                instance.initPlayer();
            }

            init();
        }
});