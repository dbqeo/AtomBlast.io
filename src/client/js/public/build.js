(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// var GameModule = require('./game.js');
var global = require('./global.js');
var ChatClient = require('./chat-client.js');

var playerName;
var roomName;
var playerNameInput = document.getElementById('playerNameInput');
var roomNameInput = document.getElementById('roomNameInput');
var socket;

//Get screen dimensions
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

function startGame() {
    playerName = playerNameInput.value.replace(/(<([^>]+)>)/ig, '');
    roomName = roomNameInput.value.replace(/(<([^>]+)>)/ig, '');
    document.getElementById('gameAreaWrapper').style.display = 'block';
    document.getElementById('startMenuWrapper').style.display = 'none';

    //Production
    socket = io.connect(global.SERVER_IP, {query: 'room=' + roomName});

    //Debugging and Local serving
    if(socket.id === undefined) {
        console.log('Failed to connect, falling back to localhost');
        socket = io.connect(global.LOCAL_HOST, {query: 'room=' + roomName});
    }
    
    if(socket !== null)
        SetupSocket(socket);
    if(!global.animLoopHandle)
        animloop();
};

// check if nick is valid alphanumeric characters (and underscores)
function validNick() {
    var regex = /^\w*$/;
    // console.log('Regex Test', regex.exec(playerNameInput.value));
    return regex.exec(playerNameInput.value) !== null && regex.exec(roomNameInput.value) !== null;
}

window.onload = function() {
    'use strict';

    var btn = document.getElementById('startButton'),
        nickErrorText = document.querySelector('#startMenu .input-error');

    btn.onclick = function () {

        // check if the nick is valid
        if (validNick()) {
            startGame();
        } else {
            nickErrorText.style.display = 'inline';
        }
    };

    playerNameInput.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;

        if (key === global.KEY_ENTER) {
            if (validNick()) {
                startGame();
            } else {
                nickErrorText.style.display = 'inline';
            }
        }
    });
};

function SetupSocket(socket) {
    //Debug
    console.log('Socket:',socket);

    //Instantiate Chat System
    let chat = new ChatClient({ socket: socket, player: playerName, room: roomName });
    chat.addLoginMessage(playerName, true);
    chat.registerFunctions();

    //Chat system receiver
    socket.on('serverMSG', function (data) {
        chat.addSystemLine(data);
    });

    socket.on('serverSendPlayerChat', function (data) {
        chat.addChatLine(data.sender, data.message, false);
    });

    socket.on('serverSendLoginMessage', function (data) {
        chat.addLoginMessage(data.sender, false);
    });

    //Emit join message
    socket.emit('playerJoin', { sender: chat.player });
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
})();

function animloop(){
    requestAnimFrame(animloop);
}


