var socket = io(config.url);

var tick = null;

class Quiz extends React.Component {

    constructor() {
        super();
        this.state = {
            album: null,
            preview: null,
            tracks: null,
            timer: 0,
            question: null,
            answered: false,
            good: null,
            rankings: [],
        };
    }

    componentWillMount() {
        socket.on('question', (data) => {
            if (tick != null) {
                clearInterval(tick);
            }
            this.setState(Object.assign({}, data, {
                answered: false,
                good: null,
            }));
            tick = setInterval(() => {
                if (this.state.time >= 1) {
                    this.setState({
                        time: this.state.time - 1,
                    });
                }
            }, 1000);
        });
        socket.on('result', (result, good) => {
            if (result) {
                this.setState({
                    good: good.id,
                });
            } else {
                this.setState({
                    good: good.id,
                });
            }
        });
        socket.on('rankings', (rankings) => {
            this.setState({
                rankings: rankings.map((r) => {
                    r.me = (r.id == socket.io);
                    return r;
                }),
            });
        });
    }

    componentWillUnmount() {
    }

    handleAnswer(id) {
        if (!this.state.answered) {
            this.setState({
                answered: id,
            });
            socket.emit('answer', id);
        }
    }

    render() {
        return (
            <div className="container-fluid" role="main">
                <div className="page-header">
                    <h1>GalliGames</h1>
                </div>
                <div className="row">
                    <div className="col-sm-3">
                        <div className="panel panel-primary">
                            <div className="panel-heading">
                                <h3 className="panel-title">LeaderBoard</h3>
                            </div>
                            <div className="panel-body">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nom</th>
                                            <th>Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.rankings.map((r, i) => {
                                            return (
                                                <tr key={r.id}>
                                                    <td>{i + 1}</td>
                                                    <td>{r.name}</td>
                                                    <td>{r.score} pts</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-9">
                        {this.state.question ?
                            <div className="panel panel-success">
                                <div className="panel-heading">
                                    <h1 className="panel-title">{this.state.question}</h1>
                                </div>
                                <div className="panel-body">
                                    <div className="row">
                                        <div className="col-sm-2">
                                            <span className="timer">{this.state.time}</span>
                                        </div>
                                        <div className="col-sm-10">
                                            <audio controls autoPlay style={{width:'100%'}} key={this.state.media}>
                                                <source src={this.state.media} type="audio/mpeg"/>
                                            </audio>
                                        </div>
                                    </div>
                                    &nbsp;
                                    &nbsp;
                                    <div className="row">
                                        <div className="list-group">
                                            {this.state.tracks.map((t) => {
                                                var c = '';
                                                if (this.state.good) {
                                                    if (t.id == this.state.good) {
                                                        c = 'good';
                                                    } else if (t.id == this.state.answered) {
                                                        c = 'bad';
                                                    }
                                                }
                                                return (
                                                    <div className="col-sm-6" key={t.id}>
                                                        <div className={"list-group-item btn btn-default " + c} key={t.id}
                                                            onClick={() => this.handleAnswer(t.id)}>
                                                            <h3 className="list-group-item-heading">{t.title}</h3>
                                                            <h4>{t.artist}</h4>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        :
                            <div className="alert alert-info">
                                Chargement...
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }

}

ReactDOM.render(
    <Quiz/>,
    document.getElementById('root')
);
