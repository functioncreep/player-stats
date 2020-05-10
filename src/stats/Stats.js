import React from 'react';
import './Stats.scss';
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';

class StatBar extends React.Component {
    componentDidMount() {
        var slider = document.getElementById(this.props.id);

        noUiSlider.create(slider, {
            start: 0,
            connect: false,
            range: {
                'min': 0,
                'max': 100
            }
        });
    }

    render() {
        return (
            <div className="columns">
                <div className="column is-full">
                    <h5 className='title is-5 is-captitalized'>{this.props.title}</h5>
                    <div id={this.props.id}></div>
                </div>
            </div>
        )
    }
}


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
                    <div className="content">
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
