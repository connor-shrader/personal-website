import { useContext } from "react";
import { FrameContext } from "./PlotFrame";

export const PlotLineSegment = ({ x1, x2, y1, y2, className = null }) => {
  const { xScale, yScale } = useContext(FrameContext);

  return (
    <line
      x1={xScale(x1)}
      x2={xScale(x2)}
      y1={yScale(y1)}
      y2={yScale(y2)}
      className={className}
      stroke="black"
    />
  );
};

export const PlotHorizontal = ({
  y,
  x1 = null,
  x2 = null,
  className = null,
}) => {
  const { plotRange } = useContext(FrameContext);

  if (y > plotRange.ymax || y < plotRange.ymin) {
    return null;
  }

  x1 = x1 === null ? plotRange.xmin : x1;
  x2 = x2 === null ? plotRange.xmax : x2;

  return (
    <PlotLineSegment x1={x1} x2={x2} y1={y} y2={y} className={className} />
  );
};

export const PlotVertical = ({ x, y1 = null, y2 = null, className = null }) => {
  const { plotRange } = useContext(FrameContext);

  if (x > plotRange.xmax || x < plotRange.xmin) {
    return null;
  }

  y1 = y1 === null ? plotRange.ymin : y1;
  y2 = y2 === null ? plotRange.ymax : y2;

  return (
    <PlotLineSegment x1={x} x2={x} y1={y1} y2={y2} className={className} />
  );
};