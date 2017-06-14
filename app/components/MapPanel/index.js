import React, { PropTypes, Component } from 'react';
import {
  Map,
  ImageOverlay,
  LayersControl,
  LayerGroup,
  Rectangle,
  Popup
} from 'react-leaflet';
import 'leaflet_assets/leaflet.css';

import bgImage from './blue-print.jpg';
import Wrapper from './Wrapper';

const { BaseLayer, Overlay } = LayersControl;
const getAisles = () => ([
  { id: 1, bounds: [[65, -87], [-51, -26]], rows: 10, cols: 2 },
  { id: 2, bounds: [[49, -7], [-21, 69]], rows: 5, cols: 2 },
  { id: 3, bounds: [[65, 87], [-51, 156]], rows: 8, cols: 2 }
]);

const getBays = (aisle) => {
  const rows = aisle.rows;
  return (<Rectangle
    key={aisle.id}
    bounds={aisle.bounds}
    onClick={() => this.handleAisleClick(aisle.id)}
    fillOpacity="0.8"
    color="#ffdddd"
  />);
};

class MapPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 150,
      lng: 150,
      zoom: 1,
      imageBounds: [
        [-150, -150],
        [300, 300],
      ],
      mapBounds: [
        [50, 50],
        [200, 200],
      ],
      bays: [],
      aisles: getAisles(),
      selectedAisle: undefined,
    };

    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleAisleClick = this.handleAisleClick.bind(this);
  }

  handleAisleClick(id) {
    this.setState({
      selectedAisle: id,
    });
    // console.log('selected aisle', this.state.selectedAisle);
  }

  handleMapClick(e) {
    const a = this;
    // console.log('map click', e.latlng);
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <Wrapper>
        <Map
          center={position}
          zoom={this.state.zoom}
          onClick={this.handleMapClick}
        >
          <LayersControl position="topright">
            <BaseLayer checked name="Blueprint">
              <ImageOverlay
                bounds={this.state.imageBounds}
                url={bgImage}
              />
            </BaseLayer>
            <Overlay name="Aisles" checked>
              <LayerGroup>
                { this.state.aisles.map((aisle) => (
                  <Rectangle
                    key={aisle.id}
                    bounds={aisle.bounds}
                    onClick={() => this.handleAisleClick(aisle.id)}
                    fillOpacity={this.state.selectedAisle === aisle.id ? 0.5 : 0.2}
                  />
                ))}
              </LayerGroup>
            </Overlay>
            <Overlay name="Bays" checked>
              <LayerGroup>
                { this.state.aisles.map((aisle) => getBays(aisle))}
              </LayerGroup>
            </Overlay>
          </LayersControl>
        </Map>
      </Wrapper>
    );
  }
}

export default MapPanel;
