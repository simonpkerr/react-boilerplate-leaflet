import React, { PropTypes, Component } from 'react';
import L from 'leaflet';
import {
  Map,
  ImageOverlay,
  LayersControl,
  LayerGroup,
  Rectangle,
  Polygon,
  Popup,
} from 'react-leaflet';

import 'leaflet_assets/leaflet.css';

import bgImage from './blue-print.jpg';
import Wrapper from './Wrapper';

const { BaseLayer, Overlay } = LayersControl;
// bounds are [y, x]
const getAisles = () => ([
  { id: 1, bounds: [[60, -90], [-60, -50]], rows: 10, cols: 2 },
  { id: 2, bounds: [[36, -40], [-5, -3]], rows: 4, cols: 1 },
  { id: 3, bounds: [[60, 4], [-60, 45]], rows: 8, cols: 2 },
]);

const polygonHeight = 10;

const hasContract = () => Math.random() > 0.8;

const getBays = (aisle, clickHandler) => {
  const bayWidth = Math.abs(aisle.bounds[0][1] - aisle.bounds[1][1]) / aisle.cols;
  const bayHeight = Math.abs(aisle.bounds[0][0] - aisle.bounds[1][0]) / aisle.rows;
  const bays = [];
  for (let i = 0; i < aisle.rows; i += 1) {
    for (let j = 0; j < aisle.cols; j += 1) {
      const position = [
        [
          aisle.bounds[0][0] - (i * bayHeight),
          aisle.bounds[0][1] + (j * bayWidth),
        ],
        [
          aisle.bounds[0][0] - ((i + 1) * bayHeight),
          aisle.bounds[0][1] + ((j + 1) * bayWidth),
        ],
      ];
      const withContract = hasContract();
      const id = `${aisle.id}-${j}-${i}`;
      bays.push(<Rectangle
        key={id}
        bounds={position}
        opacity={withContract ? 1 : 0.7}
        color={withContract ? '#ff6666' : '#6666aa'}
        onClick={withContract ? () => clickHandler(id) : null}
      >
        { withContract && <Popup><p>This has the contract information</p></Popup> }
      </Rectangle>);
    }
  }

  return bays;
};

const getBayEnd = (aisle) => {
  const bayWidth = aisle.bounds[0][1] - aisle.bounds[1][1];
  const bayMiddle = aisle.bounds[0][1] - (bayWidth / 2);
  const points = [
    [aisle.bounds[1][0], aisle.bounds[0][1]],
    [aisle.bounds[1][0] - polygonHeight, bayMiddle],
    [aisle.bounds[1][0], aisle.bounds[1][1]],
  ];
  return (<Polygon
    color="#66aa66"
    positions={points}
    key={`bay-end-${aisle.id}`}
  />);
};

class MapPanel extends Component {
  constructor(props) {
    super(props);

    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleAisleClick = this.handleAisleClick.bind(this);
    this.handleBayClick = this.handleBayClick.bind(this);

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
      bays: getAisles().map((aisle) => getBays(aisle, this.handleBayClick)),
      selectedAisle: undefined,
      selectedBay: undefined,
    };
  }

  handleBayClick(id) {
    this.setState({
      selectedBay: id,
    });
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
                { this.state.bays }
              </LayerGroup>
            </Overlay>
            <Overlay name="Bay ends" checked>
              <LayerGroup>
                { this.state.aisles.map((aisle) => getBayEnd(aisle))}
              </LayerGroup>
            </Overlay>
          </LayersControl>
        </Map>
      </Wrapper>
    );
  }
}

export default MapPanel;
