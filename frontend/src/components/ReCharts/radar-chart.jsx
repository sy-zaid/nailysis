import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RadarChartRes = ({ allClassConfidences }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart
        width={400}
        height={300}
        cx="60%"
        cy="50%"
        outerRadius={80}
        margin={{ top: 20, right: 50, bottom: 20, left: 50 }}
        data={allClassConfidences}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="predicted_class" />
        <PolarRadiusAxis angle={30} domain={[0, 1]} />
        <Radar
          name="Confidence"
          dataKey="confidence"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.6}
        />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChartRes;
