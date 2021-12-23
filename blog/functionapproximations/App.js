import {useState, useMemo} from "react";
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
import {
  getNewtonInterpolation, clone2D
} from "./Interpolation";

const initialPoints = [[1, 1], [0, 0], [2, 0], [2, 1]];

export const App = () => {
  const [points, setPoints] = useState(initialPoints);

  const interpolation = useMemo(() => getNewtonInterpolation(points), [points]);

  const createDragHandler = (i) => ((info) => {
      const pts = clone2D(points);
      pts[i] = [pts[i][0] + info.plotDx, pts[i][1] + info.plotDy];
      setPoints(pts);
    }
  );

  return (
    <Plot
      plotCenter={{ x: 0, y: 0 }}
      plotWidth={10}
    >
      <PlotGridLines />
      <PlotAxisLabels />
      <PlotFunction fun={interpolation}/>
      {points.map((pt, i) => 
        <PlotPoint x={pt[0]} y={pt[1]} draggable={true} onDrag={createDragHandler(i)} size={10} />
      )}
    </Plot>
  );
};
