var count = 0;

function random(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function Seed() {
    this.draw = function (/*Point*/ p, /*boolean*/ shortStem) {
        count++;
        this.neg = count % 2 === 0
        var height = random(10, 50);
        if (shortStem) {
            height = 2;
        }
        p.y += height;
        
        var group = new Group();
        
        /*
         * Draw the small oval at the bottom of the seed
         */
        var size = new Size(4, 10);
        var rectangle = new Rectangle(p, size);
        var bottom = new Path.Oval(rectangle);
        bottom.fillColor = '#d0aa7b';
        group.addChild(bottom);
        
        if (shortStem) {
            p.y -= height;
        }
        
        
        /*
         * Draw the stem of the seed
         */
        var stem = new Path();
        stem.strokeColor = '#567e37';
        stem.strokeWidth = 1;
        
        stem.add(new Point(p.x + 2, p.y));
    
    
        // The point through which we will create the arc:
        var throughPoint = new Point(p.x + 4, p.y - height / 2);
        
        // The point at which the arc will end:
        var toPoint = new Point(p.x + 3, p.y - height);
        
        // Draw an arc through 'throughPoint' to 'toPoint'
        stem.arcTo(throughPoint, toPoint);
        group.addChild(stem);
        
        /*
         * Draw the fluttery parts on the top
         */
        p = toPoint;
        
        for (var i = 0; i < random(6, 8); i++) {
            path = new Path();
            path.strokeColor = '#fff3c9';
            path.strokeWidth = 1;
            
            var p1 = new Point(p.x, p.y);
            
            
            path.add(new Point(p1.x + 2, p1.y + 2));
            
            var y = random(1, 5);
            
            if (i % 2 == 0) {
                // The point through which we will create the arc:
                throughPoint = new Point(p1.x + random(1, 5), p1.y - y);
            
                // The point at which the arc will end:
                toPoint = new Point(p1.x + random(5, 35), p1.y - 20 - y);
            } else {
                // The point through which we will create the arc:
                throughPoint = new Point(p1.x - random(1, 5), p1.y - y);
                
                // The point at which the arc will end:
                toPoint = new Point(p1.x - random(5, 35), p1.y - 20 - y);
            }
            
            // Draw an arc through 'throughPoint' to 'toPoint'
            path.arcTo(throughPoint, toPoint);
            
            group.addChild(path);
            
            circle = new Path.Circle(toPoint, 2);
            circle.fillColor = '#fff3c9';
            
            group.addChild(circle);
        }
        
        this.group = group;
        //group.scale(0.75);
        
        this.position = new Point(this.group.position.x, this.group.position.y + 15);
        
    }
    
    this.move = function(/*Point*/ point) {
        this.group.translate(point);
    }
    
    this.rotate = function(/*int*/ angle) {
        this.group.rotate(angle, this.position);//, view.center);//new Point(this.group.position - 15, this.group.position.y));
    }
    
    this.roateMove = function(/*int*/ angle) {
        if (this.group.position.x < 850 && this.group.position.y < 650) {
            var offset = random(25, 175);
            var neg = random(0, 2) % 2 == 0;
            if (neg) {
                this.group.rotate(angle, new Point(this.group.position.x - offset, this.group.position.y + offset));
            } else {
                this.group.rotate(angle, new Point(this.group.position.x + offset, this.group.position.y + offset));
            }
        } else {
            /*
             * Then it is off the screen
             */
            this.isOffScreen = true
        } 
    }
    
    this.isOffscreen = function() {
        return this.isOffScreen;
    }
    
    this.scale = function(/*double*/ scale) {
        this.group.scale(scale);
    }
}

var seeds = [];
var seedCount = 0;
var started = false;

jQuery(document).ready(function() {
    var group = new Group();
    
    var path = new Path();
    path.strokeColor = '#567e37';
    path.strokeWidth = 5;
    
    var firstPoint = new Point(0, 550);
    path.add(firstPoint);
    
    // The point through which we will create the arc:
    var throughPoint = new Point(75, 275);
    
    // The point at which the arc will end:
    var toPoint = new Point(100, 100);
    
    // Draw an arc through 'throughPoint' to 'toPoint'
    path.arcTo(throughPoint, toPoint);
    group.addChild(path);
    
    var bulb = new Path.Circle(toPoint, 10);
    bulb.fillColor = '#567e37';
    group.addChild(bulb);
    
    //var topLeft = new Point(130, 465);
    //data.seed = new Seed()
    //data.seed.draw(topLeft);
    //return;
    //seed.move(new Point(-100, -100));
    //seed.rotate(90);
    
    //group.translate(new Point(200, -200));
    
    var angle = 360 / bulb.length;
    
    for (var i = 0; i < bulb.length; i++) {
        var seed = new Seed()
        seed.draw(bulb.getPointAt(i));
        seed.rotate(i * angle);
        seeds.push(seed);
    }
    
    for (var i = 0; i < 18; i++) {
        var seed = new Seed()
        var point = new Point(toPoint.x + random(-3, 3),
                              toPoint.y + random(-3, 3));
        seed.draw(new Point(toPoint), true);
        seed.rotate(random(0, 360));
        seeds.push(seed);
    }
    
    setTimeout(start, 3000);
    start();
});

function start() {
    started = true;
    
    var id = setInterval(function() {
        seedCount++;
        //console.log("seedCount: " + seedCount);
        if (seedCount === seeds.length - 1) {
            clearInterval(id);
        }
    }, 250);
    
    //clearInterval(id);
}

function onMouseUp(event) {
    //start();
    started = !started;
}

function onFrame(event) {
    if (started) {
        var stillRunning = false;
        
        for (var i = 0; i < seeds.length; i++) {
            if (i < seedCount && !seeds[i].isOffscreen()) {
                stillRunning = true;
                seeds[i].roateMove(4);
            }
        }
        
        if (!stillRunning) {
            started = false;
        }
    }
}
