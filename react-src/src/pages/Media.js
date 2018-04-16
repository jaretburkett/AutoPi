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

@observer
class Audio extends Component {
    render() {
        return (
            <div className="Audio">
                <div className="container-fluid">
                    <h4>Audio</h4>
                </div>
            </div>
        );
    }
}

export default withRouter(Audio);
