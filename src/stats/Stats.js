import React from 'react';
import './Stats.scss';
import StatBar from './StatBar';
import PouchDB from 'pouchdb';
import cloneObject from '../utilities/utilities';
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
            },
            lastUpdated: new Date()

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
        console.log(this.state);

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
                if (results.total_rows > 0) {
                    this.insertStatsFromDb(results.rows[0].doc);
                }
            }).catch(error => {
                console.log('Error retrieving all docs:', error);
                console.log(this.state);
            });
        })
    }

    insertStatsFromDb(doc) {
        console.log(IdHandler.parseDate(doc._id));
        let newState = {
            date: IdHandler.parseDate(doc._id),
            stats: doc.stats,
            lastUpdated: doc.lastUpdated
        }

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
        const newStats = {
            _id: new Date().toISOString(),
            stats: this.state.stats,
            lastUpdated: Date()
        }

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
        const headerDate = this.state.date.toLocaleDateString();
        const statBars = Object.keys(this.state.stats).map(category => {
            const componentKey = 'stat-' + category;
            return (
                <StatBar
                    key={componentKey}
                    category={category}
                    level={this.state.stats[category]}
                    id={componentKey}
                    onLevelChange={this.handleLevelChange}
                />
            )
        });

        return(
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title subtitle is-marginless">staTs</p>
                    <p className="subtitle stats-date">{headerDate}</p>
                </header>
                <div className="card-content">
                    <div className="container">
                        {statBars}
                    </div>
                </div>
                <footer className="card-footer">
                    <div className="card-footer-item">
                        <button onClick={this.addStatsToDb} className="button is-text is-fullwidth">Save</button>
                    </div>
                </footer>
            </div>
        )
    }
}

export default Stats;