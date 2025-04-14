import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartStackedRes = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart layout="vertical" data={data} margin={{ top: 20, right: 50, left: 100, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 1]} />
        <YAxis type="category" dataKey="predicted_class" />
        <Tooltip />
        <Legend />
        <Bar dataKey="confidence" stackId="a" fill="#2196f3" name="Current Confidence" />
        <Bar dataKey="max_confidence" stackId="a" fill="#f44336" name="Max Confidence" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartStackedRes;
