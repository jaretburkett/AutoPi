import React, {Component} from 'react';
import {observer} from 'mobx-react';
import moment from "moment";

import {
    BrowserRouter as Router,
    Route,
    NavLink,
    Switch,
    Link,
    withRouter
} from 'react-router-dom';

@observer
class TopNav extends Component {
    render() {
        const formattedTime = moment(this.props.store.time).format('h:mm A');
        return (
            <div className="top-nav">
                <div className="row">
                    <div className="col-xs-4"></div>
                    <div className="col-xs-4 text-center">{formattedTime}</div>
                    <div className="col-xs-4"></div>
                </div>
            </div>
        );
    }
}

export default withRouter(TopNav);
