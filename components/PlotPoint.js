import {
  useState,
  useContext,
  useCallback,
  useEffect
} from "react";
import { FrameContext } from "./PlotFrame";

export const PlotPoint = ({
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
