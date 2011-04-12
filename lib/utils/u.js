var u = {
    extend: function(child, parent) {
        child.prototype = new parent();
        child._super = parent;
        child._super_method = parent.prototype;
        child.prototype.constructor = child;
        return child;
    },
    createCanvas: function(container_id) {

        var canvas = document.createElement('canvas');

        if(container_id) {
            var container = document.getElementById(container_id);
            container.innerHTML = "";
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            container.appendChild(canvas);
        } else {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            document.body.appendChild(canvas);
        }
        return canvas;
    },
    removeCanvas: function(container_id) {
        document.getElementById(container_id).innerHTML = "";
    },
    clamp: function(val, min, max) {
        return val > max ? max : val < min ? min : val;
    },
    map: function(val, from_min, from_max, to_min, to_max) {
        return to_min + (to_max - to_min) * ((val - from_min) / (from_max - from_min));
    },
    max: function(val, arr) {
        var max = arr[0];
        for (var i = 1, n = arr.length; i < n; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        return max;
    },
    min: function(val, arr) {
        var min = arr[0];
        for (var i = 1, n = arr.length; i < n; i++) {
            if (arr[i] < min) {
                min = arr[i];
            }
        }
        return min;
    },
    randFloat: function(min, max) {
        if(!min) {
            return Math.random();
        } else if(!max) {
            return Math.random() * min;
        } else {
            return Math.random() * (max - min) + min;
        }
    },
    randInt: function(min, max) {
        if(!min) {
            return Math.round(Math.random());
        } else if(!max) {
            return Math.round(Math.random() * min);
        } else {
            return Math.round(Math.random() * (max - min) + min);
        }
    },
    TO_RADIANS: Math.PI / 180,
    TO_DEGREES: 180 / Math.PI
}