window.addEventListener('resize', function() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
}, true);

},{"./chat-client.js":2,"./global.js":3}],2:[function(require,module,exports){
var global = require('./global.js');

class ChatClient {

    constructor(params) {
        // this.canvas = params.canvas;
        this.socket = params.socket;
        // this.mobile = params.mobile;
        this.player = params.player;
        var self = this;
        this.commands = {};
        var input = document.getElementById('chatInput');
        input.addEventListener('keypress', this.sendChat.bind(this));
        input.addEventListener('keyup', function(key) {
            input = document.getElementById('chatInput');
            key = key.which || key.keyCode;
            if (key === global.KEY_ESC) {
                input.value = '';
                // self.canvas.cv.focus();
            }
        });
    }

    // TODO: Break out many of these GameControls into separate classes.

    registerFunctions() {
        var self = this;

        this.registerCommand('help', 'Information about the chat commands.', function () {
            self.printHelp();
        });

        // this.registerCommand('login', 'Login as an admin.', function (args) {
        //     self.socket.emit('pass', args);
        // });

        // this.registerCommand('kick', 'Kick a player, for admins only.', function (args) {
        //     self.socket.emit('kick', args);
        // });
        global.chatClient = this;
    }

    // Chat box implementation for the users.
    addChatLine(name, message, me) {
        if (this.mobile) {
            return;
        }
        var newline = document.createElement('li');

        // Colours the chat input correctly.
        newline.className = (me) ? 'me' : 'friend';
        newline.innerHTML = '<b>' + ((name.length < 1) ? global.PLACEHOLDER_NAME : name) + '</b>: ' + message;

        this.appendMessage(newline);
    }

    // Message to notify players when a new player joins
    addLoginMessage(name, me) {
        if (this.mobile) {
            return;
        }
        var newline = document.createElement('li');

        console.log(name + ' joined');
        // Colours the chat input correctly.
        newline.className = 'join';
        newline.innerHTML = '<b>' + ((me) ? '</b>You have' : (name.length < 1) ? global.PLACEHOLDER_NAME : name + '</b> has') + ' joined the room!';

        this.appendMessage(newline);
    }

    // Chat box implementation for the system.
    addSystemLine(message) {
        if (this.mobile) {
            return;
        }
        var newline = document.createElement('li');

        // Colours the chat input correctly.
        newline.className = 'system';
        newline.innerHTML = message;

        // Append messages to the logs.
        this.appendMessage(newline);
    }

    // Places the message DOM node into the chat box.
    appendMessage(node) {
        if (this.mobile) {
            return;
        }
        var chatList = document.getElementById('chatList');
        if (chatList.childNodes.length > 10) {
            chatList.removeChild(chatList.childNodes[0]);
        }
        chatList.appendChild(node);
    }

    // Sends a message or executes a command on the click of enter.
    sendChat(key) {
        var commands = this.commands,
            input = document.getElementById('chatInput');

        key = key.which || key.keyCode;

        if (key === global.KEY_ENTER) {
            var text = input.value.replace(/(<([^>]+)>)/ig,'');
            if (text !== '') {

                // Chat command.
                if (text.indexOf('-') === 0) {
                    var args = text.substring(1).split(' ');
                    if (commands[args[0]]) {
                        commands[args[0]].callback(args.slice(1));
                    } else {
                        this.addSystemLine('Unrecognized Command: ' + text + ', type -help for more info.');
                    }

                // Allows for regular messages to be sent to the server.
                } else {
                    console.log(this.socket);
                    //Debug lines for messages - Remove on production
                    // console.log("This Player: " + this.player);
                    // console.log("This message: " + text);
                    this.socket.emit('playerChat', { sender: this.player, message: text });
                    this.addChatLine(this.player, text, true);
                }

                // Resets input.
                input.value = '';
                // this.canvas.cv.focus();
            }
        }
    }

    // Allows for addition of commands.
    registerCommand(name, description, callback) {
        this.commands[name] = {
            description: description,
            callback: callback
        };
    }

    // Allows help to print the list of all the commands and their descriptions.
    printHelp() {
        var commands = this.commands;
        for (var cmd in commands) {
            if (commands.hasOwnProperty(cmd)) {
                this.addSystemLine('-' + cmd + ': ' + commands[cmd].description);
            }
        }
    }
}

module.exports = ChatClient;
},{"./global.js":3}],3:[function(require,module,exports){
module.exports = {
    
    // Keys and other mathematical constants
    KEY_ESC: 27,
    KEY_ENTER: 13,
    KEY_CHAT: 13,
    KEY_FIREFOOD: 119,
    KEY_SPLIT: 32,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,

    // Canvas
    backgroundColor: '#f2fbff',
    lineColor: '#000000',

    // Chat
    PLACEHOLDER_NAME: 'Unnamed Player',

    // Server
    SERVER_IP: 'https://iogame-test.herokuapp.com/', // Change during production!!!!!
    LOCAL_HOST: 'localhost:3000'
};
},{}]},{},[1]);
