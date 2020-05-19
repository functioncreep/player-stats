import React from 'react';
import './Stats.scss';
import StatBar from './StatBar';
import PouchDB from 'pouchdb';
import find from 'pouchdb-find';
import rel from 'relational-pouch';
import cloneObject from '../utilities/utilities';
import Loading from '../common/Loading';

// const PouchDB = require('pouchdb');
PouchDB.plugin(find);
PouchDB.plugin(rel);

const db = new PouchDB('player-stats');
db.setSchema([
    {
        singular: 'entry',
        plural: 'entries',
        relations: {
            tags: {hasMany: 'tag'}
        }
    },
    {
        singular: 'tag',
        plural: 'tags',
        relations: {
            entries: {hasMany: 'entry'}
        }
    }
]);

const defaultStats = {
    date: new Date().toLocaleDateString(),
    levels: {
        health: 5,
        magic: 5,
        defense: 5,
        speed: 5,
        luck: 5
    },
    tags: [],
    lastUpdated: new Date().toISOString()
}

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            saving: false,
            fresh: false,
            allTags: [],
            stats: defaultStats,
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
        db.get(this.state.stats.date).then(doc => {
            this.insertStatsFromDb(doc);
            this.setState({
                loading: false,
                fresh: false
            });
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
                this.setState({
                    loading: false,
                    fresh: true
                });
            }).catch(error => {
                console.log('Error retrieving all docs:', error);
                console.log(this.state);
            });
        })
    }

    insertStatsFromDb(doc) {
        const newState = cloneObject(this.state);

        newState.stats = {
            date: new Date().toLocaleDateString(),
            levels: doc.levels,
            lastUpdated: doc.lastUpdated
        }
        this.setState(newState);
    }

    handleLevelChange(updatedStat) {
        const newState = cloneObject(this.state); 

        if (newState.stats.levels[updatedStat.category] !== updatedStat.level) {
            newState.stats.levels[updatedStat.category] = updatedStat.level;
            this.setState(newState);
            this.addStatsToDb();
        }
    }

    addStatsToDb() {
        const newStats = {
            _id: new Date().toLocaleDateString(),
            levels: this.state.stats.levels,
            lastUpdated: new Date().toISOString()
        }

        this.setState({ saving: true });

        if (this.state.fresh) {
            db.put(newStats).then(response => {
                console.log('FRESH STATS ADDED:', response);
                this.setState({
                    fresh: false,
                    saving: false
                });
            }).catch(error => {
                throw new Error(error);
            });
        } else {
            db.get(newStats._id).then(doc => {
                newStats._rev = doc._rev;
                return db.put(newStats);
            }).then(response => {
                console.log('STATS UPDATED:', response);
                this.setState({ saving: false });
            }).catch(error => {
                this.setState({ saving: false });
                throw new Error(error);
            });
        }
    }

    render() {
        const headerDate = this.state.stats.date;
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

        return(
            <div className="card">
                { this.state.loading ? <Loading message="Loading Stats" /> : null }
                <header className="card-header">
                    <p className="card-header-title subtitle is-marginless has-text-weight-normal">Stats</p>
                    <p className="subtitle is-5 stats-date has-text-weight-normal">{headerDate}</p>
                </header>
                <div className="card-content">
                    <span style={{display: this.state.saving ? 'block' : 'none'}} className="icon saving-spinner">
                        <i className="fas fa-spinner fa-2x fa-pulse"></i>
                    </span>
                    <div className="container">
                        { statBars }
                    </div>
                </div>
                {/* <footer className="card-footer">
                    <div className="card-footer-item">
                        <button onClick={this.addStatsToDb} className="button is-text is-fullwidth">Save</button>
                    </div>
                </footer> */}
            </div>
        )
    }
}

export default Stats;