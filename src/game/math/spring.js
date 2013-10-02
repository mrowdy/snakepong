define(['app/core', 'game/math/vector2'], function(core, Vector2) {
    return  function(actor1, actor2, constant, damping, length) {

        this.constant = constant;
        this.damping = damping;
        this.length = length;
        this.actor1 = actor1;
        this.actor2 = actor2;
        this.on = true;

        var currentLength = function() {
            return actor1.position.distance(actor2.position);
        }

        this.update = function() {
            var actor1 = this.actor1;
            var actor2 = this.actor2;

            if (!(this.on && (!actor1.statoc || !actor2.static))){
                return this;
            }

            var a2b = new Vector2(actor1.position).sub(actor2.position);
            var d = a2b.len();

            if (d === 0) {
                a2b.clear();
            } else {
                a2b.div(d);
            }

            var fspring = -1 * (d - this.length) * this.constant;

            var va2b = new Vector2(actor1.velocity).sub(actor2.velocity);

            var fdamping = -1 * this.damping * va2b.dot(a2b);

            var fr = fspring + fdamping;

            a2b.mul(fr);

            //if (!actor1.static) {
                //actor1.addForce(a2b);
            //}
            if (!actor2.static) {
                actor2.addForce(a2b.reverse());
            }

            return this;
        }

        this.resting = function() {

            var actor1 = this.actor1;
            var actor2 = this.actor2;
            var length = this.length;

            return !this.on || (actor1.static && actor2.static)
                || (actor1.static && (length === 0 ? actor2.position.equals(actor1.position) : actor2.position.distance(actor1.position) <= length) && actor2.resting())
                || (actor2.static && (length === 0 ? actor1.position.equals(actor2.position) : actor1.position.distance(actor2.position) <= length) && actor1.resting());

        }
    }
});