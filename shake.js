//Shake Plugin
(function (window, document) {

    function Shake() {

        //feature detect
        this.hasDeviceMotion = 'ondevicemotion' in window;

        //default velocity threshold for shake to register
        this.threshold = 15;

        //use date to prevent multiple shakes firing
        this.lastTime = new Date();

        //accelerometer values
        this.lastX = null;
        this.lastY = null;
        this.lastZ = null;

        //create custom event
        if (typeof document.CustomEvent === "function") {
            this.event = new document.CustomEvent('shake', {
                bubbles: true,
                cancelable: true
            });
        } else if (typeof document.createEvent === "function") {
            this.event = document.createEvent('Event');
            this.event.initEvent('shake', true, true);
        } else { 
          return false;
        }
    }

    //reset timer values
    Shake.prototype.reset = function () {
        this.lastTime = new Date();
        this.lastX = null;
        this.lastY = null;
        this.lastZ = null;
    };

    //start listening for devicemotion
    Shake.prototype.start = function () {
        this.reset();
        if (this.hasDeviceMotion) { window.addEventListener('devicemotion', this, false); }
    };

    //stop listening for devicemotion
    Shake.prototype.stop = function () {

        if (this.hasDeviceMotion) { window.removeEventListener('devicemotion', this, false); }
        this.reset();
    };

    //calculates if shake did occur
    Shake.prototype.devicemotion = function (e) {

        var current = e.accelerationIncludingGravity,
            currentTime,
            timeDifference,
            deltaX = 0,
            deltaY = 0,
            deltaZ = 0;

        if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {
            this.lastX = current.x;
            this.lastY = current.y;
            this.lastZ = current.z;
            return;
        }

        deltaX = Math.abs(this.lastX - current.x);
        deltaY = Math.abs(this.lastY - current.y);
        deltaZ = Math.abs(this.lastZ - current.z);

        if (((deltaX > this.threshold) && (deltaY > this.threshold)) || ((deltaX > this.threshold) && (deltaZ > this.threshold)) || ((deltaY > this.threshold) && (deltaZ > this.threshold))) {
            //calculate time in milliseconds since last shake registered
            currentTime = new Date();
            timeDifference = currentTime.getTime() - this.lastTime.getTime();

            if (timeDifference > 1000) {
                window.dispatchEvent(this.event);
                this.lastTime = new Date();
            }
        }

        this.lastX = current.x;
        this.lastY = current.y;
        this.lastZ = current.z;

    };

    //event handler
    Shake.prototype.handleEvent = function (e) {

        if (typeof (this[e.type]) === 'function') {
            return this[e.type](e);
        }
    };

    //create a new instance of shake.js.
    var myShakeEvent = new Shake();
    myShakeEvent && myShakeEvent.start();

}(window, document));

(function() {

    var ball = document.getElementsByClassName('ball')[0];
    var answer = document.getElementsByClassName('answer')[0];
    var answerList = ['It is certain', 'It is decidedly so', 'Without a doubt', 'Definitely', 'You may rely on it', 'As I see it, yes','Most likely', 'Outlook good', 'Yes','Signs point to yes','Reply hazy, try again', 'Better not tell you now', 'Cannot predict', 'Concentrate and ask again','Don\'t count on it','No','My sources say No', 'Outlook not so good','Very doubtful'];

    function toggleClass(el, clazz) {
        if(el.className.indexOf(clazz) > 0) {
            el.className = el.className.replace(clazz, "");
        } else {
            el.className += (" " + clazz);
        }
    };
    function shakeBall() {
        ball.className += " shake";
        answer.className = answer.className.replace("shown", "");
        answer.innerHTML = "";
        setTimeout(function() {
            ball.className = ball.className.replace(" shake", "");
            answer.innerHTML = getRandomArrayElement(answerList);
            answer.className += " shown";
            toggleClass(answer, "reverse");
        }, 1000)
    }

    function getRandomArrayElement(arr) {
        var rand = Math.floor((Math.random()*arr.length)+1);
        return arr[rand];
    }
    function bindEvents() {
        ball.addEventListener('click', shakeBall, false);
        window.addEventListener('shake', shakeBall, false);
    };

    bindEvents();
            })();