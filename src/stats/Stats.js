import React from 'react';
import './Stats.scss';
import StatBar from './StatBar';
import PouchDB from 'pouchdb';
import find from 'pouchdb-find';
import rel from 'relational-pouch';
import cloneObject from '../utilities/utilities';
import Loading from '../common/Loading';

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

const PANEL_CLOSING = 'closing';
const PANEL_CLOSED = 'closed';
const PANEL_OPENING = 'opening';
const PANEL_OPEN = 'open';


class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            panelState: PANEL_CLOSED,
            loading: true,
            saving: false,
            fresh: true,
            allTags: [],
            stats: defaultStats,
        }
        this.getLatestStats = this.getLatestStats.bind(this);
        this.handleLevelChange = this.handleLevelChange.bind(this);
        this.addStatsToDb = this.addStatsToDb.bind(this);
        this.insertStatsFromDb = this.insertStatsFromDb.bind(this);
        this.createStatsPanel = this.createStatsPanel.bind(this);
        this.closePanel = this.closePanel.bind(this);
        this.createPanelRef = this.createPanelRef.bind(this);
        this.handlePanelAnimation = this.handlePanelAnimation.bind(this);
        this.loadStats = this.loadStats.bind(this);
    }

    componentDidMount() {
        this.loadStats('latest').finally(() => {
            this.setState({
                loading: false,
            });
            this.openPanel();
        })
    }

    componentWillUnmount() {
        this.statsPanel.removeEventListener('animationend', this.handlePanelClose);
    }

    getLatestStats() {
        // Check if there's already an entry in the DB for today
        return db.rel.find('entry', this.state.stats.date).then(result => {
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
                throw error;
            });
        } else {
            db.rel.find('entry', newStats.id).then(result => {
                if (result.entries.length === 0) {
                    throw new Error('Error retrieving entry for update (none returned)');
                }
                newStats.rev = result.entries[0].rev;
                return db.rel.save('entry', newStats);
            }).then(result => {
                console.log('STATS UPDATED:', result);
                this.setState({ saving: false });
            }).catch(error => {
                this.setState({ saving: false });
                throw error;
            });
        }
    }

    closePanel() {
        if (this.state.panelState === PANEL_OPEN) {
            this.setState({
                panelState: PANEL_CLOSING,
            });
        }
    }

    openPanel() {
        if (this.state.panelState === PANEL_CLOSED) {
            this.setState({
                panelState: PANEL_OPENING,
            });
        }
    }

    loadStats(whichStats) {
        switch (whichStats) {
            case 'latest':
                console.log('getting latest stats...');
                return this.getLatestStats();
            default:
                console.log('loading stats...');
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 500);
                });
        }
    }

    handlePanelAnimation(event) {
        switch (event.animationName) {
            case 'close-panel':
                this.setState({
                    panelState: PANEL_CLOSED,
                    loading: true
                });
                this.loadStats().finally(() => {
                    this.setState({
                        loading: false,
                    });
                    this.openPanel();
                });
                break;
            case 'open-panel':
                this.setState({
                    panelState: PANEL_OPEN
                });
                break;
            default:
                break;
        }
    }

    createPanelRef(element) {
        this.statsPanel = element;
        this.statsPanel.addEventListener('animationend', this.handlePanelAnimation);
    }

    createStatsPanel() {
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
        const statsPanel = (
            <div
                className={"card stats-panel " + this.state.panelState}
                ref={this.createPanelRef}
            >
                {/* { this.state.loading ? <Loading message="Loading Stats" /> : null } */}
                <header className="card-header">
                    <span style={{opacity: this.state.loading ? '100%' : '0%'}} className="icon loading-spinner">
                        <i className="fas fa-spinner fa-2x fa-pulse"></i>
                    </span>
                    <p className="card-header-title subtitle is-marginless has-text-weight-normal">Stats</p>
                    <p className="subtitle is-5 stats-date has-text-weight-normal">{headerDate}</p>
                </header>
                <div className="card-content">
                    <span style={{opacity: this.state.saving ? '100%' : '0%'}} className="icon saving-spinner">
                        <i className="fas fa-spinner fa-2x fa-pulse"></i>
                    </span>
                    <div className="container">
                        { statBars }
                    </div>
                </div>
            </div>
        );
        // statsPanel.addEventListener('animationend', this.loadStats, false);
        return statsPanel;
    }

    render() {
        return(
            <div className="container">

                <div className="columns">
                    <div className="column is-full">
                        <button className="button" onClick={this.closePanel}>Close</button>
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-full">
                        {this.createStatsPanel()}
                    </div>
                </div>
            </div>
        )
    }
}

export default Stats;