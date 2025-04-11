import { BoxPlot } from "@visx/stats";

const ConfidenceBoxPlot = ({ diseaseConfidences }) => (
  <div style={{ height: 400 }}>
    {Object.entries(diseaseConfidences).map(([disease, confidences], i) => (
      <BoxPlot
        key={disease}
        left={i * 100 + 50}
        min={Math.min(...confidences)}
        max={Math.max(...confidences)}
        firstQuartile={calculateQ1(confidences)}
        median={calculateMedian(confidences)}
        thirdQuartile={calculateQ3(confidences)}
        fill="#8884d8"
        stroke="#333"
      />
    ))}
  </div>
);

export default ConfidenceBoxPlot;
