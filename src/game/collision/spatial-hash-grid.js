define(['game/math/vector2', 'game/collision/cell'], function(Vector2, Cell) {
    'use strict';

    return function(width, height, cellsize){

        this.width = width;
        this.height = height;
        this.cellsize = cellsize;
        this.cellsPerRow = Math.ceil(width / this.cellsize);
        this.cellsPerCol = Math.ceil(height / this.cellsize);
        this.numCells = this.cellsPerRow * this.cellsPerCol;

        this.dynamic = new Array(this.numCells);
        this.static = new Array(this.numCells);

        this._CELL_IDS = new Array(4);
        this._FOUND_OBJECTS = [];

        var i = 0, j = 0, len = 0,
            cellId = -1,
            collider,
            bottomLeft = new Vector2(),
            topRight = new Vector2(),
            x1, x2,
            y1, y2,
            actorIndex,
            y1CellsPerRow,
            y2CellsPerRow;

        for(i = 0; i < this.numCells; i++){
            this.dynamic[i] = new Cell();
            this.static[i] = new Cell();
        }

        this.clearDynamic = function(){
            for(i = 0; i < this.numCells; i++){
                this.dynamic[i].clear();
            }
        };

        this.clearStatic = function(){
            for(i = 0; i < this.numCells; i++){
                this.static[i].clear();
            }
        };

        this.reset = function(){
            for(i = 0; i < this.numCells; i++){
                this.dynamic[i].clear();
                this.static[i].clear();
            }
        };

        this.registerDynamicActor = function(actor){
            this.getCellIds(actor);
            i = 0;
            while(i <= 3 && (cellId = this._CELL_IDS[i++]) !== -1){
                this.dynamic[cellId].add(actor);
            }
        };

        this.registerStaticActor = function(actor){
            this.getCellIds(actor);
            i = 0;
            while(i <= 3 && (cellId = this._CELL_IDS[i++]) !== -1){
                this.static[cellId].add(actor);
            }
        };

        this.unregistActor = function(actor){
            this.getCellIds(actor);
            i = 0;
            while(i <= 3 && (cellId = this._CELL_IDS[i++]) !== -1){
                this.dynamic[cellId].remove(actor);
                this.static[cellId].remove(actor);
            }
        };

        this.getCellIds = function(actor){

            this._CELL_IDS = new Array(4);

            bottomLeft = actor.bounds.getBottomLeft();
            topRight = actor.bounds.getTopRight();

            x1 = Math.floor(bottomLeft.x / cellsize);
            y1 = Math.floor(bottomLeft.y / cellsize);
            x2 = Math.floor(topRight.x / cellsize);
            y2 = Math.floor(topRight.y / cellsize);
            i = 0;

            if(x1 === x2 && y1 === y2){
                if(x1 >= 0 && x1 < this.cellsPerRow && y1 >= 0 && y1 < this.cellsPerCol){
                    this._CELL_IDS[0] = x1 + y1 * this.cellsPerRow;
                } else {
                    this._CELL_IDS[0] = -1;
                }
                this._CELL_IDS[1] = -1;
                this._CELL_IDS[2] = -1;
                this._CELL_IDS[3] = -1;
            } else if (x1 === x2){
                i = 0;
                if(x1 >= 0 && x1 < this.cellsPerRow){
                    if(y1 >= 0 && y1 < this.cellsPerCol){
                        this._CELL_IDS[i++] = x1 + y1 * this.cellsPerRow;
                    }
                    if(y2 >= 0 && y2 < this.cellsPerCol){
                        this._CELL_IDS[i++] = x1 + y2 * this.cellsPerRow;
                    }
                }
                while(i <= 3){
                    this._CELL_IDS[i++] = -1;
                }
            } else if(y1 === y2){
                i = 0;
                if(y1 >= 0 && y1 < this.cellsPerCol){
                    if(x1 >= 0 && x1 < this.cellsPerRow){
                        this._CELL_IDS[i++] = x1 + y1 * this.cellsPerRow;
                    }
                    if(x2 >= 0 && x2 < this.cellsPerRow){
                        this._CELL_IDS[i++] = x2 + y1 * this.cellsPerRow;
                    }
                }
                while(i <= 3){
                    this._CELL_IDS[i++] = -1;
                }
            } else {
                i = 0;
                y1CellsPerRow = y1 * this.cellsPerRow;
                y2CellsPerRow = y2 * this.cellsPerRow;

                if(x1 >= 0 && x1 < this.cellsPerRow && y1 >= 0 && y1 < this.cellsPerCol){
                    this._CELL_IDS[i++] = x1 + y1CellsPerRow;
                }

                if(x2 >= 0 && x2 < this.cellsPerRow && y1 >= 0 && y1 < this.cellsPerCol){
                    this._CELL_IDS[i++] = x2 + y1CellsPerRow;
                }

                if(x2 >= 0 && x2 < this.cellsPerRow && y2 >= 0 && y2 < this.cellsPerCol){
                    this._CELL_IDS[i++] = x2 + y2CellsPerRow;
                }

                if(x1 >= 0 && x1 < this.cellsPerRow && y2 >= 0 && y2 < this.cellsPerCol){
                    this._CELL_IDS[i++] = x1 + y2CellsPerRow;
                }
                while(i <= 3){
                    this._CELL_IDS[i++] = -1;
                }
            }
        };

        this.getPotentialColliders = function(actor){
            this._FOUND_OBJECTS = [];
            this.getCellIds(actor);
            i = 0;
            while(i <= 3 && (cellId = this._CELL_IDS[i++]) !== -1){
                len = this.dynamic[cellId].size();
                for(j = 0; j < len; j++){
                    collider = this.dynamic[cellId].get(j);
                    if(this._FOUND_OBJECTS.indexOf(collider) === -1){
                        this._FOUND_OBJECTS.push(collider);
                    }
                }

                len = this.static[cellId].size();
                for(j = 0; j < len; j++){
                    collider = this.static[cellId].get(j);
                    if(this._FOUND_OBJECTS.indexOf(collider) === -1){
                        this._FOUND_OBJECTS.push(collider);
                    }
                }
            }

            actorIndex = this._FOUND_OBJECTS.indexOf(actor);
            if(actorIndex !== -1){
                this._FOUND_OBJECTS.splice(actorIndex, 1);
            }

            return this._FOUND_OBJECTS;
        };
    };
});