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
        db.rel.find('entry', this.state.stats.date).then(result => {
            if (result.entries.length > 0) {
                this.insertStatsFromDb(result.entries[0]);
                this.setState({
                    loading: false,
                    fresh: false
                });
            } else {
                // If no doc found, retrieve last entry
                db.rel.find('entry', {
                    include_docs: true,
                    update_seq: true,
                    limit: 1,
                    descending: true
                }).then(result => {
                    if (result.entries.length > 0) {
                        this.insertStatsFromDb(result.entries[0]);
                    } else {
                        throw new Error('No entries could be retrieved.');
                    }
                    this.setState({
                        loading: false,
                        fresh: true
                    });
                }).catch(error => {
                    console.log('Error retrieving all entries:', error);
                });
            }
        }).catch(error => {
            throw error;
        });
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
            id: new Date().toLocaleDateString(),
            levels: this.state.stats.levels,
            tags: this.state.stats.tags,
            lastUpdated: new Date().toISOString()
        }

        this.setState({ saving: true });

        if (this.state.fresh) {
            db.rel.save('entry', newStats).then(result => {
                console.log('FRESH STATS ADDED:', result);
                this.setState({
                    fresh: false,
                    saving: false
                });
            }).catch(error => {
                throw new Error(error);
            });
        } else {
            db.rel.find('entry', newStats.id).then(entry => {
                newStats.rev = entry.rev;
                return db.rel.save('entry', newStats);
            }).then(result => {
                console.log('STATS UPDATED:', result);
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
            </div>
        )
    }
}

export default Stats;