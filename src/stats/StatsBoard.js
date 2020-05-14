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
        const statBars = this.state.categories.map(category => {
            const componentKey = 'stat-' + category;
            return (<StatBar title={category} key={componentKey} id={'stat-' + category} />)
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
            </div>
        )
    }
}

export default StatsBoard;
