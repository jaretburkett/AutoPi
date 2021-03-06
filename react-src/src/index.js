import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './store';
import './scss/App.scss';
import {observer} from 'mobx-react';
import {startWorkers} from './tools/workers';
import {startWebsocket} from './tools/websocket';
import registerServiceWorker from './registerServiceWorker';

@observer
class Site extends Component {
    render() {
        return (<App store={this.props.store}/>);
    }
}

ReactDOM.render(<Site store={store}/>, document.getElementById('root'));

// start services
registerServiceWorker();
startWorkers(store);
startWebsocket(store);
