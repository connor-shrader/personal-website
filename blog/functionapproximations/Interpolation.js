import {useState, useMemo} from "react";
import {PlotPoint, PlotHorizontal} from "../../components/Plot";

export const Interpolation = () => {
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
