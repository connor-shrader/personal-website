export const getFixedPosition = (original, pixels, distance) => {
  if (original < pixels * distance) {
    return pixels * distance;
  } else if (original > pixels * (1 - distance)) {
    return pixels * (1 - distance);
  }
  return original;
};

export const combineClassNames = (...args) => {
  if (args.length == 0) {
    return "";
  }
  if (args.length == 1) {
    return args[0] ? args[0] : "";
  }
  const original = combineClassNames(...args.slice(0, args.length - 1));
  const addition = args[args.length - 1];
  return addition ? original + " " + addition : original;
};

export const convertFrameToPlotDifference = (frameX, frameY, aspectRatio) => {
  return [frameX * aspectRatio, -frameY * aspectRatio]
}