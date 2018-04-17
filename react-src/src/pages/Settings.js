import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import {
    BrowserRouter as Router,
    Route,
    NavLink,
    Switch,
    Link,
    withRouter
} from 'react-router-dom';

@observer
class Settings extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            brightness: this.props.store.brightness,
            volume: this.props.store.volume
        };
    }

    brightnessChange = value => {
        this.setState({brightness: value});
        this.props.store.brightness = this.state.brightness;
        if(this.props.store.isPi){
            window.socket.send('backlight', this.state.brightness);
        }
    };
    volumeChange = value => {
        this.setState({volume: value});
        this.props.store.volume = this.state.volume;
    };

    render() {
        const {brightness, volume} = this.state;
        let volumeIconClass = 'fas fa-volume-up';
        if(volume > 50){
            volumeIconClass = 'fas fa-volume-up';
        } else if (volume > 0){
            volumeIconClass = 'fas fa-volume-down';
        } else{
            volumeIconClass = 'fas fa-volume-off';
        }
        return (
            <div className='Settings'>
                <div className="container-fluid">
                    <div className="clearfix">

                        {/*Brightness*/}
                        <div className='slider-vertical'>
                            <div className="slider-icon">
                                <i className="fas fa-lightbulb"></i>
                            </div>
                            <div className="slider-title">Light</div>
                            <Slider
                                min={0}
                                max={100}
                                value={brightness}
                                onChange={this.brightnessChange}
                                orientation='vertical'
                            />
                            <div className='value'>{brightness}</div>
                        </div>

                        {/*Volume*/}
                        <div className='slider-vertical'>
                            <div className="slider-icon">
                                <i className={volumeIconClass}></i>
                            </div>
                            <div className="slider-title">Volume</div>
                            <Slider
                                min={0}
                                max={100}
                                value={volume}
                                onChange={this.volumeChange}
                                orientation='vertical'
                            />
                            <div className='value'>{volume}</div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Settings);
