define(['app/core', 'game/math/vector2'], function(core, Vector2) {
    'use strict';

    return function(){

        var T_VECTORS = [];
        var T_ARRAYS = [];

        var L_VORONOI_REGION = -1;
        var M_VORONOI_REGION =  0;
        var R_VORONOI_REGION =  1;

        var i = 0,
            min = 0,
            max = 0,
            len = 0,
            len2= 0,
            dot = 0,
            dp = 0,
            rangeA,
            rangeB,
            offsetV,
            projectedOffset,
            option1, option2,
            overlap = 0,
            absOverlap,
            aPoints,
            bPoints,
            aLen,
            bLen;


        var init = function(){
            for (i = 0; i < 10; i++) {
                T_VECTORS.push(new Vector2());
            }

            for (i = 0; i < 5; i++) {
                T_ARRAYS.push([]);
            }
        };

        var flattenPointsOn = function(points, normal, result) {
            min = Number.MAX_VALUE;
            max = -Number.MAX_VALUE;
            len = points.length;
            for (i = 0; i < len; i++ ) {
                dot = points[i].dot(normal);
                if (dot < min) { min = dot; }
                if (dot > max) { max = dot; }
            }
            result[0] = min; result[1] = max;
        };

        var isSeparatingAxis = function(aPos, bPos, aPoints, bPoints, axis, response) {
            rangeA = T_ARRAYS.pop();
            rangeB = T_ARRAYS.pop();

            offsetV = T_VECTORS.pop().copyFrom(bPos).sub(aPos);
            projectedOffset = offsetV.dot(axis);

            flattenPointsOn(aPoints, axis, rangeA);
            flattenPointsOn(bPoints, axis, rangeB);

            rangeB[0] += projectedOffset;
            rangeB[1] += projectedOffset;

            option1 = false;
            option2 = false;

            if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
                T_VECTORS.push(offsetV);
                T_ARRAYS.push(rangeA);
                T_ARRAYS.push(rangeB);
                return true;
            }

            if (response) {
                overlap = 0;
                if (rangeA[0] < rangeB[0]) {
                    response.aInB = false;
                    if (rangeA[1] < rangeB[1]) {
                        overlap = rangeA[1] - rangeB[0];
                        response.bInA = false;
                    } else {
                        option1 = rangeA[1] - rangeB[0];
                        option2 = rangeB[1] - rangeA[0];
                        overlap = option1 < option2 ? option1 : -option2;
                    }
                } else {
                    response.bInA = false;
                    if (rangeA[1] > rangeB[1]) {
                        overlap = rangeA[0] - rangeB[1];
                        response.aInB = false;
                    } else {
                        option1 = rangeA[1] - rangeB[0];
                        option2 = rangeB[1] - rangeA[0];
                        overlap = option1 < option2 ? option1 : -option2;
                    }
                }

                absOverlap = Math.abs(overlap);
                if (absOverlap < response.overlap) {
                    response.overlap = absOverlap;
                    response.overlapN.copyFrom(axis);
                    if (overlap < 0) {
                        response.overlapN.reverse();
                    }
                }
            }
            T_VECTORS.push(offsetV);
            T_ARRAYS.push(rangeA);
            T_ARRAYS.push(rangeB);
            return false;
        };

        var voronoiRegion = function(line, point) {
            len2 = line.len2();
            dp = point.dot(line);
            if (dp < 0) {
                return L_VORONOI_REGION;
            } else if (dp > len2) {
                return R_VORONOI_REGION;
            } else {
                return M_VORONOI_REGION;
            }
        };

        this.testPolygonPolygon = function(a, b, response) {
            aPoints = a.points;
            aLen = aPoints.length;
            bPoints = b.points;
            bLen = bPoints.length;
            for (i = 0; i < aLen; i++) {
                if (isSeparatingAxis(a.position, b.position, aPoints, bPoints, a.normals[i], response)) {
                    return false;
                }
            }

            for (i = 0;i < bLen; i++) {
                if (isSeparatingAxis(a.position, b.position, aPoints, bPoints, b.normals[i], response)) {
                    return false;
                }
            }

            if (response) {
                response.a = a;
                response.b = b;
                response.overlapV.copyFrom(response.overlapN).scale(response.overlap);
            }
            return true;
        };

        init();
    };
});