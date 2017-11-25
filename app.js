var socket = io('http://localhost:8088');

class Quiz extends React.Component {

    constructor() {
        super();
        this.state = {
            album: null,
            preview: null,
            tracks: null,
            score: 0,
            message: null,
        };
    }

    componentWillMount() {
        socket.on('question', (data) => {
            this.setState({
                album: data.album,
                preview: data.preview,
                tracks: data.tracks,
                message: null,
            });
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
                    album: null,
                    preview: null,
                    tracks: null,
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
        socket.emit('answer', id);
    }

    render() {
        return (
            <div>
                <p>Score: {this.state.score}</p>
                {this.state.message ?
                    <p>{this.state.message}</p>
                : <div/>}
                {!this.state.tracks ?
                    <p>Chargement...</p>
                :
                    <div>
                        <h2>{this.state.album}</h2>
                        <audio controls>
                            <source src={this.state.preview} type="audio/mpeg"/>
                        </audio>
                        {this.state.tracks.map((t) => {
                            return (
                                <p key={t.id}
                                    onClick={() => this.handleAnswer(t.id)}>
                                    {t.title}
                                </p>
                            );
                        })}
                    </div>}
            </div>
        );
    }

}

ReactDOM.render(
    <Quiz/>,
    document.getElementById('root')
);