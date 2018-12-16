var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var imageObj = new Image();
imageObj.onload = function () {
    context.drawImage(imageObj, 0, 0);
};
imageObj.src = 'http://hugoware.net/resource/images/misc/game-background.jpg';


var frameCounter = 0;
var ground = 390;
var prevX = 0;
var prevY = 0;
var offGroundCount = 0;
var leftFrameCounter = 0;
var counterSpeed = 3;
var shootCounter = 25;
var jumpCount = 5;

class Tube {
    constructor(x, y) {
        this.image = new Image();
        this.image.src = "tube.png";
        this.x = x;
        this.h = 400;
        this.w = 55;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
    }

    update() {
        this.rememberState();
    }

    rememberState(){
        this.prevX = this.x;
        this.prevY = this.y;
    }
}

class Mario {
    constructor(x, y) {
        this.h = 95;
        this.w = 60;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = "mario1.png";
        this.vertVel = -4;
        this.facingRight = true;
        this.victoryFlag = false;
        this.touchedTop = false;
    }

    move(dx, dy) {
        this.dest_x = this.x + dx;
        if (this.dest_x === undefined)
            return;
        if (this.x < this.dest_x)
            this.x += 3;
        else if (this.x > this.dest_x)
            this.x -= 3;
        if (this.y < this.dest_y)
            this.y++;
        else if (this.y > this.dest_y)
            this.y--;

    }

    update() {
        //console.log("Mario's y: " + this.y);
        console.log("Mario's x: " + this.x);
        this.y -= this.vertVel;
        if (this.y > 300) {
            this.vertVel = 0;
            this.touchTop = false;
        }
        else
            this.vertVel = -4;

    }

    jump(dx, dy) {
        this.x += dx;
        this.y += dy;

    }

    marioTurtify() {
        this.image.src = "turtle.png";
        console.log("LOL!!!");
        // this.x = 0;
        // this.y = 100;
    }

    victoryMario() {
        this.victoryFlag = true;
        this.image.src = "sadLuigi.png";
        this.y = ground - 80;
    }
}

class Goomba {
    constructor(x, y) {
        this.h = 60;
        this.x = x;
        this.y = y;
        this.w = 50;
        this.defaultHP = 20;
        this.isDead = false;
        this.onFire = false;
        this.image = new Image();
        this.image.src = "GoombaRes.png";
        this.horizVel = 1;
    }

    update() {
        this.x += this.horizVel;
    }

    goombaGetOut() {
        this.horizVel *= -1;
    }

    goombaFire() {
        this.image.src = "GoombaResFIRE.png";
        this.onFire = true;
    }

    goombaLife() {
        if (this.onFire) {
            this.defaultHP--;
        }
        return this.defaultHP;
    }
}


class Fireball {
    constructor(x, y) {
        this.y = y;
        this.w = 47;
        this.h = 47;
        this.x = x;
        this.vertVel = 5;
        this.horizVel = 3;
        this.image = new Image();
        this.image.src = "fireball.png"
    }

    update() {
        this.x += this.horizVel;
        this.y += this.vertVel;

        if ((this.y + this.h >= 400 && this.vertVel > 0) || (this.y <= 300 && this.vertVel < 0)) {
            this.vertVel *= -1;
        }
    }

    changeDirection() {
        this.horizVel *= -1;
    }

}

class BossAbby {
    constructor(x, y) {
        this.x = x;
        this.h = 140;
        this.y = y - this.h;
        this.w = 122;
        this.image = new Image();
        this.image.src = "Bowser.png";
    }

    update() {
        //do nothing
    }

    deadBowser() {
        this.image.src = "mariopeach.png";
        this.y = ground - 95;
    }
}


//Model-View-Controller-Game below
function Model() {

    var marioHeight = 95;
    var gumbaHeight = 60;


    this.sprites = [];
    this.mario = new Mario(100, ground - marioHeight);
    this.sprites.push(this.mario);
    this.sprites.push(new Tube(200, ground - 150));
    this.sprites.push(new Tube(600, ground - 250));
    this.sprites.push(new Tube(1000, ground - 175));
    this.sprites.push(new Tube(1600, ground - 150));
    this.goomba = new Goomba(300, ground - gumbaHeight);
    this.sprites.push(this.goomba);
    this.sprites.push(new Goomba(400, ground - gumbaHeight));
    this.sprites.push(new Goomba(700, ground - gumbaHeight));
    this.bowser = new BossAbby(1300, ground + 15);
    this.sprites.push(this.bowser);

}

