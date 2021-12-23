import {
  useState,
  useMemo,
  createContext,
} from "react";
import * as d3 from "d3";

export const FrameContext = createContext(null);

export const PlotFrame = ({
  container,
  plotCenter = { x: 0, y: 0 },
  plotWidth = 10,
  children,
}) => {
  const frameWidth = container.width;
  const frameHeight = container.height;
  const plotHeight = (plotWidth / frameWidth) * frameHeight;

  const plotRange = useMemo(() => {
    return {
      xmin: plotCenter.x - (1 / 2) * plotWidth,
      xmax: plotCenter.x + (1 / 2) * plotWidth,
      ymin: plotCenter.y - (1 / 2) * plotHeight,
      ymax: plotCenter.y + (1 / 2) * plotHeight,
    };
  }, [container, plotCenter, plotWidth]);

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
          left: container.left,
          top: container.top,
          plotWidth,
          plotHeight,
          plotRange,
          plotCenter,
        }}
      >
        {children}
      </FrameContext.Provider>
    </svg>
  );
};