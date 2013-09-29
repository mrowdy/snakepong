define(['app/core', 'game/vector2'], function(core, Vector2) {
    return function(){

        var T_VECTORS = [];
        var T_ARRAYS = [];

        var L_VORONOI_REGION = -1;
        var M_VORONOI_REGION =  0;
        var R_VORONOI_REGION =  1;

        var init = function(){
            for (var i = 0; i < 10; i++) {
                T_VECTORS.push(new Vector2());
            }

            for (var i = 0; i < 5; i++) {
                T_ARRAYS.push([]);
            }
        }

        var flattenPointsOn = function(points, normal, result) {
            var min = Number.MAX_VALUE;
            var max = -Number.MAX_VALUE;
            var len = points.length;
            for (var i = 0; i < len; i++ ) {
                var dot = points[i].dot(normal);
                if (dot < min) { min = dot; }
                if (dot > max) { max = dot; }
            }
            result[0] = min; result[1] = max;
        };

        var isSeparatingAxis = function(aPos, bPos, aPoints, bPoints, axis, response) {
            var rangeA = T_ARRAYS.pop();
            var rangeB = T_ARRAYS.pop();

            var offsetV = T_VECTORS.pop().copyFrom(bPos).sub(aPos);
            var projectedOffset = offsetV.dot(axis);

            flattenPointsOn(aPoints, axis, rangeA);
            flattenPointsOn(bPoints, axis, rangeB);

            rangeB[0] += projectedOffset;
            rangeB[1] += projectedOffset;


            if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
                T_VECTORS.push(offsetV);
                T_ARRAYS.push(rangeA);
                T_ARRAYS.push(rangeB);
                return true;
            }

            if (response) {
                var overlap = 0;
                if (rangeA[0] < rangeB[0]) {
                    response.aInB = false;
                    if (rangeA[1] < rangeB[1]) {
                        overlap = rangeA[1] - rangeB[0];
                        response.bInA = false;
                    } else {
                        var option1 = rangeA[1] - rangeB[0];
                        var option2 = rangeB[1] - rangeA[0];
                        overlap = option1 < option2 ? option1 : -option2;
                    }
                } else {
                    response.bInA = false;
                    if (rangeA[1] > rangeB[1]) {
                        overlap = rangeA[0] - rangeB[1];
                        response.aInB = false;
                    } else {
                        var option1 = rangeA[1] - rangeB[0];
                        var option2 = rangeB[1] - rangeA[0];
                        overlap = option1 < option2 ? option1 : -option2;
                    }
                }

                var absOverlap = Math.abs(overlap);
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
            var len2 = line.len2();
            var dp = point.dot(line);
            if (dp < 0) {
                return L_VORONOI_REGION;
            } else if (dp > len2) {
                return R_VORONOI_REGION;
            } else {
                return M_VORONOI_REGION;
            }
        };

        this.testPolygonPolygon = function(a, b, response) {
            var aPoints = a.points;
            var aLen = aPoints.length;
            var bPoints = b.points;
            var bLen = bPoints.length;
            for (var i = 0; i < aLen; i++) {
                if (isSeparatingAxis(a.position, b.position, aPoints, bPoints, a.normals[i], response)) {
                    return false;
                }
            }

            for (var i = 0;i < bLen; i++) {
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

        this.testCircleCircle = function(a, b, response) {
            var differenceV = T_VECTORS.pop().copyFrom(b.position).sub(a.position);
            var totalRadius = a.radius + b.radius;
            var totalRadiusSq = totalRadius * totalRadius;
            var distanceSq = differenceV.len2();
            if (distanceSq > totalRadiusSq) {
                T_VECTORS.push(differenceV);
                return false;
            }
            if (response) {
                var dist = Math.sqrt(distanceSq);
                response.a = a;
                response.b = b;
                response.overlap = totalRadius - dist;
                response.overlapN.copyFrom(differenceV.nor());
                response.overlapV.copyFrom(differenceV).scale(response.overlap);
                response.aInB = a.r <= b.r && dist <= b.r - a.r;
                response.bInA = b.r <= a.r && dist <= a.r - b.r;
            }
            T_VECTORS.push(differenceV);
            return true;
        };

        this.testPolygonCircle = function(polygon, circle, response) {
            var circlePos = T_VECTORS.pop().copyFrom(circle.position).sub(polygon.position);
            var radius = circle.radius;
            var radius2 = radius * radius;
            var points = polygon.points;
            var len = points.length;
            var edge = T_VECTORS.pop();
            var point = T_VECTORS.pop();

            for (var i = 0; i < len; i++) {
                var next = i === len - 1 ? 0 : i + 1;
                var prev = i === 0 ? len - 1 : i - 1;
                var overlap = 0;
                var overlapN = null;

                edge.copyFrom(polygon.edges[i]);
                point.copyFrom(circlePos).sub(points[i]);

                if (response && point.len2() > radius2) {
                    response.aInB = false;
                }

                var region = voronoiRegion(edge, point);
                if (region === L_VORONOI_REGION) {
                    edge.copyFrom(polygon.edges[prev]);
                    var point2 = T_VECTORS.pop().copyFrom(circlePos).sub(points[prev]);
                    region = voronoiRegion(edge, point2);
                    if (region === R_VORONOI_REGION) {
                        var dist = point.len();
                        if (dist > radius) {
                            T_VECTORS.push(circlePos);
                            T_VECTORS.push(edge);
                            T_VECTORS.push(point);
                            T_VECTORS.push(point2);
                            return false;
                        } else if (response) {
                            response.bInA = false;
                            overlapN = point.nor();
                            overlap = radius - dist;
                        }
                    }
                    T_VECTORS.push(point2);
                } else if (region === R_VORONOI_REGION) {
                    edge.copyFrom(polygon.edges[next]);
                    point.copyFrom(circlePos).sub(points[next]);
                    region = voronoiRegion(edge, point);
                    if (region === L_VORONOI_REGION) {
                        var dist = point.len();
                        if (dist > radius) {
                            T_VECTORS.push(circlePos);
                            T_VECTORS.push(edge);
                            T_VECTORS.push(point);
                            return false;
                        } else if (response) {
                            response.bInA = false;
                            overlapN = point.nor();
                            overlap = radius - dist;
                        }
                    }
                } else {

                    var normal = edge.perp().nor();
                    var dist = point.dot(normal);
                    var distAbs = Math.abs(dist);
                    if (dist > 0 && distAbs > radius) {
                        T_VECTORS.push(circlePos);
                        T_VECTORS.push(normal);
                        T_VECTORS.push(point);
                        return false;
                    } else if (response) {

                        overlapN = normal;
                        overlap = radius - dist;
                        if (dist >= 0 || overlap < 2 * radius) {
                            response.bInA = false;
                        }
                    }
                }

                if (overlapN && response && Math.abs(overlap) < Math.abs(response.overlap)) {
                    response.overlap = overlap;
                    response.overlapN.copyFrom(overlapN);
                }
            }

            if (response) {
                response.a = polygon;
                response.b = circle;
                response.overlapV.copyFrom(response.overlapN).scale(response.overlap);
            }

            T_VECTORS.push(circlePos);
            T_VECTORS.push(edge);
            T_VECTORS.push(point);
            return true;
        };

        this.testCirclePolygon = function(circle, polygon, response) {
            var result = this.testPolygonCircle(polygon, circle, response);
            if (result && response) {
                var a = response.a;
                var aInB = response.aInB;
                response.overlapN.reverse();
                response.overlapV.reverse();
                response.a = response.b;
                response.b = a;
                response.aInB = response.bInA;
                response.bInA = aInB;
            }
            return result;
        };

        init();
    }
});