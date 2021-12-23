import { useState, useMemo } from "react";
import {
  Plot,
  PlotPoint,
  PlotLineSegment,
  PlotFunction,
  PlotHorizontal,
  PlotVertical,
  PlotGridLines,
  PlotAxisLabels,
} from "../../components/Plot";
import { getNewtonInterpolation, clone2D } from "./Interpolation";

const initialPoints = [
  [0, 0],
  [1, 1],
  [2, 0],
];

export const App = () => {
  const [points, setPoints] = useState(initialPoints);

  const interpolation = useMemo(() => getNewtonInterpolation(points), [points]);

  const createDragHandler = (i) => (info) => {
    const pts = clone2D(points);
    pts[i] = [pts[i][0] + info.plotDx, pts[i][1] + info.plotDy];
    setPoints(pts);
  };

  return (
    <Plot plotCenter={{ x: 3, y: 3 }} plotWidth={14.15}>
      <PlotGridLines />
      <PlotAxisLabels />
      <PlotFunction fun={interpolation} className="interpolation" />
      {points.map((pt, i) => (
        <PlotPoint
          x={pt[0]}
          y={pt[1]}
          draggable={true}
          onDrag={createDragHandler(i)}
          size={10}
          key={i}
          className="node"
        />
      ))}
    </Plot>
  );
};
