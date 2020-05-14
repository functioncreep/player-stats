import React from 'react';
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import './StatBar.scss';

class StatBar extends React.Component {
    constructor(props) {
        super(props);
        this.levelChange = this.levelChange.bind(this);
    }
    componentDidMount() {
        const slider = document.getElementById(this.props.id);

        noUiSlider.create(slider, {
            start: this.props.level,
            step: 5,
            connect: 'lower',
            tooltips: false,
            padding: [5, 0],
            range: {
                'min': 0,
                'max': 100
            },
            format: {
                from: function(value) {
                    return parseInt(value);
                },
                to: function(value) {
                    return parseInt(value);
                }
            }     
        });

        // Add event listeners
        slider.noUiSlider.on('change', this.levelChange);
    }

    levelChange(values) {
        console.log(values)
    }

    render() {
        return (
            <div className="columns">
                <div className="stat-block column is-full">
                    <h5 className='title is-5 is-capitalized has-text-weight-bold'>{this.props.title}</h5>
                    <div id={this.props.id}></div>
                    <input type="hidden" />
                </div>
            </div>
        )
    }
}

export default StatBar;