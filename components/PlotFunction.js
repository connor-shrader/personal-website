import { useContext } from "react";
import { FrameContext } from "./PlotFrame";
import { combineClassNames } from "./PlotUtility";

export const PlotFunction = ({ fun, className = null }) => {
  if (fun === null) {
    return null;
  }

  const { frameWidth, xScale, yScale } = useContext(FrameContext);

  const frameX = d3.range(frameWidth + 1);
  const plotX = frameX.map((x) => xScale.invert(x));
  const plotY = plotX.map((x) => fun(x));
  const frameY = plotY.map((y) => yScale(y));
  const plotPoints = frameX.map((x, i) => [x, frameY[i]]);

  let i = 0;
  while (i < plotPoints.length) {
    if (isNaN(frameY[i])) {
      plotPoints.splice(i, 1);
      console.warn("Function " + fun + " NaN at x = " + plotX[i] + ".");
    }

    i++;
  }

  const line = d3.line()(plotPoints);

  return <path 
    d={line} 
    stroke="black"
    fill="none"
    className={combineClassNames("plot-function", className)}
  />;
};
