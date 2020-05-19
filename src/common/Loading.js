import React from 'react';

const loadingTextStyle = {
    width: 325
};

const colStyle = {
    justifyContent: 'center'
};

class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingText: this.props.message + '...'
        }
        this.animateDots = this.animateDots.bind(this);
        this.timeout = null;
    }

    componentDidMount() {
        this.animateDots();
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    animateDots() {
        let count = 0;
        const dot = '.';

        const dotLoop = () => {
            const numberDots = count % 4;
            const dots = dot.repeat(numberDots);

            this.timeout = setTimeout(() => {
                this.setState({
                    loading: this.state.loading,
                    loadingText:
                        this.props.message + dots
                });
                count++;
                dotLoop();
            }, 750);
        }

        dotLoop();
    }
    
    render() {
        return (
            <div className="loading-overlay columns is-vcentered">
                <div style={colStyle} className="column is-full is-flex">
                    <h5 style={loadingTextStyle} className="title is-5">{this.state.loadingText}</h5>
                </div>
            </div>
        )
    }
}

export default Loading;