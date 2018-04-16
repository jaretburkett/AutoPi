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
        return (
            <div className="Navigation isNavigating">
                {myCoordinates ?
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
                    : null}
            </div>
        );
    }
}

// export default withRouter(Navigation);
export default withRouter(Navigation);
