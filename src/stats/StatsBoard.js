import React from 'react';
// import './StatsBoard.scss';
import StatBar from './StatBar';

class StatsBoard extends React.Component {
    constructor(props) {
        super(props);
        this.submitStats = this.submitStats.bind(this);
        this.onChildLevelChange = this.onChildLevelChange.bind(this);
    }

    onChildLevelChange(stat) {
        this.props.handleLevelChange(stat);
    }
    
    submitStats() {
        this.props.onStatsSubmit();
    }

    render() {
        const statBars = Object.keys(this.props.stats).map(category => {
            const componentKey = 'stat-' + category;
            return (
                <StatBar
                    key={componentKey}
                    category={category}
                    level={this.props.stats[category]}
                    id={componentKey}
                    onLevelChange={this.onChildLevelChange}
                />
            )
        });

        return(
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title subtitle is-marginless">staTs</p>
                    <p className="subtitle stats-date">Thu May 07, 2020</p>
                </header>
                <div className="card-content">
                    <div className="container">
                        {statBars}
                    </div>
                </div>
                <footer className="card-footer">
                    <div className="card-footer-item">
                        <button onClick={this.submitStats} className="button is-text is-fullwidth">Save</button>
                    </div>
                </footer>
            </div>
        )
    }
}

export default StatsBoard;
