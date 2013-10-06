define(['game/collision/spatial-hash-grid', 'game/item/ball', 'game/item/player'], function(SHG, Ball, Player) {
    'use strict';
    describe('SHG Module', function() {
        it('load Spatial Hash Grid width 100x100 and 20 cellsize', function() {
            var width = 100;
            var height = 100;
            var cellsize = 20;

            var spatialHashGrid = new SHG(width, height, cellsize);

            expect(spatialHashGrid.cellsPerRow).toBe(5);
            expect(spatialHashGrid.cellsPerCol).toBe(5);
            expect(spatialHashGrid.static.length).toBe(25);
            expect(spatialHashGrid.dynamic.length).toBe(25);
        });

        it('load Spatial Hash Grid width 100x100 and 30 cellsize', function() {
            var width = 100;
            var height = 100;
            var cellsize = 30;

            var spatialHashGrid = new SHG(width, height, cellsize);

            expect(spatialHashGrid.cellsPerRow).toBe(4);
            expect(spatialHashGrid.cellsPerCol).toBe(4);
            expect(spatialHashGrid.static.length).toBe(16);
            expect(spatialHashGrid.dynamic.length).toBe(16);
        });

        it('load Spatial Hash Grid width 100x100 and 20 cellsize place dynamic object in cell', function() {
            var width = 100;
            var height = 100;
            var cellsize = 100;

            var spatialHashGrid = new SHG(width, height, cellsize);

            expect(spatialHashGrid.cellsPerRow).toBe(1);
            expect(spatialHashGrid.cellsPerCol).toBe(1);
            expect(spatialHashGrid.static.length).toBe(1);
            expect(spatialHashGrid.dynamic.length).toBe(1);

            var ball1 = new Ball(0, 0, 1);
            var ball2 = new Ball(98, 98, 2);

            spatialHashGrid.registerDynamicActor(ball1);
            spatialHashGrid.registerDynamicActor(ball2);

        });

        it('load Spatial Hash Grid width 100x100 and 100 cellsize place dynamic object at border in cell', function() {
            var width = 100;
            var height = 100;
            var cellsize = 20;

            var spatialHashGrid = new SHG(width, height, cellsize);
            var ball = new Ball(50, 50, 1);

            spatialHashGrid.registerDynamicActor(ball);

        });

        it('load Spatial Hash Grid width 100x100 and 20 cellsize place 3 dynamic object in cell', function() {
            var width = 100;
            var height = 100;
            var cellsize = 20;

            var spatialHashGrid = new SHG(width, height, cellsize);
            var ball1 = new Ball(52, 52, 1);
            var ball2 = new Ball(52, 54, 1);
            var ball3 = new Ball(56, 56, 1);

            spatialHashGrid.registerDynamicActor(ball1);
            spatialHashGrid.registerDynamicActor(ball2);
            spatialHashGrid.registerDynamicActor(ball3);

        });

        it('load Spatial Hash Grid width 100x100 and 20 cellsize place 3 dynamic objects in same cell and retrive potential colliders', function() {
            var width = 100;
            var height = 100;
            var cellsize = 20;

            var spatialHashGrid = new SHG(width, height, cellsize);
            var ball1 = new Ball(52, 52, 1);
            var ball2 = new Ball(52, 54, 1);
            var ball3 = new Ball(56, 56, 1);

            spatialHashGrid.registerDynamicActor(ball1);
            spatialHashGrid.registerDynamicActor(ball2);
            spatialHashGrid.registerDynamicActor(ball3);

            var colliders = spatialHashGrid.getPotentialColliders(ball1);
            expect(colliders.length).toBe(2);

        });


        it('load Spatial Hash Grid width 100x100 and 20 cellsize place multible dynamic objects in different cells and retrive potential colliders', function() {
            var width = 100;
            var height = 100;
            var cellsize = 100/4;

            var spatialHashGrid = new SHG(width, height, cellsize);

            var balls = [];
            var ball;
            for(var i = 1; i <= 4; i++){
                for(var y = 1; y <= 4; y++){
                    ball = new Ball(i * 25 - 12.5, y * 25 - 12.5, 5);
                    balls.push(ball);
                    spatialHashGrid.registerDynamicActor(ball);
                }
            }

            var colliders;
            for( i = 0; i < 9; i++){
                colliders = spatialHashGrid.getPotentialColliders(balls[i]);
                expect(colliders.length).toBe(0);
            }

            ball = new Ball(12.5, 12.5, 1);
            spatialHashGrid.registerDynamicActor(ball);
            ball = new Ball(12.5, 12.5, 1);
            spatialHashGrid.registerDynamicActor(ball);
            colliders = spatialHashGrid.getPotentialColliders(ball);
            expect(colliders.length).toBe(2);

            expect(spatialHashGrid.cellsPerRow).toBe(4);
            expect(spatialHashGrid.cellsPerCol).toBe(4);
        });


        it('load Spatial Hash Grid width 100x100 and 20 cellsize place multible static objects in different cells and retrive potential colliders of dynamic', function() {
            var width = 100;
            var height = 100;
            var cellsize = 100/3;

            var spatialHashGrid = new SHG(width, height, cellsize);

            var balls = [];
            var ball;
            for(var i = 1; i <= 3; i++){
                for(var y = 1; y <= 3; y++){
                    ball = new Ball(i * 25, y * 25, 5);
                    ball.static = true;
                    balls.push(ball);
                    spatialHashGrid.registerStaticActor(ball);
                }
            }

            var colliders;
            for( i = 0; i < 9; i++){
                colliders = spatialHashGrid.getPotentialColliders(balls[i]);
                expect(colliders.length).toBe(0);
            }

            ball = new Ball(51, 51, 5);
            spatialHashGrid.registerDynamicActor(ball);
            ball = new Ball(51, 51, 5);
            spatialHashGrid.registerDynamicActor(ball);
            colliders = spatialHashGrid.getPotentialColliders(ball);
            expect(colliders.length).toBe(2);

            expect(spatialHashGrid.cellsPerRow).toBe(3);
            expect(spatialHashGrid.cellsPerCol).toBe(3);
        });
    });
});