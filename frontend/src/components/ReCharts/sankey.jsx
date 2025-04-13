import React from 'react';
import { Sankey, Tooltip } from 'recharts';
import PropTypes from 'prop-types';

// Custom Node with ALWAYS-VISIBLE labels
const CustomNode = ({ x, y, width, height, index, payload, containerWidth }) => {
  const isOuterNode = index === 0 || index === containerWidth; // Adjust logic as needed
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={index === 0 ? "#8884d8" : "#82ca9d"}
        stroke="#333"
        strokeWidth={1}
      />
      <text
        x={x + (index === 0 ? width + 10 : -10)} // Force left/right positioning
        y={y + height / 2}
        textAnchor={index === 0 ? "start" : "end"}
        dy="0.35em"
        fill="#333"
        fontSize={12}
        fontWeight="bold"
      >
        {payload.name}
      </text>
    </g>
  );
};

const SankeyRes = ({ predictionResult }) => {
  // Normalize data (clamp confidence to avoid extreme values)
  const normalizeConfidence = (confidence) => {
    const clamped = Math.max(0.05, Math.min(0.99, confidence)); // Force into [0.05, 0.99]
    return Number(clamped.toFixed(2));
  };

  const data = (predictionResult?.combined_result || [])
    .filter(res => res.confidence > 0)
    .map(res => ({
      ...res,
      confidence: normalizeConfidence(res.confidence),
    }));

  // Nodes: Source (Predictions) → Targets (Classes)
  const nodes = [
    { name: 'Predictions' },
    ...data.map(res => ({ name: res.predicted_class })),
  ];

  // Links: Flow strength = confidence (scaled up)
  const links = data.map((res, index) => ({
    source: 0,
    target: index + 1,
    value: res.confidence * 100, // Ensures visibility
  }));

  // Fallback if no data
  if (nodes.length < 2) {
    return <p>Not enough data to display the Sankey diagram</p>;
  }

  return (
    <div style={{ width: '100%', overflow: 'visible' }}>
      <Sankey
        width={1000} // Increased for label space
        height={600}
        data={{ nodes, links }}
        nodePadding={60}
        margin={{ left: 150, right: 150, top: 50, bottom: 50 }} // More margin for labels
        node={{
          render: (props) => <CustomNode {...props} containerWidth={1000} />,
        }}
        link={{
          stroke:"#7bc0f9",
          strokeWidth: 50, // Thicker for visibility
          fillOpacity: 0.8,
          curvature: 0.4,
        }}
      >
        <Tooltip 
          formatter={(value, name) => [`Confidence: ${value}%`, name]} 
        />
      </Sankey>
    </div>
  );
};

SankeyRes.propTypes = {
  predictionResult: PropTypes.shape({
    combined_result: PropTypes.arrayOf(
      PropTypes.shape({
        predicted_class: PropTypes.string,
        confidence: PropTypes.number,
      })
    ),
  }),
};

export default SankeyRes;