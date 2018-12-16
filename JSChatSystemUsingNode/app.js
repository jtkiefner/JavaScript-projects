//Beginning of Express
var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

server.listen(1337);
console.log("The server has started.");
//End of Express

var socketList = [];

class Entity {
    constructor() {
        this.x = 300;
        this.y = 300;
        this.sX = 300;
        this.sY = 300;
        this.id = "";
    }

    update() {
        this.updatePosition();
    }

    updatePosition() {
        this.x += this.sX;
        this.y += this.sY;
    }
}

class Player extends Entity {
    constructor(id) {
        super();
        this.id = id;
        this.pressedRight = false;
        this.pressedLeft = false;
        this.pressedUp = false;
        this.pressedDown = false;
        this.maxSpd = 5;
    }

    update() {
        this.updateSpd();
        super.update();
    }

    updateSpd() {
        if (this.pressedRight)
            this.sX = this.maxSpd;
        else if (this.pressedLeft)
            this.sX = -this.maxSpd;
        else
            this.sX = 0;
        if (this.pressedUp)
            this.sY = -this.maxSpd;
        else if (this.pressedDown)
            this.sY = this.maxSpd;
        else
            this.sY = 0;
    }

}

Player.list = [];

//This is called when a player is connected
Player.onConnect = function (socket) {
    var player = new Player(socket.id);
    Player.list[socket.id] = player;
    socket.on('keyPress', function (data) {
        if (data.inputId === 'left')
            player.pressedLeft = data.state;
        else if (data.inputId === 'right')
            player.pressedRight = data.state;
        else if (data.inputId === 'up')
            player.pressedUp = data.state;
        else if (data.inputId === 'down')
            player.pressedDown = data.state;
    });
}

Player.onDisconnect = function (socket) {
    delete Player.list[socket.id];
}
Player.update = function () {
    var pack = [];
    for (var i in Player.list) {
        var player = Player.list[i];
        player.update();
        pack.push({
            x: player.x,
            y: player.y,
        });
    }
    return pack;
}

var io = require('socket.io')(server, {});
io.sockets.on('connection', function (socket) {
    //Assign a random socket id
    socket.id = Math.random();
    socketList[socket.id] = socket;

    //Instantiate player with that random id
    Player.onConnect(socket)

    //Called when a player disconnects
    socket.on('disconnect', function () {
        delete socketList[socket.id];
        Player.onDisconnect(socket);
    });

    //Chat Room socket
    socket.on('sendMsg', function (data) {
        var playerName = ("PName " + socket.id).slice(0, 10);
        for (var i in socketList) {
            socketList[i].emit('addChat', playerName + ': ' + data);
        }
    });

});

setInterval(function () {
    var pack = {
        player: Player.update()
    }
    for (var i in socketList) {
        var socket = socketList[i];
        socket.emit('newPositions', pack);
    }
}, 40);