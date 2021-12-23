import { useContext } from "react";
import { FrameContext } from "./PlotFrame";
import { PlotVertical } from "./PlotVertical";
import { PlotHorizontal } from "./PlotHorizontal";
import { combineClassNames } from "./PlotUtility";

export const PlotGridLines = ({
  ...rest
}) => {
  return (
    <>
      <PlotHorizontalGridLines {...rest}/>
      <PlotVerticalGridLines {...rest}/>
    </>
  )
}

export const PlotHorizontalGridLines = ({
  tickSize = null,
  className = null,
}) => {
  const { xScale, yScale, plotCenter } = useContext(FrameContext);

  if (tickSize === null) {
    tickSize = xScale.invert(plotCenter.y);
  }

  return (
    <g className="plot-gridlines plot-gridlines-horizontal">
      {yScale.ticks().map((yTickValue) => (
        <PlotHorizontal
          // Apparently ignoring the prop "x" sets x to undefined, which works exactly as I need.
          y={yTickValue}
          x1={tickSize}
          x2={-tickSize}
          key={yTickValue}
          className={combineClassNames(
            "plot-gridline plot-gridline-horizontal",
            yTickValue == 0 ? "plot-axis plot-axis-x" : "",
            className
          )}
        />
      ))}
    </g>
  );
};

export const PlotVerticalGridLines = ({
  tickSize = null,
  className = null,
}) => {
  const { xScale, yScale, plotCenter } = useContext(FrameContext);

  if (tickSize === null) {
    tickSize = yScale.invert(plotCenter.y);
  }

  return (
    <g className="plot-gridlines plot-gridlines-vertical">
      {xScale.ticks().map((xTickValue) => (
        <PlotVertical
          // Apparently ignoring the prop "x" sets x to undefined, which works exactly as I need.
          x={xTickValue}
          y1={tickSize}
          y2={-tickSize}
          key={xTickValue}
          className={combineClassNames(
            "plot-gridline plot-gridline-vertical",
            xTickValue == 0 ? "plot-axis plot-axis-y" : "",
            className
          )}
        />
      ))}
    </g>
  );
};