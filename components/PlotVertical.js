import { useContext } from "react";
import { FrameContext } from "./PlotFrame";
import { PlotLineSegment } from "./PlotLineSegment";

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
