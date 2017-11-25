var port = 8088;
var request = require('request');
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
    request('https://api.deezer.com/search/album?q=bnf', (error, response, body) => {
        var data = JSON.parse(body);
        var d = null;
        do {
            d = data.data[getRandomInt(0, data.data.length)];
        } while (d.nb_tracks < 4);
        request('https://api.deezer.com/album/' + d.id, (error, response, body) => {
            var a = JSON.parse(body);
            var tracks = [];
            for (var i = 0; i < 4; i++) {
                var t = null;
                var good = false;
                while (!good) {
                    t = a.tracks.data[getRandomInt(0, a.tracks.data.length)];
                    good = true;
                    for (var j = 0; j < tracks.length; j++) {
                        if (tracks[j].id == t.id) {
                            good = false;
                        }
                    }
                }
                tracks.push(t);
            }
            questions[socket.id] = {
                good: tracks[0],
            };
            socket.emit('question', {
                album: d.title,
                preview: tracks[0].preview,
                tracks: shuffle(tracks).map((t) => {
                    return {
                        id: t.id,
                        title: t.title,
                    };
                }),
            });
        });
    });
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
