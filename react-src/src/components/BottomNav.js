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

const navLinkArr = [
    {
        isExact:false,
        to:"/",
        iconClass:"fas fa-car",
        text:"Dash"
    },
    {
        to:"/media",
        iconClass:"fas fa-music",
        text:"Media"
    },
    {
        to:"/navigation",
        iconClass:"fas fa-map",
        text:"Nav"
    },
    {
        to:"/climate",
        iconClass:"fas fa-cloud",
        text:"Climate"
    },
    {
        to:"/settings",
        iconClass:"fas fa-cogs",
        text:"Settings"
    },
];

@observer
class BottomNavLink extends Component{
    render(){
        let nav = this.props.nav;
        nav.isExact = nav.isExact || false;
        const trim = (number, precision)=>{
            let array = number.toString().split(".");
            array.push(array.pop().substring(0, precision));
            return array.join(".");
        };
        const style = {
            width: trim(100 / navLinkArr.length,4) + '%'
        };
        if(nav.isExact){
            return(
                <div className="BottomNavLink" style={style}>
                    <NavLink exact to={nav.to}>
                        <i className={nav.iconClass}></i>
                        {nav.text}
                    </NavLink>
                </div>
            );
        } else {
            return(
                <div className="BottomNavLink" style={style}>
                    <NavLink exact to={nav.to}>
                        <i className={nav.iconClass}></i>
                        {nav.text}
                    </NavLink>
                </div>
            );
        }
    }
}

@observer
class BottomNav extends Component {
    render() {
        const navLinks = navLinkArr.map((nav, key) =>
            <BottomNavLink nav={nav} key={key} {...this.props} />
        );
        return (
            <div className="bottom-nav">
                <div className="row">
                    {navLinks}
                </div>
            </div>
        );
    }
}

export default withRouter(BottomNav);
