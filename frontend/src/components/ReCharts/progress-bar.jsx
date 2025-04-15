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
      <div style={{ width: "100%", height: 60 }}>
        <ResponsiveContainer>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="value" barSize={30}>
              <Cell fill="#4caf50" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ textAlign: "center", fontWeight: "bold", marginTop: 5 }}>
          {percentage}% Confidence
        </div>
      </div>
    );
  };
  
  export default ProgressBarChart;
  