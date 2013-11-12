define(
    [
        'app/core',
        'game/math/vector2',
        'game/item/snake',
        'game/item/player',
        'game/item/wall',
        'game/item/food',
        'game/collision/collision-handler',
        'game/input/input-handler'
    ],
    function(core, Vector2, Snake, Player, Wall, Food, CollisionHandler, InputHandler) {
        'use strict';

        return function(){

            //new Dev();

            this.size = new Vector2(300, 200);
            this.cellSize= 50;
            this.gravity = new Vector2(0, 0);
            this.roundOver = true;
            this.round = 1;
            this.maxFood = 10;

            this.items = [];

            this.stats = {
                player1: {
                    points: 0,
                    position: {
                        x: 5,
                        y: 10
                    }
                },

                player2: {
                    points: 0,
                    position: {
                        x: 295,
                        y: 10
                    }
                }
            };

            var instance = this,
                snake,
                player1,
                player2,
                index;

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

            var last;
            var addTail = function(length){
                for(i = length; i > 0; i--){
                    var tail = new Snake(last.position.x, last.position.y + 1, last.radius * 0.95);
                    tail.TYPE = 'TAIL';
                    tail.friction = 0.07;
                    tail.collidable = false;
                    tail.semiStatic = true;
                    last.addChild(tail);
                    last = tail;
                    instance.items.push(tail);
                }
            };

            var addFood = function(){
                for(i = 0; i < 5; i++){
                    instance.maxFood--;
                    var food = new Food(
                        Math.random() * (instance.size.x  - 40) + 20,
                        Math.random() * (instance.size.y - 40) + 20,
                        3
                    );
                    instance.items.push(food);
                }
            };

            var replaceFood = function(item){

                if(instance.maxFood > 0){
                    instance.maxFood--;
                    item.position.x = Math.random() * (instance.size.x  - 40) + 20;
                    item.position.y = Math.random() * (instance.size.y  - 40) + 20;
                } else {
                    removeItem(item);
                }

            };

            this.initWorld = function(){

                collisionHandler = new CollisionHandler(this.size.x, this.size.y, this.cellSize);

                this.items = [];
                snake = new Snake(this.size.x / 2, this.size.y / 2, 3);
                last = snake;
                addTail(10);

                player1 = new Player(5, this.size.y / 2, 3, 40);
                player2 = new Player(this.size.x - 5, this.size.y / 2, 3, 40);

                this.initSnake();

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

                this.items.push(snake);
                this.items.push(player1);
                this.items.push(player2);

                addFood();
                collisionHandler.initStatic(this.items);

            };

            this.initSnake = function(){
                snake.position = new Vector2(this.size.x / 2, this.size.y / 2);
                snake.velocity = new Vector2(2, 0);
                snake.collision = function(other){
                    if(other.TYPE === 'FOOD'){
                        addTail(1);
                        if(snake.lastPlayerTouched === player1){
                            instance.stats.player1.points += other.points;
                        } else {
                            instance.stats.player2.points += other.points;
                        }
                        replaceFood(other);
                    } else if(other.TYPE === 'PLAYER'){
                        snake.lastPlayerTouched = other;
                    }
                };
            };

            this.initPlayer = function(){
                player1.speed = 2;
                player2.speed = 2;
            };

            this.initWorld();

            this.getPlayer1 = function(){
                return player1;
            }
            this.getPlayer2 = function(){
                return player2;
            }

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

            var snakeHitsEnd = function(other){
                if(other.TYPE = 'SNAKE'){
                    instance.round++;
                    instance.roundOver = true;
                }
            };

            var newRound = function(){
                instance.roundOver = false;
                instance.initSnake();
                instance.initPlayer();
            };

            var removeItem = function(item){
                index = instance.items.indexOf(item);
                instance.items.splice(index, 1);
            };
        };
});