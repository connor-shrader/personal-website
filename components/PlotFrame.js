import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
  createContext,
} from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import Draggable from "react-draggable";

const container = document.getElementById("interactive");

const FrameContext = React.createContext(null);

const PlotFrame = ({
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

const PlotPoint = ({
  x = 0,
  y = 0,
  size = 20,
  draggable = false,
  onDrag = null,
  ...rest
}) => {
  const [dragPos, setDragPos] = useState(null);
  const { xScale, yScale, container, frameWidth, frameHeight, plotWidth } =
    useContext(FrameContext);

  const onMouseDown = useCallback(
    (event) => {
      if (!draggable) return;

      const { clientX, clientY } = event;
      const { left, top } = container.getBoundingClientRect();

      setDragPos({
        frameX: clientX - left,
        frameY: clientY - top,
      });
    },
    [x, y, draggable, dragPos]
  );

  const onMouseMove = useCallback((event) => {
    if (!draggable || !dragPos) return;

    const { clientX, clientY } = event;
    const { left, top } = container.getBoundingClientRect();

    const frameX = clientX - left;
    const frameY = clientY - top;

    const frameDx = frameX - dragPos.frameX;
    const frameDy = frameY - dragPos.frameY;
    const plotDx = (frameDx / frameWidth) * plotWidth;

    const plotHeight = (plotWidth / frameWidth) * frameHeight;
    const plotDy = (-frameDy / frameHeight) * plotHeight;

    setDragPos({
      frameX: clientX - left,
      frameY: clientY - top,
    });

    onDrag({ frameDx, frameDy, plotDx, plotDy });
  });

  const onMouseUp = useCallback(
    (event) => {
      setDragPos(null);
    },
    [onDrag, dragPos]
  );

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  });

  return (
    <circle
      onMouseDown={onMouseDown}
      cx={xScale(x)}
      cy={yScale(y)}
      r={size}
      {...rest}
    />
  );
};

