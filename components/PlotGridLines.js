import { useContext } from "react";
import { FrameContext } from "./PlotFrame";
import { PlotVertical, PlotHorizontal } from "./PlotLines";
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
  const { xScale, yScale, plotCenter, plotWidth, plotHeight } = useContext(FrameContext);

  if (tickSize === null) {
    tickSize = 1/2 * plotWidth;
  }

  return (
    <g className="plot-gridlines plot-gridlines-horizontal">
      {yScale.ticks((10 * plotHeight) / plotWidth).map((yTickValue) => (
        <PlotHorizontal
          // Apparently ignoring the prop "x" sets x to undefined, which works exactly as I need.
          y={yTickValue}
          x1={plotCenter.x + tickSize}
          x2={plotCenter.x - tickSize}
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
  const { xScale, yScale, plotCenter, plotHeight } = useContext(FrameContext);

  if (tickSize === null) {
    tickSize = (1 / 2) * plotHeight;
  }

  return (
    <g className="plot-gridlines plot-gridlines-vertical">
      {xScale.ticks().map((xTickValue) => (
        <PlotVertical
          // Apparently ignoring the prop "x" sets x to undefined, which works exactly as I need.
          x={xTickValue}
          y1={plotCenter.y + tickSize}
          y2={plotCenter.y - tickSize}
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