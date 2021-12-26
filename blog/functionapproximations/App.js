import { useState, useMemo, useContext, useCallback } from "react";
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
import { combineClassNames } from "../../components/PlotUtility";

const initialPoints = [
  [0, 0],
  [1, 1],
  [2, 0],
];

const Interpolation = (props) => {
  const [points, setPoints] = useState(initialPoints);
  const [pointDragging, setPointDragging] = useState(null);
  const { frameWidth, plotWidth } = useContext(FrameContext);

  const interpolation = useMemo(() => getNewtonInterpolation(points), [points]);

  const createStartHandler = (i) => (event, data) => {
    console.log("Set point dragging to " + i);
    setPointDragging(i);
  }
  
  const createDragHandler = (i) => (event, data) => {
    console.log("Dragging " + i);
    const pts = clone2D(points);
    
    const aspectRatio = plotWidth / frameWidth;
    const plotDeltaX = data.deltaX * aspectRatio;
    const plotDeltaY = -data.deltaY * aspectRatio;
    
    pts[i] = [pts[i][0] + plotDeltaX, pts[i][1] + plotDeltaY];
    setPoints(pts);
  };
  
  const stopHandler = (event, data) => {
    console.log("Stopped dragging.");
    setPointDragging(null);
  };
  
  return (
    <>
      <PlotGridLines />
      <PlotAxisLabels />
      <PlotFunction fun={interpolation} className="interpolation" />
      {points.map((pt, i) => (
        <DraggableCore 
          onStart={createStartHandler(i)}
          onStop={stopHandler}
          onDrag={createDragHandler(i)}
        >
          <PlotPoint 
            x={pt[0]}
            y={pt[1]}
            size={10}
            key={i}
            className={pointDragging == i ? "plot-point-dragging" : ""} 
          />
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