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

export const PlotXAxisLabels = ({className = null, maxDistanceFromEdge = 0.05, offset = 15, zeroOffset = 5}) => {
  const { xScale, yScale, frameHeight } = useContext(FrameContext);

  const axisFrameY = getFixedPosition(
    yScale(0) + offset,
    frameHeight,
    maxDistanceFromEdge
  );

  return (
    <g
      className="plot-axis-labels plot-x-axis-labels"
      transform={`translate(0, ${axisFrameY})`}
    >
      {xScale.ticks().map((xTickValue) => {
        const xTransform = xScale(xTickValue) - (xTickValue ? 0 : zeroOffset);
        return (
          <text
            transform={`translate(${xTransform}, 0)`}
            className={combineClassNames(
              "plot-axis-label plot-x-axis-label",
              className
            )}
            style={{
              textAnchor: xTickValue ? "middle" : "end",
              dominantBaseline: "middle",
              userSelect: "none",
            }}
          >
            {xTickValue}
          </text>
        );
      })}
    </g>
  );
};

export const PlotYAxisLabels = ({
  className = null,
  maxDistanceFromEdge = 0.05,
  offset = 5,
  zeroOffset = 15,
}) => {
  const { xScale, yScale, frameWidth, plotWidth, plotHeight } = useContext(FrameContext);

  const axisFrameX = getFixedPosition(
    xScale(0) - offset,
    frameWidth,
    maxDistanceFromEdge
  );

  return (
    <g
      className="plot-axis-labels plot-y-axis-labels"
      transform={`translate(${axisFrameX}, 0)`}
    >
      {yScale.ticks(10 * plotHeight / plotWidth).map((yTickValue) => {
        const yTransform = yScale(yTickValue) + (yTickValue ? 0 : zeroOffset);
        return (
          <text
            transform={`translate(0, ${yTransform})`}
            className={combineClassNames(
              "plot-axis-label plot-y-axis-label",
              className
            )}
            style={{
              textAnchor: "end",
              dominantBaseline: "middle",
              userSelect: "none",
            }}
          >
            {yTickValue}
          </text>
        );
      })}
    </g>
  );
};
