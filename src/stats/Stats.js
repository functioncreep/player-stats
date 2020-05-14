import React from 'react';
import StatsBoard from './StatsBoard';
import PouchDB from 'pouchdb';

const db = new PouchDB('player-stats');
const remoteCouch = false;

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: [
                5,
                10,
                15,
                20,
                25
            ]
        }
    }
    render() {
        return (<StatsBoard stats={this.state.stats} />);
    }
}

export default Stats;