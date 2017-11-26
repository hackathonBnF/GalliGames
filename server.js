var port = 8088;
var duration = 45;
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

var rankings = {};
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
        time: duration,
    });
    io.sockets.emit('question', d);
    sendRankings();
}

function sendRankings(socket) {
    var r = [];
    for (var a in rankings) {
        if (!rankings.hasOwnProperty(a)) {
            continue;
        }
        r.push({
            id: a,
            score: rankings[a].score,
            name: rankings[a].name,
        });
    }
    r.sort((a, b) => {
        return a.score < b.score;
    });
    if (socket) {
        socket.emit('rankings', r);
    } else {
        io.sockets.emit('rankings', r);
    }
}

io.on('connection', (socket) => {
    if (question) {
        var n = new Date();
        var d = Object.assign({}, question, {
            good: null,
            time: Math.round(start + duration - n.getTime() / 1000),
        });
        socket.emit('question', d);
    }
    rankings[socket.id] = {
        score: 0,
        name: 'Inconnu',
    };
    sendRankings(socket);
    socket.on('answer', (id) => {
        if (id == question.good.id) {
            var n = new Date();
            n = n.getTime() / 1000;
            rankings[socket.id].score += Math.round(100 * (start + duration - n) / 45);
            socket.emit('result', true, question.good);
        } else {
            socket.emit('result', false, question.good);
        }
    });
    socket.on('disconnect', () => {
        delete rankings[socket.id];
        console.log('user disconnected');
    });
});

console.log('listening on ' + port);

setInterval(() => {
    sendQuestion();
}, duration * 1000);
sendQuestion();
