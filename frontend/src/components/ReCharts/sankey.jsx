import { Sankey } from "recharts";
import PropTypes from 'prop-types';

const SankeyRes = ({ data = [] }) => {
  // Filter out items with no votes and create class mapping
  const validResults = data.filter(res => (res.vote_count || 0) > 0);
  
  // Create mapping from original class_index to sequential indices
  const classIndexMap = {};
  validResults.forEach((res, index) => {
    classIndexMap[res.class_index] = index;
  });

  // Calculate total votes needed
  const totalVotes = validResults.reduce((sum, res) => sum + (res.vote_count || 0), 0);
  
  // Create dummy vote nodes
  const voteNodes = Array(Math.max(totalVotes, 1)).fill(null);

  // Create nodes
  const nodes = [
    ...voteNodes.map((_, i) => ({ name: `Vote ${i + 1}` })),
    ...validResults.map(res => ({ name: res.predicted_class }))
  ];

  // Create links
  let voteIndex = 0;
  const links = validResults.flatMap((res) => {
    const resLinks = [];
    const votes = res.vote_count || 0;
    
    for (let i = 0; i < votes; i++) {
      resLinks.push({
        source: voteIndex++,
        target: voteNodes.length + classIndexMap[res.class_index],
        value: res.max_confidence || 0.1
      });
    }
    return resLinks;
  });

  // Fallback if no valid data
  if (nodes.length < 2 || links.length === 0) {
    return (
      <div style={{ width: 800, height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Not enough data to display the Sankey diagram</p>
      </div>
    );
  }

  return (
    <Sankey
      width={800}
      height={500}
      data={{ nodes, links }}
      nodePadding={50}
      margin={{ left: 200, right: 200, top: 20, bottom: 20 }}
      node={{
        stroke: '#333',
        strokeWidth: 1,
        width: 20,
        height: 20
      }}
      link={{
        stroke: '#7bc0f9',
        strokeWidth: 0.5,
        fillOpacity: 0.6,
        curvature: 0.3
      }}
    />
  );
};

SankeyRes.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      class_index: PropTypes.number,
      predicted_class: PropTypes.string,
      confidence: PropTypes.number,
      vote_count: PropTypes.number,
      max_confidence: PropTypes.number
    })
  )
};

SankeyRes.defaultProps = {
  data: []
};

export default SankeyRes;