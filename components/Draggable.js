import { useState } from "react";

const Draggable = ({
  onDrag,
  children,
  ...rest
}) => {
  const [dragPosition, setDragPosition] = useState(null);

  const onMouseDown = useCallback((event) => {
    const {clientX, clientY} = event;

    setDragPos({
      frameX: clientX - left,
      frameY: clientY - top,
    });
  }, [dragPos, frameWidth, frameHeight]);

  const onMouseMove = useCallback((event) => {
    if (!dragPosition) return;

    const { clientX, clientY } = event;

    // Position of the mouse relative to the top-left corner of the PlotFrame.
    const frameX = clientX - left;
    const frameY = clientY - top;

    // The change in the mouse position compared to the previous position.
    const frameDx = frameX - dragPos.frameX;
    const frameDy = frameY - dragPos.frameY;

    // The change in the mouse position (in terms of the plot coordinates)
    // since the previous position.
    const plotDx = (frameDx / frameWidth) * plotWidth;
    const plotHeight = (plotWidth / frameWidth) * frameHeight;
    const plotDy = (-frameDy / frameHeight) * plotHeight;

    setDragPos({
      frameX: clientX - left,
      frameY: clientY - top,
    });

    // Call the onDrag function that was passed down to this component.
    onDrag({ frameDx, frameDy, plotDx, plotDy });
  })

  const onMouseUp = useCallback((event) => {
      setDragPos(null);
    }, [onDrag, dragPos]);

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  });
  
  return (
    <>
      {children}
    </>
  )
}