const PlotLineSegment = ({ x1, x2, y1, y2, className = null }) => {
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

const PlotFunction = ({ fun = (x) => x, className = null }) => {
  const { frameWidth, xScale, yScale } = useContext(FrameContext);

  const frameX = d3.range(frameWidth + 1);
  const plotX = frameX.map((x) => xScale.invert(x));
  const plotY = plotX.map((x) => fun(x));
  const frameY = plotY.map((y) => yScale(y));
  const plotPoints = frameX.map((x, i) => [x, frameY[i]]);

  let i = 0;
  while (i < plotPoints.length) {
    if (isNaN(frameY[i])) {
      plotPoints.splice(i, 1);
      console.warn("Function " + fun + " NaN at x = " + plotX[i] + ".");
    }

    i++;
  }

  const line = d3.line()(plotPoints);

  return <path d={line} stroke="black" fill="none" />;
};

const PlotHorizontal = ({ y, x1 = null, x2 = null, className = null }) => {
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

const PlotVertical = ({ x, y1 = null, y2 = null, className = null }) => {
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

const maxAxisDistanceFromEdge = 0.05;

const PlotVerticalGridLines = ({ tickSize = null, className = null }) => {
  const { xScale, yScale, plotCenter, frameHeight } = useContext(FrameContext);

  if (tickSize === null) {
    tickSize = yScale(plotCenter.y);
  }

  let axisFrameY = yScale(0);
  if (axisFrameY < frameHeight * maxAxisDistanceFromEdge) {
    axisFrameY = frameHeight * maxAxisDistanceFromEdge;
  } else if (axisFrameY > frameHeight * (1 - maxAxisDistanceFromEdge)) {
    axisFrameY = frameHeight * (1 - maxAxisDistanceFromEdge);
  }

  return xScale.ticks().map((xTickValue) => (
    <g
      transform={`translate(${xScale(xTickValue)}, ${axisFrameY})`}
      key={xTickValue}
    >
      <PlotVertical
        // Apparently ignoring the prop "x" sets x to undefined, which works exactly as I need.
        y1={tickSize}
        y2={-tickSize}
        className={`${className} plot-gridline plot-gridline-vertical`}
      />
      <text style={{ textAnchor: "middle", dominantBaseline: "middle" }}>
        {xTickValue}
      </text>
    </g>
  ));
};

const PlotHorizontalGridLines = ({ tickSize = null, className = null }) => {
  const { xScale, yScale, plotCenter, frameWidth, frameHeight } =
    useContext(FrameContext);

  const numTicks = Math.round(
    (xScale.ticks().length * frameHeight) / frameWidth
  );

  if (tickSize === null) {
    tickSize = xScale(plotCenter.x);
  }

  let axisFrameX = xScale(0);
  if (axisFrameX < frameWidth * maxAxisDistanceFromEdge) {
    axisFrameX = frameWidth * maxAxisDistanceFromEdge;
  } else if (axisFrameX > frameWidth * (1 - maxAxisDistanceFromEdge)) {
    axisFrameX = frameWidth * (1 - maxAxisDistanceFromEdge);
  }

  return yScale.ticks(numTicks).map((yTickValue) => (
    <g
      transform={`translate(${axisFrameX}, ${yScale(yTickValue)})`}
      key={yTickValue}
    >
      <PlotHorizontal
        // Apparently ignoring the prop "x" sets x to undefined, which works exactly as I need.
        x1={tickSize}
        x2={-tickSize}
        className={`${className} plot-gridline plot-gridline-horizontal`}
      />
      <text style={{ textAnchor: "middle", dominantBaseline: "middle" }}>
        {yTickValue}
      </text>
    </g>
  ));
};

// const Interpolation = () => {
//   const [points, setPoints] = useState([
//     { x: 0, y: 0 },
//     { x: 1, y: 1 },
//   ]);

//   const interpolationFunction = useMemo(() => {
//     const x1 = points[0].x;
//     const x2 = points[1].x;
//     const y1 = points[0].y;
//     const y2 = points[1].y;

//     return (x) => y1 + ((y2 - y1) / (x2 - x1)) * (x - x1);
//   }, [points]);

//   return (
//     <>
//       <PlotFunction fun={interpolationFunction} />
//       {points.map((point, i) => (
//         <Draggable onDrag={handleDrag}>
//           <PlotPoint x={point.x} y={point.y} size={10} />
//         </Draggable>
//       ))}
//     </>
//   );
// };

const Interpolation = () => {
  const [point, setPoint] = useState({ x: 1, y: 1 });

  const currY = useMemo(() => {
    return point.y;
  }, [point]);

  const updatePos = (info) => {
    setPoint({ x: point.x + info.plotDx, y: point.y + info.plotDy });
  };

  return (
    // <>
    //   <PlotFunction fun={interpolationFunction} />
    //   {points.map((point, i) => (
    //     <Draggable onDrag={handleDrag}>
    //       <PlotPoint x={point.x} y={point.y} size={10} />
    //     </Draggable>
    //   ))}
    // </>
    <>
      <PlotPoint x={point.x} y={point.y} draggable={true} onDrag={updatePos} />
      <PlotHorizontal y={currY} />
    </>
  );
};

const App = ({ container }) => {
  const [appWidth, setAppWidth] = useState(container.offsetWidth);
  const [appHeight, setAppHeight] = useState(container.offsetHeight);

  useEffect(() => {
    const handleResize = () => {
      setAppWidth(container.offsetWidth);
      setAppHeight(container.offsetHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [appWidth, appHeight]);

  return (
    <PlotFrame
      frameWidth={appWidth}
      frameHeight={appHeight}
      plotCenter={{ x: 2, y: 3 }}
      plotWidth={12}
      container={container}
    >
      <PlotPoint x={0} y={0} size={10} />
      <PlotPoint x={1} y={0} size={10} />
      <PlotPoint x={5} y={0} size={10} />
      <PlotPoint x={0} y={1} size={10} />
      <PlotPoint x={0} y={5} size={10} />
      <PlotLineSegment x1={-1} x2={1} y1={0.5} y2={0.5} />
      <PlotFunction fun={(x) => x * x} />
      <PlotHorizontal x1={-3} x2={0} y={1} />
      <PlotHorizontal y={2} />
      <PlotVertical x={3} y1={0} y2={3} />
      <PlotVertical x={4} />
      <PlotVerticalGridLines />
      <PlotHorizontalGridLines />
      <Interpolation />
    </PlotFrame>
  );
};

ReactDOM.render(<App container={container} />, container);
