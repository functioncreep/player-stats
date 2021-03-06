import React from 'react';
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import './StatBar.scss';

class StatBar extends React.Component {
    constructor(props) {
        super(props);
        this.changeLevel = this.changeLevel.bind(this);
        this.setSlider = this.setSlider.bind(this);
    }

    componentDidMount() {
        this.slider = document.getElementById(this.props.id);

        noUiSlider.create(this.slider, {
            start: 5,
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
        this.slider.noUiSlider.on('change', this.changeLevel);
    }

    setSlider(event) {
        console.log('Setting slider!');
        this.slider.noUiSlider.set(event.target.value);
    }

    changeLevel(values) {
        const newStat = {
            category: this.props.category,
            level: values[0]
        };

        this.props.onLevelChange(newStat);
    }

    render() {
        // Set slider val, but only after the component is mounted and the slider is created
        if (this.slider) {
            this.slider.noUiSlider.set(this.props.level);
        }
        
        return (
            <div className="columns">
                <div className="stat-block column is-full">
                    <h6 className='title is-6 is-capitalized'>{this.props.category}</h6>
                    <div id={this.props.id}></div>
                    <input type='hidden' value={this.props.level} onChange={this.setSlider}/>
                </div>
            </div>
        )
    }
}

export default StatBar;