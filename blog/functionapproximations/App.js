import { useState, useMemo, useContext } from "react";
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
import { DraggableCore } from "react-draggable";
import { FrameContext } from "../../components/PlotFrame";

const initialPoints = [
  [0, 0],
  [1, 1],
  [2, 0],
];

const Interpolation = (props) => {
  const [points, setPoints] = useState(initialPoints);
  const { xScale, yScale, frameWidth, plotWidth } = useContext(FrameContext);

  const interpolation = useMemo(() => getNewtonInterpolation(points), [points]);

  const createDragHandler = (i) => (event, data) => {
    const pts = clone2D(points);

    const aspectRatio = plotWidth / frameWidth;
    const plotDeltaX = data.deltaX * aspectRatio;
    const plotDeltaY = -data.deltaY * aspectRatio;

    pts[i] = [pts[i][0] + plotDeltaX, pts[i][1] + plotDeltaY];
    setPoints(pts);
  };

  return (
    <>
      <PlotGridLines />
      <PlotAxisLabels />
      <PlotFunction fun={interpolation} className="interpolation" />
      {points.map((pt, i) => (
        <DraggableCore onDrag={createDragHandler(i)}>
          <PlotPoint x={pt[0]} y={pt[1]} size={10} key={i} className="node" />
        </DraggableCore>
      ))}
    </>
  );
};

export const App = () => {
  return (
    <Plot plotCenter={{x: 3, y: 3}} plotWidth={15}>
      <Interpolation/>
    </Plot>
  )
};