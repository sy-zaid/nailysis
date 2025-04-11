import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const BarChartRes = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart layout="vertical" data={data} margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="predicted_class" />
        <Tooltip />
        <Bar dataKey="confidence" fill="#00bcd4" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartRes;