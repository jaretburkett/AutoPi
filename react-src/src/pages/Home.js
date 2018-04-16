import React, {Component} from 'react';
import {observer} from 'mobx-react';

import {
    BrowserRouter as Router,
    Route,
    NavLink,
    Switch,
    Link,
    withRouter
} from 'react-router-dom';

const map = ( x,  in_min,  in_max,  out_min,  out_max) => {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};
@observer
class Home extends Component {
    render() {
        // console.log(this.props.store);
        //-135deg = 0, 45deg = max
        const speed = this.props.store.speed;
        // rotate the speed bar
        const speedBarStyle = {transform:`rotate(${map(speed, 0, 100, -135, 45)}deg`};
        return (
            <div className="Home">
                <div className="container-fluid">
                    <h4>Home</h4>
                    <div className="row">
                        <div className="col-xs-3"></div>
                        <div className="col-xs-6">
                            <div className="speedometer">
                                <div className="speed">{this.props.store.speed}</div>
                                <div className="speedFormat">{this.props.store.speedFormat}</div>
                                <div className="speed-bar-box">
                                    <div className="speed-bar" style={speedBarStyle}></div>
                                    <div className="speed-bar-shadow"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-3"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Home);
