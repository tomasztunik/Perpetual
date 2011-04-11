var geo = {};

(function(){
    
    function Point(x, y) {
        this.x = x;
        this.y = y;
    };
    
    Point.distanceFromPoint = function(point) {
        return Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2));
    }
    
    function Line(start, end) {
        this.start = { x: start.x, y: start.y };
        this.end = { x: end.x, y: end.y };
    }
    
    function Rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
    }
    
    function Circle(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        return this;
    }
    
    geo.point = Point;
    geo.line = Line;
    geo.rect = Rect;
    geo.circle = Circle;
    
})();
