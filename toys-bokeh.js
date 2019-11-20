/**
 * Toys
 *
 * $author       Richard Bultitude
 * $email        richard.bultitude@gmail.com
 * $url          http://www.point-b.co.uk/
 * $copyright    Copyright (c) 2015, point-b.co.uk. All rights reserved.
 *
 * $notes        Could be used as pitch circles
 */

define(['p5'], function(p5) {
    'use strict';

    var thisSketch;
    var thisSketchSound;
    var circleImage;
    var soundFile;

    var myp5 = new p5(function(sketch) {
        thisSketch = sketch;
        mySketch();
    },'bokeh');

    function mySketch() {
        thisSketch.setup = setup;
        thisSketch.draw = draw;
        //handleClick();

        //set vars
        var frameRate = 30;
        var offsetHeight = 150;
        var offsetWidth = 220;
        var totalCirles = 100;
        var circles = [];
        var index = 1;
        var timeMillis = 0;
        var changePos = document.getElementById('change-pos');
        var switchModeBtn = document.getElementById('switch-mode-btn');
        var clickMode = 'add';

        function setup() {
            //canvas
            var myCanvas = thisSketch.createCanvas(600, 300);
            myCanvas.parent('bokeh');
            thisSketch.frameRate(frameRate);

            //inits
            switchModeFn();

            // create a SoundFile
            console.log('thisSketchSound', thisSketchSound);
            //soundFile = p5.loadSound( ['/sounds/emb_samp.mp3'] );

            //create circles
            for (var i = 0; i < totalCirles; i++) {
                var circle = new Circle(thisSketch.random(0, thisSketch.width), thisSketch.random(0, thisSketch.height), i);
                circles.push(circle);
            }
            //bg
            thisSketch.background(0, 0, 0);
            //events
            switchModeBtn.addEventListener('click', switchModeFn);
            changePos.addEventListener('click', changeAllPos, false);

            //functions
            function newCircle() {
                var newCircle = new Circle(thisSketch.mouseX, thisSketch.mouseY, circles.length + 1);
                circles.push(newCircle);
                // play the sound file
                soundFile.play();
            }
            function delCircle() {
                for (var k = 0; k < circles.length; k++) {
                    var thisCircX = circles[k].posX;
                    var thisCircY = circles[k].posY;
                    var thisCircSize = circles[k].outerCircSize;
                    var thisCircHalf = thisCircSize / 2;
                    //create ranges
                    var thisCircXL = Math.round(thisCircX - thisCircHalf);
                    var thisCircYT = Math.round(thisCircY - thisCircHalf);
                    var thisCircXR = Math.round(thisCircX + thisCircHalf);
                    var thisCircYB = Math.round(thisCircY + thisCircHalf);
                    var rangeX = thisCircXR - thisCircXL;
                    
                    for (var j = thisCircXL; j < thisCircXR; j++) {
                        if (j === Math.round(thisSketch.mouseX)) {
                            for (var i = thisCircYT; i < thisCircYB; i++) {
                                if (i === Math.round(thisSketch.mouseY)) {
                                    circles.splice(k, 1);
                                }
                            }
                        }
                    }
                };
                //circles.shift();
            }
            function changeAllPos() {
                var register = circles[1].changePos(0,0);
                for (var i = 0; i < circles.length; i++) {
                    circles[i].changePos(thisSketch.random(0, thisSketch.width), thisSketch.random(0, thisSketch.height));
                }
            }
            function switchModeFn() {
                if (clickMode === 'add') {
                    clickMode = 'del';
                    switchModeBtn.innerHTML = 'Delete Mode';
                    document.addEventListener('click', delCircle);
                    document.removeEventListener('click', newCircle);
                }
                else {
                    clickMode = 'add';
                    switchModeBtn.innerHTML = 'Add Mode';
                    document.addEventListener('click', newCircle);
                    document.removeEventListener('click', delCircle);
                }
            }

        }

        function draw() {
            index++;
            timeMillis = thisSketch.millis();

            //add title
            thisSketch.background(0, 0, 0);
            thisSketch.textSize(20);
            thisSketch.fill(255, 255, 255);
            thisSketch.noStroke();
            thisSketch.text('Bokeh', 10, 25);
            
            //update & paint
            for (var i = 0; i < circles.length; i++) {
                circles[i].update();
                circles[i].paint();
            };
            //console.log('circles', circles.length);
        }

        function Circle(x, y, id) {
            this.id = id;
            this.posX = x;
            this.posY = y;
            //this.alpha = 0.001;
            this.timeDivide = thisSketch.random(1000,10000);
            this.wrapperCircle = thisSketch.random(40, 60)
            this.outerCircSize = thisSketch.random(20, 50);
            this.innerCircSize = thisSketch.random(10, 20);
            this.colour = {r: thisSketch.random(200,250), g: thisSketch.random(133,183), b: thisSketch.random(7,57)};
        }
        Circle.prototype.update = function() {
            this.alpha = Math.abs(thisSketch.sin(timeMillis/this.timeDivide)) * 75;
            this.newPosX = this.posX + thisSketch.sin(timeMillis/1000);
            this.newPosY = this.posY - thisSketch.sin(timeMillis/1000);
        };
        Circle.prototype.paint = function() {
            thisSketch.noStroke();
            //wrapper circle
            thisSketch.fill(230, 163, 7, this.alpha);
            thisSketch.ellipse(this.newPosX, this.newPosY, this.wrapperCircle, this.wrapperCircle);
            //outer circle
            thisSketch.fill(this.colour.r, this.colour.g, this.colour.b, this.alpha);
            thisSketch.ellipse(this.newPosX, this.newPosY, this.outerCircSize, this.outerCircSize);
            //inner circle
            thisSketch.fill(255, 255, 255, this.alpha);
            thisSketch.ellipse(this.newPosX, this.newPosY, this.innerCircSize, this.innerCircSize);
            //console.log(this);
        };
        Circle.prototype.changePos = function(x, y) {
            this.posX = x;
            this.posY = y;

            return 'changePos';
        }
    }
});