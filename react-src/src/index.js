import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './store';
import './scss/App.scss';
import {observer} from 'mobx-react';


import registerServiceWorker from './registerServiceWorker';

@observer
class Site extends Component {
    render() {
        return (<App store={this.props.store}/>);
    }
}

ReactDOM.render(<Site store={store}/>, document.getElementById('root'));
registerServiceWorker();
