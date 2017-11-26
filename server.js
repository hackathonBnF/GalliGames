var port = 8088;
const { execSync } = require('child_process');
var io = require('socket.io')(port);

function getRandomInt(min, max) {
    min = Math.ceil(min); // inclusive
    max = Math.floor(max); // exclusive
    return Math.floor(Math.random() * (max - min)) + min;
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

var question = null;
var start = null;

function makeQuestion() {
    var str = execSync('python maker.py')
    var d = JSON.parse(str);
    question = d;
    var n = new Date();
    start = n.getTime() / 1000;
}

function sendQuestion() {
    makeQuestion();
    var d = Object.assign({}, question, {
        good: null,
        time: 45,
    });
    io.sockets.emit('question', d);
}

io.on('connection', (socket) => {
    if (question) {
        var n = new Date();
        var d = Object.assign({}, question, {
            good: null,
            time: Math.round(start + 45 - n.getTime() / 1000),
        });
        socket.emit('question', d);
    }
    socket.on('answer', (id) => {
        if (id == question.good.id) {
            socket.emit('result', true);
        } else {
            socket.emit('result', false, question.good.title);
        }
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

console.log('listening on ' + port);

setInterval(() => {
    sendQuestion();
}, 45000);
sendQuestion();
