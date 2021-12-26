import {
  useState,
  useContext,
  useCallback,
  useEffect
} from "react";
import { FrameContext } from "./PlotFrame";
import { combineClassNames } from "./PlotUtility";

export const PlotPoint = ({
  x = 0,
  y = 0,
  size = 20,
  className = null,
  ...rest
}) => {
  const { xScale, yScale } = useContext(FrameContext);

  return (
    <circle
      cx={xScale(x)}
      cy={yScale(y)}
      r={size}
      className={combineClassNames(
        "plot-point",
        className
      )}
      {...rest}
    />
  );
};
