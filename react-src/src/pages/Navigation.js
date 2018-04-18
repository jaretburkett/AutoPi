import React, {Component} from 'react';
import {observer} from 'mobx-react';
import myCarIcon from '../assets/img/myMarker.png';
import L from 'leaflet'
//
//
import {
    withRouter
} from 'react-router-dom';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet'

@observer
class Navigation extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const myCoordinates = this.props.store.coordinates;
        const gpsSignalStrength = this.props.store.gpsSignalStrength;
        let position = null;
        if (myCoordinates) {
            position = [myCoordinates.latitude, myCoordinates.longitude];
        }
        const myIcon = L.icon({
            iconUrl: myCarIcon,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [-3, -76]
        });
        let notice = null;
        if(gpsSignalStrength === -1){
            notice = <div className="notice-bg"><div className="notice">No GPS device connected</div></div>
        }
        if(gpsSignalStrength === 0){
            notice = <div className="notice-bg"> <div className="notice">
                <i className="fas fa-spinner fa-pulse"></i>
                Looking for Satellites
            </div>
            </div>
        }
        return (
            <div className="Navigation isNavigating">
                {myCoordinates ?
                    <div className="map-rotate">
                    <Map center={position}
                         zoom={this.props.store.mapZoom}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenDash"
                        />
                        <Marker position={position}
                                icon={myIcon}>
                            <Popup>
                                <span>A pretty CSS3 popup.<br />Easily customizable.</span>
                            </Popup>
                        </Marker>
                    </Map>
                    </div>
                    : null}
                {notice}
            </div>
        );
    }
}

// export default withRouter(Navigation);
export default withRouter(Navigation);
