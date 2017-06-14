import React, { PropTypes, Component } from 'react';
import L from 'leaflet';
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
// bounds are [y, x]
const getAisles = () => ([
  { id: 1, bounds: [[70, -90], [-63, -50]], rows: 10, cols: 2 },
  { id: 2, bounds: [[36, -40], [-18, -3]], rows: 5, cols: 2 },
  { id: 3, bounds: [[70, 4], [-63, 45]], rows: 8, cols: 2 },
]);

const getBays = (aisle) => {
  const bayWidth = Math.abs(aisle.bounds[0][1] - aisle.bounds[1][1]) / aisle.cols;
  const bayHeight = Math.abs(aisle.bounds[0][0] - aisle.bounds[1][0]) / aisle.rows;

  const bays = [];
  // let position = aisle.bounds;

  for (let i = 0; i < aisle.rows; i += 1) {
    const position = [
      [aisle.bounds[0][0] - (i * bayHeight), aisle.bounds[0][1]],
      [aisle.bounds[0][0] - ((i + 1) * bayHeight), aisle.bounds[1][1]],
    ];
    const opacity = 0.8;
    bays.push(<Rectangle
      key={`${aisle.id}-${i}`}
      bounds={position}
      fillOpacity={opacity}
      color={i % 2 === 0 ? '#ffdddd' : '#ffaaaa'}
    />);
  }

  return bays;

  // return (<Rectangle
  //   key={aisle.id}
  //   bounds={aisle.bounds}
  //   onClick={() => this.handleAisleClick(aisle.id)}
  //   fillOpacity="0.8"
  //   color="#ffdddd"
  // />);
};

class MapPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crs: L.CRS.Simple,
      lat: 0,
      lng: 0,
      zoom: 1,
      minZoom: 0,
      // do this based on the image size
      imageBounds: [
        [-120, -120],
        [120, 120],
      ],
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
    console.log('map click', e.latlng);
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <Wrapper>
        <Map
          crs={this.state.crs}
          minZoom={this.state.minZoom}
          center={position}
          zoom={this.state.zoom}
          bounds={this.state.imageBounds}
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
