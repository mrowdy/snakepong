require.config({
    baseUrl: 'src'
});

require(["app/core", "game/collision/spatial-hash-grid", "game/item/player"], function(core, SHG, Player) {
    'use strict';

    var spatialHashGrid;
    var player;

    var init = function(){
        var width = 100;
        var height = 100;
        var cellsize = 100/3;

        var spatialHashGrid = new SHG(width, height, cellsize);

        var players = [];
        var player;
        for(var i = 1; i <= 3; i++){
            for(var y = 1; y <= 3; y++){
                player = new Player(i * 100/3 - 100/6, y *100/3 - 100/6, 30, 30);
                players.push(player);
                spatialHashGrid.registerStaticActor(player);
            }
        }

        var colliders;
        for( i = 0; i < 9; i++){
            colliders = spatialHashGrid.getPotentialColliders(players[i]);
            //console.log(colliders);
        }

        player = new Player(51, 51, 5, 5);
        spatialHashGrid.registerDynamicActor(player);
        player = new Player(51, 51, 5, 5);
        spatialHashGrid.registerDynamicActor(player);
        colliders = spatialHashGrid.getPotentialColliders(player);
        //console.log(colliders);

        //console.log(spatialHashGrid.cellsPerRow);
        //console.log(spatialHashGrid.cellsPerCol);
    };
    init();
});