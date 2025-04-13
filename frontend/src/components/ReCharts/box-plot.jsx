import { BoxPlot } from "@visx/stats";
import { scaleLinear } from "@visx/scale";

// --- Utility Functions ---
const calculateMedian = (arr) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

const calculateQ1 = (arr) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return calculateMedian(sorted.slice(0, mid));
};

const calculateQ3 = (arr) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const upperHalf = sorted.length % 2 === 0
    ? sorted.slice(mid)
    : sorted.slice(mid + 1);
  return calculateMedian(upperHalf);
};

// --- Main Component ---
const BoxPlotRes = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div>No data available</div>;
  }

  // Transform to log10(confidence + epsilon) to handle zeros
  const transformConfidence = (c) => Math.log10(c + 1e-10);

  const transformedData = Object.entries(data).map(([disease, confidences]) => ({
    disease,
    values: confidences.map(transformConfidence),
  }));

  const allValues = transformedData.flatMap((d) => d.values);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  // Scale setup
  const valueScale = scaleLinear({
    domain: [minValue, maxValue],
    range: [350, 50], // SVG coordinates (reversed)
  });

  return (
    <svg width={800} height={400}>
      {transformedData.map(({ disease, values }, i) => {
        const x = i * 150 + 100;
        const sorted = [...values].sort((a, b) => a - b);

        // Box plot calculations
        const min = Math.min(...values);
        const max = Math.max(...values);
        const median = calculateMedian(sorted);
        const q1 = calculateQ1(sorted);
        const q3 = calculateQ3(sorted);

        return (
          <g key={disease} transform={`translate(${x}, 0)`}>
            {/* Whiskers */}
            <line x1={0} y1={valueScale(min)} x2={0} y2={valueScale(max)} stroke="#333" />
            {/* Box */}
            <rect
              x={-20}
              y={valueScale(q3)}
              width={40}
              height={valueScale(q1) - valueScale(q3)}
              fill="#8884d8"
              stroke="#333"
            />
            {/* Median line */}
            <line x1={-20} y1={valueScale(median)} x2={20} y2={valueScale(median)} stroke="#333" strokeWidth={2} />
            {/* Disease label (rotated) */}
            <text
              x={0}
              y={370}
              textAnchor="middle"
              fontSize={10}
              transform="rotate(30, 0, 370)"
            >
              {disease.length > 12 ? `${disease.substring(0, 10)}...` : disease}
            </text>
          </g>
        );
      })}
      {/* Y-axis labels (log scale) */}
      {[-5, -10, -15].map((logVal) => (
        <text key={logVal} x={50} y={valueScale(logVal)} fontSize={10}>
          {`10^${logVal}`}
        </text>
      ))}
    </svg>
  );
};

export default BoxPlotRes;