Model.prototype.animate = function () {

    //Animation for when mario is facing right
    if (frameCounter == counterSpeed && this.mario.victoryFlag == false) {
        leftFrameCounter = 0;
        this.mario.image.src = "mario2.png";
    }
    else if (frameCounter == (counterSpeed * 2) && this.mario.victoryFlag == false) {
        this.mario.image.src = "mario3.png";
    }
    else if (frameCounter == (counterSpeed * 3) && this.mario.victoryFlag == false) {
        this.mario.image.src = "mario4.png";
    }
    else if (frameCounter == (counterSpeed * 4) && this.mario.victoryFlag == false) {
        this.mario.image.src = "mario5.png"
    }
    else if (frameCounter == (counterSpeed * 5) && this.mario.victoryFlag == false) {
        this.mario.image.src = "mario1.png";
        frameCounter = 0;
    }

    //Animation for when mario is facing left
    if (leftFrameCounter == counterSpeed && this.mario.victoryFlag == false) {
        frameCounter = 0;
        this.mario.image.src = "Lmario2.png";
    }
    else if (leftFrameCounter == (counterSpeed * 2) && this.mario.victoryFlag == false) {
        this.mario.image.src = "Lmario3.png";
    }
    else if (leftFrameCounter == (counterSpeed * 3) && this.mario.victoryFlag == false) {
        this.mario.image.src = "Lmario4.png";
    }
    else if (leftFrameCounter == (counterSpeed * 4) && this.mario.victoryFlag == false) {
        this.mario.image.src = "Lmario5.png"
    }
    else if (leftFrameCounter == (counterSpeed * 5) && this.mario.victoryFlag == false) {
        this.mario.image.src = "Lmario1.png";
        leftFrameCounter = 0;
    }
};

Model.prototype.rememberState = function () {
    prevX = this.mario.x;
    prevY = this.mario.y;
};


Model.prototype.update = function () {
    this.rememberState();
    this.animate();
    for (let i = 0; i < this.sprites.length; i++) {
        this.sprites[i].update();

        //Automatically moves the view
        // if (this.sprites[i] instanceof Mario) {
        //     continue;
        // }
        // else
        //     this.sprites[i].x--;
    }

    for (let i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i] instanceof Tube) {
            let t = this.sprites[i];
            this.goombaCollide(t);
            if (this.doesCollide(this.mario.x, this.mario.y, this.mario.w, this.mario.h, t.x, t.y, t.w, t.h)) {
                console.log("Colliding");
                this.marioTubeCollide(t);
            }
            else
                this.fireBallCollide(t);
        }
        else if (this.sprites[i] instanceof Fireball) {
            let f = this.sprites[i];
            this.goombaFireCollide(f);
            this.bowserFire(f);
        }
        else if (this.sprites[i] instanceof Goomba) {
            let g = this.sprites[i];
            if (this.doesCollide(g.x, g.y, g.w, g.h, this.mario.x, this.mario.y, this.mario.w, this.mario.h)) {
                this.mario.marioTurtify();
            }
        }
    }
};

Model.prototype.bowserFire = function (f) {
    for (let i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i] instanceof BossAbby) {
            if (this.doesCollide(this.sprites[i].x, this.sprites[i].y, this.sprites[i].w, this.sprites[i].h, f.x, f.y, f.w, f.w)) {
                this.sprites[i].deadBowser();
                this.mario.victoryMario();
            }
        }
    }
}


Model.prototype.goombaFireCollide = function (f) {
    for (let i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i] instanceof Goomba) {
            if (this.doesCollide(this.sprites[i].x, this.sprites[i].y, this.sprites[i].w, this.sprites[i].h, f.x, f.y, f.w, f.h)) {
                this.sprites[i].goombaFire();
                let hp = this.sprites[i].goombaLife();
                if (hp === 0) {
                    this.sprites.splice(i, 1);
                }
            }
        }
    }
}


Model.prototype.goombaCollide = function (t) {
    for (let i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i] instanceof Goomba) {
            if (this.doesCollide(this.sprites[i].x, this.sprites[i].y, this.sprites[i].w, this.sprites[i].h, t.x, t.y, t.w, t.h)) {
                this.sprites[i].goombaGetOut();
            }
        }
    }
}


Model.prototype.move = function (dx, dy) {
    this.mario.move(dx, dy);

    // for (let i = 0; i < this.sprites.length; i++) {
    //     if (this.sprites[i] instanceof Mario) {
    //         continue;
    //     }
    //
    //     else if (this.sprites[i] instanceof Tube) {
    //         let t = this.sprites[i];
    //         //console.log("Tube's x: " + t.x);
    //         // console.log("Mario's y: " + this.mario.y)
    //         // console.log("Mario's y: " + t.y)
    //         if (this.mario.collisionFlagLeft && dx > 0) {
    //             dx = 0;
    //         }
    //         else if (this.mario.collisionFlagLeft && dx < 0) {
    //             this.mario.collisionFlagLeft = false;
    //             this.sprites[i].x += 3;
    //         }
    //         else if (this.mario.collisionFlagRight && dx < 0) {
    //             dx = 0;
    //         }
    //         else if (this.mario.collisionFlagRight && dx > 0) {
    //             this.mario.collisionFlagRight = false;
    //             this.sprites[i].x -= 3;
    //         }
    //     }
    //     if (dx > 0) {
    //         this.sprites[i].x -= 3;
    //     }
    //     else if (dx < 0)
    //         this.sprites[i].x += 3;


    //}
};

