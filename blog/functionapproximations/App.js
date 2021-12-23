import {useState, useEffect} from "react";
import {
  PlotFrame,
  PlotPoint,
  PlotLineSegment,
  PlotFunction,
  PlotHorizontal,
  PlotVertical,
  PlotGridLines,
  PlotAxisLabels,
} from "../../components/Plot";
import {Interpolation} from "./Interpolation.js";

export const App = ({ container }) => {
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
      plotCenter={{ x: 0, y: 0 }}
      plotWidth={10}
      container={container}
      >
      <PlotGridLines />
      <PlotAxisLabels />
      <PlotVertical x={4} />
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
      <Interpolation />
    </PlotFrame>
  );
};
