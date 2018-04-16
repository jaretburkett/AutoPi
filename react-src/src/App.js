import React, {Component} from 'react';
import {observer} from 'mobx-react';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Media from './pages/Media';
import Navigation from './pages/Navigation';
import Climate from './pages/Climate';
import Settings from './pages/Settings';

import {
    BrowserRouter as Router,
    Route,
    NavLink,
    Switch,
    Link
} from 'react-router-dom';

@observer
class App extends Component {
    render() {
        return (
            <Router history={this.props.store.history}>
                <div className="main-container">
                    <TopNav {...this.props}/>
                    <div className="main-body">
                        <Route exact path="/" render={props => (
                            <Home {...props} {...this.props}/>
                        )}/>
                        <Route path="/media" render={props => (
                            <Media {...props} {...this.props}/>
                        )}/>
                        <Route path="/navigation" render={props => (
                            <Navigation {...props} {...this.props}/>
                        )}/>
                        <Route path="/climate" render={props => (
                            <Climate {...props} {...this.props}/>
                        )}/>
                        <Route path="/settings" render={props => (
                            <Settings {...props} {...this.props}/>
                        )}/>
                    </div>
                    <BottomNav {...this.props}/>
                </div>

            </Router>
        )

    }
}

export default App;
