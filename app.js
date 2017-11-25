var socket = io(config.url);

class Quiz extends React.Component {

    constructor() {
        super();
        this.state = {
            album: null,
            preview: null,
            tracks: null,
            score: 0,
            message: null,
            question: null,
            answered: false,
        };
    }

    componentWillMount() {
        socket.on('question', (data) => {
            this.setState(Object.assign({}, data, {
                message: null,
                answered: false,
            }));
        });
        socket.on('result', (result, title) => {
            if (result) {
                this.setState({
                    message: 'Bravo!',
                    score: this.state.score + 1,
                });
            } else {
                this.setState({
                    message: 'Non, raté. C\'était "' + title + '".',
                });
            }
            setTimeout(() => {
                this.setState({
                    question: null,
                    message: null,
                });
                setTimeout(() => {
                    socket.emit('ask');
                }, 2000);
            }, 3000);
        });
    }

    componentWillUnmount() {
    }

    handleAnswer(id) {
        if (!this.state.answered) {
            this.setState({
                answered: true,
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
                                            <th>Username</th>
                                            <th>Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Mark</td>
                                            <td>300 pts</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Otto</td>
                                            <td>200 pts</td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>Jacob</td>
                                            <td>150 pts</td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>Larry</td>
                                            <td>10 pts</td>
                                        </tr>
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
                                    <audio controls style={{width:'100%'}}>
                                        <source src={this.state.media} type="audio/mpeg"/>
                                    </audio>
                                    &nbsp;
                                    &nbsp;
                                    <div className="row">
                                        <div className="list-group">
                                            {this.state.tracks.map((t) => {
                                                return (
                                                    <div className="col-sm-6" key={t.id}>
                                                        <div className="list-group-item" key={t.id}
                                                            onClick={() => this.handleAnswer(t.id)}>
                                                            <h4 className="list-group-item-heading">{t.title}</h4>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    {this.state.message ?
                                        <div className="alert alert-info">
                                            {this.state.message}
                                        </div>
                                    : <div/>}
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
