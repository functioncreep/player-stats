import React from 'react';

class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loadingText: this.props.message
        }
        this.animatDots = this.animatDots.bind(this);
    }

    componentDidMount() {
        this.animatDots();
    }

    animatDots() {
        let count = 0;
        const dot = '.';

        const dotLoop = () => {
            const numberDots = count % 4;
            const dots = dot.repeat(numberDots);

            setTimeout(() => {
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
            <h2 className="title">{this.state.loadingText}</h2>
        )
    }
}

export default Loading;