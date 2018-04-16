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
class Climate extends Component {
    render() {
        return (
            <div className="Climate">
                <div className="container-fluid">
                    <h4>Climate</h4>
                </div>
            </div>
        );
    }
}

export default withRouter(Climate);
