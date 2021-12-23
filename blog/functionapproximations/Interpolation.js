// From: https://stackoverflow.com/a/46025101
export const clone2D = (arr) => {
  return arr.map((i) => [...i]);
};

// Algorithm from "Numerical Methods and Computing"
// seventh edition by Cheney and Kincaid,
// section 4.1 page 165.
const getDividedDifferences = (points) => {
  const n = points.length - 1;
  const diff = new Array(n + 1);
  for (let i = 0; i <= n; i++) {
    diff[i] = points[i][1];
  }
  for (let j = 1; j <= n; j++) {
    for (let i = n; i >= j; i--) {
      diff[i] = (diff[i] - diff[i - 1]) / (points[i][0] - points[i - j][0]);
    }
  }

  return diff;
};

// Formula from "Numerical Methods and Computing"
// seventh edition by Cheney and Kincaid,
// section 4.1 page 160.
export const getNewtonInterpolation = (points) => {
  const n = points.length - 1;
  for (let i = 0; i <= n; i++) {
    for (let j = i + 1; j <= n; j++) {
      if (points[i][0] == points[j][0]) {
        return null;
      }
    }
  }

  const diff = getDividedDifferences(points);

  return (x) => {
    let sum = 0;
    for (let i = 0; i <= n; i++) {
      let product = 1;
      for (let j = 0; j <= i - 1; j++) {
        product = product * (x - points[j][0]);
      }
      sum = sum + diff[i] * product;
    }

    return sum;
  };
};
