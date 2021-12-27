import {
  useState,
  useMemo,
  createContext,
} from "react";
import * as d3 from "d3";
import { DraggableCore } from "react-draggable";
import { convertFrameToPlotDifference } from "./PlotUtility";
import { useGesture } from "@use-gesture/react";

import { PlotPoint } from "./PlotPoint";

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
  const [pinchPos, setPinchPos] = useState(null);

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
      if (state.target.tagName != "svg" || state.pinching) return;

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
      console.log("Wheel");
      // Gesture events are automatically debounced. To avoid
      // events being doubled, we use the active property.
      // See https://github.com/pmndrs/use-gesture/issues/202
      if (!state.active) return;

      const scrollDown = state.delta[1] > 0;

      const {clientX, clientY} = state.event;
      const plotX = xScale.invert(clientX - container.left);
      const plotY = yScale.invert(clientY - container.top);

      // Between -1/2 and 1/2
      const plotRelativeX = (plotX - plotCenter.x) / plotWidth;
      const plotRelativeY = (plotY - plotCenter.y) / plotHeight;

      const newPlotWidth = (scrollDown ? 1.25 : 0.8) * plotWidth;
      const newPlotHeight = (scrollDown ? 1.25 : 0.8) * plotHeight;

      const newPlotCenterX = plotX - plotRelativeX * newPlotWidth;
      const newPlotCenterY = plotY - plotRelativeY * newPlotHeight;
      const newPlotCenter = {x: newPlotCenterX, y: newPlotCenterY};

      setPlotCenter(newPlotCenter);
      setPlotWidth(newPlotWidth);
    },
    onPinchStart: (state) => {
      const plotX = xScale.invert(state.origin[0] - container.left);
      const plotY = yScale.invert(state.origin[1] - container.top);

      setPinchPos({x: plotX, y: plotY, distance: state.da[0], plotWidth: plotWidth});
    },
    onPinch: (state) => {
      if (!pinchPos) return;
      const plotX = xScale.invert(state.origin[0] - container.left)
      const plotY = yScale.invert(state.origin[1] - container.top)

      const plotDX = plotX - pinchPos.x;
      const plotDY = plotY - pinchPos.y;
      const plotDDist = pinchPos.distance / state.da[0];

      // console.log(plotDDist);

      setPlotCenter({x: plotCenter.x - plotDX, y: plotCenter.y - plotDY});
      setPlotWidth(pinchPos.plotWidth * plotDDist);
      //setPinchPos({x: plotX, y: plotY, distance: state.da[0]})
    },
    onPinchEnd: (state) => {
      setPinchPos(null);
    }
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
        {/* <PlotPoint
          x={pinchPos ? pinchPos.x : 0}
          y={pinchPos ? pinchPos.y : 0}
        /> */}
        {children}
      </FrameContext.Provider>
    </svg>
  );
};