import { PieChart, Pie, Cell } from 'recharts';

const GaugeChartRes = ({ confidence }) => {
  const data = [
    { name: 'Confidence', value: confidence },
    { name: 'Remaining', value: 1 - confidence }
  ];

  const COLORS = ['#00e676', '#eeeeee'];

  return (
    <PieChart width={300} height={150}>
      <Pie
        data={data}
        startAngle={180}
        endAngle={0}
        innerRadius={60}
        outerRadius={80}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
      </Pie>
      <text x={150} y={90} textAnchor="middle" dominantBaseline="middle" fontSize={24} fill="#00e676">
        {(confidence * 100).toFixed(2)}%
      </text>
    </PieChart>
  );
};

export default GaugeChartRes;
