import React from 'react';
import './Stats.scss';
import StatBar from './StatBar';
import PouchDB from 'pouchdb';
import IdHandler from '../utilities/IdHandler';
import cloneObject from '../utilities/utilities';
import Loading from '../common/Loading';

const db = new PouchDB('player-stats');
const remoteCouch = false;

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            stats: {
                date: new Date().toISOString(),
                levels: {
                    health: 5,
                    magic: 5,
                    defense: 5,
                    speed: 5,
                    luck: 5
                },
                lastUpdated: new Date().toISOString()
            },
        }
        this.getLatestStats = this.getLatestStats.bind(this);
        this.handleLevelChange = this.handleLevelChange.bind(this);
        this.addStatsToDb = this.addStatsToDb.bind(this);
        this.insertStatsFromDb = this.insertStatsFromDb.bind(this);
    }

    componentDidMount() {
        // Testing loading text...
        setTimeout(() => {
            this.getLatestStats();
        }, 5000);
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
                if (results.total_rows > 0) {
                    this.insertStatsFromDb(results.rows[0].doc);
                    this.setState({ loading: false });
                }
            }).catch(error => {
                console.log('Error retrieving all docs:', error);
                console.log(this.state);
            });
        })
    }

    insertStatsFromDb(doc) {
        const newState = cloneObject(this.state);

        newState.stats = {
            date: doc._id,
            levels: doc.levels,
            lastUpdated: doc.lastUpdated
        }
        this.setState(newState);
    }

    handleLevelChange(updatedStat) {
        const newState = cloneObject(this.state); 

        newState.stats.levels[updatedStat.category] = updatedStat.level;
        this.setState(newState);
    }

    addStatsToDb() {
        console.log('click?');
        const newStats = {
            _id: new Date().toISOString(),
            levels: this.state.stats.levels,
            lastUpdated: new Date().toISOString()
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
            } else {
                console.log('Error adding docs!:', err);
            }
        })
    }

    render() {
        // console.log('STATE ----->', this.state);
        const headerDate = new Date(this.state.stats.date).toLocaleDateString();
        const statBars = Object.keys(this.state.stats.levels).map(category => {
            const componentKey = 'stat-' + category;
            return (
                <StatBar
                    key={componentKey}
                    category={category}
                    level={this.state.stats.levels[category]}
                    id={componentKey}
                    onLevelChange={this.handleLevelChange}
                />
            )
        });
        let statDisplay;
        if (this.state.loading) {
            statDisplay = <Loading message="FeTching StaTS" />;
        } else {
            statDisplay = statBars
        }

        return(
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title subtitle is-marginless">staTs</p>
                    <p className="subtitle stats-date">{headerDate}</p>
                </header>
                <div className="card-content">
                    <div className="container">
                        {statDisplay}
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