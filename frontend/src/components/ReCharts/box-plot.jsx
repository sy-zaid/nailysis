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
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    return <div>No data available</div>;
  }

  // Get global min & max for scale
  const allValues = Object.values(data).flat();
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  // Create Y scale (horizontal boxplot)
  const valueScale = scaleLinear({
    domain: [minValue, maxValue],
    range: [0, 600], // adjust based on SVG width
  });

  return (
    <svg width={800} height={400}>
      {Object.entries(data).map(([disease, confidences], i) => {
        const x = i * 150 + 60;

        return (
          <BoxPlot
            key={disease}
            valueScale={valueScale}
            y={x}
            min={Math.min(...confidences)}
            max={Math.max(...confidences)}
            firstQuartile={calculateQ1(confidences)}
            median={calculateMedian(confidences)}
            thirdQuartile={calculateQ3(confidences)}
            boxWidth={40}
            fill="#8884d8"
            stroke="#333"
            orientation="horizontal"
          />
        );
      })}
    </svg>
  );
};

export default BoxPlotRes;
