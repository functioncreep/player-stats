import React from 'react';
import StatsBoard from './StatsBoard';
import PouchDB from 'pouchdb';
import IdHandler from '../utilities/IdHandler';

const db = new PouchDB('player-stats');
const remoteCouch = false;

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            stats: {
                health: 5,
                magic: 5,
                defense: 5,
                speed: 5,
                luck: 5
            }
        }
        this.getLatestStats = this.getLatestStats.bind(this);
        this.handleLevelChange = this.handleLevelChange.bind(this);
        this.addStatsToDb = this.addStatsToDb.bind(this);
        this.insertStatsFromDb = this.insertStatsFromDb.bind(this);
    }

    componentDidMount() {
        this.getLatestStats();
    }

    getLatestStats() {
        // Check if there's already an entry in the DB for today
        const now = new Date();
        const today = IdHandler.formatDate(now);

        db.get(today).then(doc => {
            this.insertStatsFromDb(doc);
        }).catch(error => {
            if (
                !(error.constructor.name === "PouchError")
                || error.status !== 404
            ) {
                throw error;
            }

            // If no doc found, retrieve last entry
            db.allDocs({
                include_docs: true,
                update_seq: true,
                limit: 1,
                descending: true
            }).then(results => {
                this.insertStatsFromDb(results.rows[0].doc);
            }).catch(error => {
                console.log('Error retrieving all docs:', error);
            });
        })
    }

    insertStatsFromDb(doc) {
        let newState = {
            date: new Date(doc._id),
            stats: {}
        }

        Object.keys(this.state.stats).map(key => {
            return newState.stats[key] = doc[key];
        });

        this.setState(newState);
    }

    handleLevelChange(updatedStat) {
        this.setState(state => {
            const newStats = Object.assign({}, state.stats);
            newStats[updatedStat.category] = updatedStat.level;
            return {
                date: this.state.date,
                stats: newStats
            };
        })
        console.log(this.state);
    }

    addStatsToDb() {
        const newStats = Object.assign({
            _id: new Date().toISOString(),
        }, this.state.stats);

        db.put(newStats, (err, result) => {
            if (!err) {
                console.log('Stats added!:');
                console.log(result);
                db.allDocs({include_docs: true}).then(docs => {
                    console.log('ALL DOCS:');
                    console.log(docs);
                }).catch(err => {
                    console.log('DANGER WILL ROBINSON:', err);
                })
            }
        })
    }

    render() {
        return (
            <StatsBoard
                stats={this.state.stats}
                handleLevelChange={this.handleLevelChange}
                onStatsSubmit={this.addStatsToDb}
            />
        );
    }
}

export default Stats;