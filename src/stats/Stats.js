import React from 'react';
import './Stats.scss';
import StatBar from './StatBar';

class Stats extends React.Component {
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

        console.log(statBars);

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
                {/* <footer className="card-footer">
                    <a href="#" className="card-footer-item">Save</a>
                    <a href="#" className="card-footer-item">Edit</a>
                    <a href="#" className="card-footer-item">Delete</a>
                </footer> */}
            </div>
        )
    }
}

export default Stats;
