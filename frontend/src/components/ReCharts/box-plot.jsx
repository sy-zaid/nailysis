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

  // Better transformation
  const transformedData = {};
  Object.entries(data).forEach(([disease, confidences]) => {
    transformedData[disease] = confidences.map(c => -Math.log10(1 - c));
  });

  const allValues = Object.values(transformedData).flat();
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  const valueScale = scaleLinear({
    domain: [minValue * 0.9, maxValue * 1.1], // Add some padding
    range: [350, 50], // More room for labels
  });

  return (
    <svg width={800} height={400}>
      {Object.entries(transformedData).map(([disease, confidences], i) => {
        const x = i * 150 + 100;

        // Only show box plot if we have enough data
        if (confidences.length < 2) {
          return (
            <g key={disease}>
              <circle cx={x} cy={valueScale(confidences[0])} r={5} fill="red" />
              <text x={x} y={350} textAnchor="middle" fontSize={12}>
                {disease}
              </text>
            </g>
          );
        }

        return (
          <g key={disease}>
            <BoxPlot
              valueScale={valueScale}
              x={x}
              min={Math.min(...confidences)}
              max={Math.max(...confidences)}
              firstQuartile={calculateQ1(confidences)}
              median={calculateMedian(confidences)}
              thirdQuartile={calculateQ3(confidences)}
              boxWidth={40}
              fill="#8884d8"
              stroke="#333"
              orientation="vertical"
            />
            <text x={x} y={380} textAnchor="middle" fontSize={12}>
              {disease}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default BoxPlotRes;