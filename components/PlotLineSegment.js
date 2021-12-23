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
