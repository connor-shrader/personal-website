import {
  useState,
  useMemo,
  createContext,
} from "react";
import * as d3 from "d3";

export const FrameContext = createContext(null);

export const PlotFrame = ({
  frameWidth = 700,
  frameHeight = 500,
  plotCenter: initialPlotCenter = { x: 0, y: 0 },
  plotWidth: initialPlotWidth = 10,
  container,
  children,
}) => {
  const [plotCenter, setPlotCenter] = useState(initialPlotCenter);
  const [plotWidth, setPlotWidth] = useState(initialPlotWidth);

  const plotRange = useMemo(() => {
    const plotHeight = (plotWidth / frameWidth) * frameHeight;
    return {
      xmin: plotCenter.x - (1 / 2) * plotWidth,
      xmax: plotCenter.x + (1 / 2) * plotWidth,
      ymin: plotCenter.y - (1 / 2) * plotHeight,
      ymax: plotCenter.y + (1 / 2) * plotHeight,
    };
  }, [frameWidth, frameHeight, plotCenter, plotWidth]);

  const xScale = d3
    .scaleLinear()
    .domain([plotRange.xmin, plotRange.xmax])
    .range([0, frameWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([plotRange.ymin, plotRange.ymax])
    .range([frameHeight, 0]);

  return (
    <svg width={frameWidth} height={frameHeight}>
      <FrameContext.Provider
        value={{
          xScale,
          yScale,
          frameWidth,
          frameHeight,
          plotWidth,
          plotRange,
          plotCenter,
          container,
        }}
      >
        {children}
      </FrameContext.Provider>
    </svg>
  );
};