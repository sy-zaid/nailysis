import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const ProgressBarChart = ({ percentage }) => {
  const data = [
    {
      name: "Confidence",
      value: percentage,
    },
  ];

  return (
    <div style={{ width: "100%", height: 20 }}>
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          barCategoryGap={0}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar
            dataKey="value"
            barSize={8} // thinner bar
            background={{ fill: "#e0e0e0" }} // grey non-loading area
          >
            <Cell fill="#8884d8" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ textAlign: "center", fontSize: 12, marginTop: 4 }}>
        {percentage}% Confidence
      </div>
    </div>
  );
};

export default ProgressBarChart;
