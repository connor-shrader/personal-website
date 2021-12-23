import { useContext } from "react";
import { FrameContext } from "./PlotFrame";
import { combineClassNames, getFixedPosition } from "./PlotUtility";

export const PlotAxisLabels = ({...rest}) => {
  return (
    <>
      <PlotXAxisLabels {...rest} />
      <PlotYAxisLabels {...rest} />
    </>
  );
}

export const PlotXAxisLabels = ({className = null, maxDistanceFromEdge = 0.05}) => {
  const { xScale, yScale, frameHeight } = useContext(FrameContext);

  const axisFrameY = getFixedPosition(
    yScale(0),
    frameHeight,
    maxDistanceFromEdge
  );

  return (
    <g
      className="plot-axis-labels plot-x-axis-labels"
      transform={`translate(0, ${axisFrameY})`}
    >
      {xScale.ticks().map((xTickValue) => (
        <text
          transform={`translate(${xScale(xTickValue)}, 0)`}
          className={combineClassNames("plot-axis-label plot-x-axis-label", className)}
          style={{
            textAnchor: "middle",
            dominantBaseline: "middle",
            userSelect: "none",
          }}
        >
          {xTickValue}
        </text>
      ))}
    </g>
  );
};

export const PlotYAxisLabels = ({
  className = null,
  maxDistanceFromEdge = 0.05,
}) => {
  const { xScale, yScale, frameWidth } = useContext(FrameContext);

  const axisFrameX = getFixedPosition(
    xScale(0),
    frameWidth,
    maxDistanceFromEdge
  );

  return (
    <g
      className="plot-axis-labels plot-y-axis-labels"
      transform={`translate(${axisFrameX}, 0)`}
    >
      {yScale.ticks().map((yTickValue) => (
        <text
          transform={`translate(0, ${yScale(yTickValue)})`}
          className={combineClassNames(
            "plot-axis-label plot-y-axis-label",
            className
          )}
          style={{
            textAnchor: "middle",
            dominantBaseline: "middle",
            userSelect: "none",
          }}
        >
          {yTickValue}
        </text>
      ))}
    </g>
  );
};
