define(
    [
        'app/core',
        'game/math/vector2',
        'game/item/ball',
        'game/item/player',
        'game/item/wall',
        'game/collision/collision-handler',
        'game/input/input-handler'
    ],
    function(core, Vector2, Ball, Player, Wall, CollisionHandler, InputHandler) {
        'use strict';

        return function(){

            //new Dev();

            this.size = new Vector2(300, 200);
            this.cellSize= 50;
            this.gravity = new Vector2(0, 0);
            this.roundOver = true;
            this.round = 1;

            this.items = [];

            var instance = this,
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

            var deltaG = new Vector2(),
                item,
                i;

            this.initWorld = function(){

                collisionHandler = new CollisionHandler(this.size.x, this.size.y, this.cellSize);

                this.items = [];
                ball = new Ball(this.size.x / 2, this.size.y / 2, 2);
                player1 = new Player(5, this.size.y / 2, 3, 40);
                player2 = new Player(this.size.x - 5, this.size.y / 2, 3, 40);

                this.initBall();

                var size;
                var wall;

                //wall top
                for(i = 1; i <= this.size.x / this.cellSize; i++){
                    size = this.cellSize;
                    wall = new Wall(i * this.cellSize - this.cellSize / 2, this.size.y + 2.4, size, 5);
                    this.items.push(wall);
                }


                //wall bottom
                for(i = 1; i <= this.size.x / this.cellSize; i++){
                    size = this.cellSize;
                    wall = new Wall(i * this.cellSize - this.cellSize / 2, -2.4, size, 5);
                    this.items.push(wall);
                }

                //wall left
                for(i = 1; i <= this.size.y / this.cellSize; i++){
                    size = this.cellSize;
                    wall = new Wall( -2.4, i * this.cellSize - this.cellSize / 2, 5, size);
                    this.items.push(wall);
                }


                //wall right
                for(i = 1; i <= this.size.y / this.cellSize; i++){
                    size = this.cellSize;
                    wall = new Wall( this.size.x + 2.4, i * this.cellSize - this.cellSize / 2, 5, size);
                    this.items.push(wall);
                }

               this.items.push(ball);
               this.items.push(player1);
               this.items.push(player2);

               var last = ball;

               for(i = 100; i > 0; i--){
                   var tail = new Ball(this.size.x / 2, this.size.y / 2, i / 50);
                   tail.TYPE = 'TAIL';
                   tail.friction = 0.06;
                   tail.collidable = false;
                   last.addChild(tail);
                   last = tail;
                   this.items.push(tail);
               }

            };

            this.initBall = function(){
                ball.position = new Vector2(this.size.x / 2, this.size.y / 2);
                ball.velocity = new Vector2(15,6);
            };

            this.initPlayer = function(){
                player1.speed = 2;
                player2.speed = 2;
            };

            this.initWorld();

            this.update = function(deltaTime){
                deltaG.copyFrom(this.gravity);
                deltaG.mul(deltaTime);
                for(var i = 0; i < this.items.length; i++){
                    item = this.items[i];
                    item.update(deltaTime);
                    addGravity(item, deltaG);
                }

                collisionHandler.check(this.items);

                if(this.roundOver){
                    newRound();
                }
            };

            var addGravity = function(item, deltaG){
                if(item.affectedByGravity){
                    item.addForce(deltaG);
                }
            };

            var ballHitsEnd = function(other){
                if(other.TYPE = 'BALL'){
                    instance.round++;
                    instance.roundOver = true;
                }
            };

            var newRound = function(){
                instance.roundOver = false;
                instance.initBall();
                instance.initPlayer();
            };
        };
});