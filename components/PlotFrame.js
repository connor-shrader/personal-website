import {
  useState,
  useMemo,
  createContext,
} from "react";
import * as d3 from "d3";
import { DraggableCore } from "react-draggable";
import { convertFrameToPlotDifference } from "./PlotUtility";
import { useGesture } from "@use-gesture/react";

export const FrameContext = createContext(null);

export const PlotFrame = ({
  container,
  plotCenter: defaultCenter = {x: 0, y: 0},
  plotWidth: defaultWidth = 10,
  pannable = false,
  children,
  ...rest
}) => {
  const [plotCenter, setPlotCenter] = useState(defaultCenter);
  const [plotWidth, setPlotWidth] = useState(defaultWidth);

  const frameWidth = container.width;
  const frameHeight = container.height;
  const plotFrameRatio = plotWidth / frameWidth;
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

  // const startHandler = (event, data) => {
  //   if (pannable && event.target.tagName == "svg") setPanning(true);
  // };

  // const dragHandler = (event, data) => {
  //   if (pannable && panning) {
  //     const [plotDeltaX, plotDeltaY] = convertFrameToPlotDifference(
  //       data.deltaX,
  //       data.deltaY,
  //       plotFrameRatio
  //     );

  //     setPlotCenter({x: plotCenter.x - plotDeltaX, y: plotCenter.y - plotDeltaY});
  //   }
  // };

  // const stopHandler = (event, data) => {
  //   if (pannable) setPanning(false);
  // };

  const gest = useGesture({
    onDrag: (state) => {
      if (state.target.tagName != "svg") return;

      const [plotDeltaX, plotDeltaY] = convertFrameToPlotDifference(
        state.delta[0],
        state.delta[1],
        plotFrameRatio
      );

      setPlotCenter({
        x: plotCenter.x - plotDeltaX,
        y: plotCenter.y - plotDeltaY,
      });
    },
    onWheel: (state) => {
      const scrollDown = state.delta[1] > 0;

      if (scrollDown) {
        setPlotWidth(1.25 * plotWidth);
      } else {
        setPlotWidth(0.8 * plotWidth);
      }

      // Scroll events happen twice at a time, for some reason.
      // This code times scrolls out for 0.05s after each scroll.
      // See https://stackoverflow.com/a/22018607
      $(window).scroll(function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          // do your stuff
        }, 50);
      });
    },
  }, {
    eventOptions: {passive: false}
  });

  return (
    <svg width={frameWidth} height={frameHeight} {...rest} {...gest()}>
      <FrameContext.Provider
        value={{
          xScale,
          yScale,
          frameWidth,
          frameHeight,
          plotFrameRatio,
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