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
class Settings extends Component {
    render() {
        return (
            <div className="Home">
                <div className="container-fluid">
                    <h4>Settings</h4>
                </div>
            </div>
        );
    }
}

export default withRouter(Settings);
