import { PieChart, Pie, ResponsiveContainer, Cell, Label } from "recharts";

const COLORS = ["#6366f1", "#e5e7eb"]; // Violet + Light gray

const PieChartRes = ({ data }) => {
  if (!data) return null;

  // Show percentage with 1 decimal point
  const confidencePercent = parseFloat((data.confidence * 100).toFixed(1));
  const remaining = parseFloat((100 - confidencePercent).toFixed(1));

  const chartData = [
    { name: "Confidence", value: confidencePercent },
    { name: "Remaining", value: remaining },
  ];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={92}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

            {/* Main confidence percentage */}
            <Label
              value={`${confidencePercent}%`}
              position="center"
              fill="#333"
              fontSize={24}
              fontWeight="bold"
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartRes;