Model.prototype.jump = function (dx, dy) {
    this.mario.jump(dx, dy);
};

Model.prototype.doesCollide = function (x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x1 + w1 < x2)
        return false;
    if (x1 > x2 + w2)
        return false;
    if (y1 + h1 < y2)
        return false;
    if (y1 > y2 + h2)
        return false;
    return true;

};

Model.prototype.xChecker = function(t){
    if(this.mario.x < (t.x + t.w) && t.x < this.mario.x){
        return true;
    }
    else
        return false;
}


Model.prototype.marioTubeCollide = function (t) {
    console.log("Tube's x: " + t.x);
    if ((t.x - this.mario.x) > 10 && this.mario.y + this.mario.w > t.y) {
        this.mario.x = t.x - this.mario.w - 4;
        console.log("Left triggered");
    }

    //Mario approaching from top of the tube
    else if (this.mario.y + this.mario.h >= t.y && prevY < t.y - this.mario.h) {

        this.mario.y = t.y - this.mario.h - 4;
        offGroundCount = 0;
        this.mario.vertVel = 0;
        console.log("Mario top");
    }

    //Mario approaching from bottom of the tube
    else if (this.mario.y <= t.y + t.h && prevY > t.y + t.h) {
        this.mario.y = t.y + t.h + 4;
    }
    else if (this.mario.x < (t.x + t.w) && this.mario.y + this.mario.w > t.y) {
        this.mario.x = t.x + this.mario.w + 4;
        console.log("Right triggered");
    }
};

Model.prototype.addFireball = function () {
    if (this.mario.facingRight) {
        this.fireball = new Fireball(this.mario.x + 47, this.mario.y);
        this.sprites.push(this.fireball);
    }
    else {
        this.fireball = new Fireball(this.mario.x - 47, this.mario.y);
        this.sprites.push(this.fireball);
    }

    if (leftFrameCounter >= counterSpeed) {
        this.fireball.changeDirection();
    }

};


Model.prototype.fireBallCollide = function (t) {
    for (let i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i] instanceof Fireball) {
            let f = this.sprites[i];
            if (this.doesCollide(f.x, f.y, f.w, f.h, t.x, t.y, t.w, t.h)) {
                this.sprites.splice(i, 1);
            }
        }
    }
};

function View(model) {
    this.model = model;
    this.canvas = document.getElementById("myCanvas");
}

View.prototype.update = function () {
    let leftOffset = 100;
    let ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, 800, 500);
    imageObj.onload();
    for (let i = 0; i < this.model.sprites.length; i++) {
        let sprite = this.model.sprites[i];
        ctx.drawImage(sprite.image, sprite.x - this.model.mario.x, sprite.y);
    }
};


function Controller(model, view) {
    this.model = model;
    this.view = view;
    this.key_right = false;
    this.key_left = false;
    this.key_space = false;
    this.key_ctrl = false;
    let self = this;
    document.addEventListener('keydown', function (event) {
        self.keyDown(event);
    }, false);
    document.addEventListener('keyup', function (event) {
        self.keyUp(event);
    }, false);
}


Controller.prototype.keyDown = function (event) {
    if (event.keyCode == 39) this.key_right = true;
    else if (event.keyCode == 37) this.key_left = true;
    else if (event.keyCode == 32) this.key_space = true;
    else if (event.keyCode == 17) this.key_ctrl = true;

};

Controller.prototype.keyUp = function (event) {
    if (event.keyCode == 39) this.key_right = false;
    else if (event.keyCode == 37) this.key_left = false;
    else if (event.keyCode == 32) this.key_space = false;
    else if (event.keyCode == 17) this.key_ctrl = false;
};

Controller.prototype.update = function () {
    let dx = 0;
    let dy = 0;
    let space = 0;
    let ctrl = 0;
    shootCounter--;
    jumpCount--;
    if (this.key_right) {
        frameCounter++;
        dx++;
        this.model.mario.facingRight = true;
    }
    if (this.key_left) {
        dx--;
        leftFrameCounter++;
        this.model.mario.facingRight = false;
    }
    if (this.key_space) {
        space -= 100;
    }
    if (this.key_ctrl) {
        ctrl++;
    }

    if (space != 0 && jumpCount <= 0) {
        this.model.jump(dx, space);
        jumpCount = 5;
    }

    if (dx != 0 || dy != 0) {
        this.model.move(dx, dy);
    }

    if (ctrl != 0 && shootCounter <= 0) {
        this.model.addFireball();
        shootCounter = 25;
    }
};


function Game() {
    this.model = new Model();
    this.view = new View(this.model);
    this.controller = new Controller(this.model, this.view);
}

Game.prototype.onTimer = function () {
    this.model.update();
    this.controller.update();
    this.view.update();
};

let game = new Game();
let timer = setInterval(function () {
    game.onTimer();
}, 30);

