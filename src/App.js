import React from 'react';
import styles from './App.module.css';
import * as Locations from './locations';
import Map from './Map';
import { FlyToInterpolator } from 'react-map-gl';
import { csv } from 'd3';

const App = () => {
  const [viewState, setViewState] = React.useState(Locations.usa);
  const handleChangeViewState = ({ viewState }) => setViewState(viewState);
  const handleFlyTo = destination =>
    setViewState({
      ...viewState,
      ...destination,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    });

  const [libraries, setLibraries] = React.useState([]);
  React.useEffect(() => {
    csv('/data/public_libraries.csv', (d, id) => ({
      id,
      state: d['State'],
      position: [+d['Longitude'], +d['Latitude']],
    }))
      .then(libraries =>
        libraries.filter(d => d.position[0] != null && d.position[1] != null)
      )
      .then(setLibraries);
  }, []);

  const [radius, setRadius] = React.useState(15);
  const handleToggleRadius = () =>
    setRadius(radius > 0 ? 0 : Math.random() * 35 + 5);

  const [arcsEnabled, setArcsEnabled] = React.useState(true);
  const handleToggleArcs = () => setArcsEnabled(!arcsEnabled);

  return (
    <div>
      <Map
        width="100vw"
        height="100vh"
        viewState={viewState}
        onViewStateChange={handleChangeViewState}
        libraries={libraries}
        radius={radius}
        arcsEnabled={arcsEnabled}
      />
      <div className={styles.controls}>
        <button onClick={handleToggleRadius}>Radius</button>
        <button onClick={handleToggleArcs}>Arcs</button>
        {Object.keys(Locations).map(key => (
          <button key={key} onClick={() => handleFlyTo(Locations[key])}>
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
