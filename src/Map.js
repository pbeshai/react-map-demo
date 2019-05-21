import React from 'react';
import MapGL, { SVGOverlay } from 'react-map-gl';
import { DeckGL, ScatterplotLayer, GeoJsonLayer, ArcLayer } from 'deck.gl';
import { Spring } from 'react-spring/renderprops';
import Goo from './goodies/Goo';
import { easeBackOut, pairs, shuffle } from 'd3';
import { lineString } from '@turf/helpers';

import ArcBrushingLayer from './goodies/ArcBrushingLayer';

function SvgOverlayExample({ libraries, radius }) {
  const redraw = ({ project }) => {
    return (
      <g>
        <Goo>
          {libraries.map(lib => {
            const [x, y] = project(lib.position);
            return (
              <circle key={lib.id} cx={x} cy={y} r={radius} fill="tomato" />
            );
          })}
        </Goo>
      </g>
    );
  };
  return <SVGOverlay redraw={redraw} />;
}

export default function Map({
  width,
  height,
  viewState,
  onViewStateChange,
  libraries,
  radius,
  arcsEnabled,
}) {
  const librariesMass = React.useMemo(
    () => libraries.filter(d => d.state === 'MA'),
    [libraries]
  );

  const librariesLine = React.useMemo(
    () =>
      libraries.length ? lineString(libraries.map(d => d.position)) : undefined,
    [libraries]
  );

  const libraryLinks = React.useMemo(() => {
    return pairs(shuffle(libraries.slice()).slice(0, 100));
  }, [libraries]);

  return (
    <MapGL
      width={width}
      height={height}
      viewState={viewState}
      onViewStateChange={onViewStateChange}
    >
      <Spring to={{ arcCoef: arcsEnabled ? 1 : 1e-10 }}>
        {springProps => {
          const layers = [
            new ScatterplotLayer({
              id: 'scatterplot-layer',
              data: libraries,
              getRadius: 500 * radius,
              radiusMaxPixels: 15,
              getFillColor: [255, 99, 71],
              transitions: {
                getRadius: {
                  duration: 1000,
                  easing: easeBackOut,
                },
              },
              pickable: true,
              onClick: info => console.log(info.object),
              autoHighlight: true,
            }),
            new GeoJsonLayer({
              id: 'geojson-layer',
              data: librariesLine,
              lineWidthMinPixels: 1,
              getLineColor: [0, 0, 0, 20],
            }),

            new ArcBrushingLayer({
              id: 'arc-layer',
              data: libraryLinks,
              getSourcePosition: d => d[0].position,
              getTargetPosition: d => d[1].position,
              getSourceColor: [0, 255, 0],
              getTargetColor: [0, 200, 200],
              getWidth: 3,
              visible: springProps.arcCoef > 1e-6,
              coef: springProps.arcCoef,
            }),
          ];

          return <DeckGL layers={layers} viewState={viewState} />;
        }}
      </Spring>
      {/* <Spring from={{ radius: 0 }} to={{ radius }}>
        {springProps => (
          <SvgOverlayExample
            libraries={librariesMass}
            radius={springProps.radius}
          />
        )}
        </Spring> */}
    </MapGL>
  );
}
