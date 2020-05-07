import React from 'react';
import './Stats.scss';

class Stats extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title subtitle is-marginless">staTs</p>
                    <p className="subtitle stats-date">Thu May 07, 2020</p>
                </header>
                <div className="card-content">
                    <div className="content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
                        <a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
                        <br />
                        <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                    </div>
                </div>
                <footer className="card-footer">
                    <a href="#" className="card-footer-item">Save</a>
                    <a href="#" className="card-footer-item">Edit</a>
                    <a href="#" className="card-footer-item">Delete</a>
                </footer>
            </div>
        )
    }
}

export default Stats;
