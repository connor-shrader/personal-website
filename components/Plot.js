import { PlotPoint } from "./PlotPoint";
import { PlotFrame } from "./PlotFrame";
import { PlotFunction } from "./PlotFunction";
import { PlotLineSegment, PlotHorizontal, PlotVertical } from "./PlotLines";
import {
  PlotGridLines,
  PlotHorizontalGridLines,
  PlotVerticalGridLines,
} from "./PlotGridLines";
import {
  PlotAxisLabels,
  PlotXAxisLabels,
  PlotYAxisLabels,
} from "./PlotAxisLabels";
import ContainerDimensions from "react-container-dimensions";
import { combineClassNames } from "./PlotUtility";

const Plot = ({children, className, ...rest}) => {
  return (
    <div className={combineClassNames("plot", className)}>
      <ContainerDimensions>
        {(container) =>
          <PlotFrame container={container} {...rest}>
            {children}
          </PlotFrame>
        }
      </ContainerDimensions>
    </div>
  )
}

export {
  Plot,
  PlotFrame,
  PlotPoint,
  PlotFunction,
  
  PlotLineSegment,
  PlotHorizontal,
  PlotVertical,

  PlotGridLines,
  PlotHorizontalGridLines,
  PlotVerticalGridLines,

  PlotAxisLabels,
  PlotXAxisLabels,
  PlotYAxisLabels,
};
