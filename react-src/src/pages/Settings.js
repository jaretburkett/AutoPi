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
            brightness: this.props.store.brightness
        };
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
    }

    handleChangeStart = () => {
        console.log('Change event started')
    };

    handleChange = value => {
        this.setState({
            brightness: value
        });
        this.props.store.brightness = this.state.brightness;
    };

    handleChangeComplete = () => {
        //todo set brightness
        this.props.store.brightness = this.state.brightness;
    };

    render() {
        const {brightness} = this.state;
        return (
            <div className='Settings'>
                <div className="container-fluid">
                    <div className='slider-vertical'>
                        <div className="slider-icon">
                            <i className="fas fa-lightbulb"></i>
                        </div>
                        <div className="slider-title">Light</div>
                        <Slider
                            min={0}
                            max={100}
                            value={brightness}
                            onChangeStart={this.handleChangeStart}
                            onChange={this.handleChange}
                            orientation='vertical'
                            onChangeComplete={this.handleChangeComplete}
                        />
                        <div className='value'>{brightness}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Settings);
