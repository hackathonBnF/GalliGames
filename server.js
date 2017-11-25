var port = 8088;
var request = require('request');
const { execSync } = require('child_process');
var io = require('socket.io')(port);

var questions = {};

function getRandomInt(min, max) {
    //The maximum is exclusive and the minimum is inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function makeQuestion(socket) {
    var str = execSync('python maker.py')
    var d = JSON.parse(str);
    questions[socket.id] = {
        good: d.good,
    };
    d.good = null;
    socket.emit('question', d);
}

io.on('connection', (socket) => {
    console.log('user connected');
    makeQuestion(socket);
    socket.on('answer', (id) => {
        if (questions[socket.id]) {
            if (id == questions[socket.id].good.id) {
                socket.emit('result', true);
            } else {
                socket.emit('result', false, questions[socket.id].good.title);
            }
        }
    });
    socket.on('ask', () => {
        makeQuestion(socket);
    });
    socket.on('disconnect', () => {
        io.emit('user disconnected');
        console.log('user disconnected');
    });
});

console.log('listening on ' + port);
