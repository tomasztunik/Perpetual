function Timer(obj_ref, update_interval) {
    
    var MAX_FPS = 60;
    
    this.interval = (update_interval || 20) / 1000; // defaults to 20ms logic update loop interval
    this.accured_time = 0;
    this.prev_time = +new Date() / 1000;
    
    this.time = 0;
    
    this.target = obj_ref;
    
    if(!window.requestAnimFrame) {
        // fix requestAnimationFrame
        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback, element) {
                    window.setTimeout(callback, 1000 / MAX_FPS);
                };
        })();
    }
    
    this.start();
};

Timer.prototype.stop = function() {
    this.last_update = 0;
    this.accured_time = 0;
    this.running = false;
};

Timer.prototype.start = function() {
    this.running = true;
    this.tick();
};

Timer.prototype.tick = function() {
    var self = this,
        interval = this.interval,
        target = this.target,
        tick = function() {
            if(self.running) {
                if (requestAnimFrame) {
                    
                    var cur_time = +new Date() / 1000,
                        time_change = cur_time - self.prev_time;
                        
                    self.accured_time += time_change;
                    self.time += time_change;
                    self.prev_time = cur_time;
                    
                    
                    while (self.accured_time >= interval) {
                        var i = 0;
                        
                        self.accured_time -= interval;
                        target.update(interval, self.time - self.accured_time);
                        
                    }
                    
                    target.render();
            
                    requestAnimFrame(tick);
                }
                
            }   
        };
        
    tick();
    
};
