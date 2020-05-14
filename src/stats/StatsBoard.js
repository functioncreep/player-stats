import React from 'react';
import './StatsBoard.scss';
import StatBar from './StatBar';

class StatsBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [
                'health',
                'magic',
                'defense',
                'speed',
                'luck'
            ]
        }
    }

    render() {
        const statBars = this.state.categories.map((category, index) => {
            const componentKey = 'stat-' + category;
            return (<StatBar
                key={componentKey}
                title={category}
                level={this.props.stats[index]}
                id={componentKey} />)
        });

        return(
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title subtitle is-marginless">staTs</p>
                    <p className="subtitle stats-date">Thu May 07, 2020</p>
                </header>
                <div className="card-content">
                    <div className="container">
                        <form>
                            {statBars}
                        </form>
                    </div>
                </div>
                <footer className="card-footer">
                    <div className="card-footer-item">
                        <button className="button is-text is-fullwidth">Save</button>
                    </div>
                </footer>
            </div>
        )
    }
}

export default StatsBoard;
