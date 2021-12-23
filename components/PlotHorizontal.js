import { useContext } from "react";
import { FrameContext } from "./PlotFrame";
import { PlotLineSegment } from "./PlotLineSegment";

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
