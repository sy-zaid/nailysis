import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PieChartVoteRes = ({ data }) => {
  // Calculate total votes
  const totalVotes = data.reduce((sum, entry) => sum + entry.vote_count, 0);

  return (
    <div
      style={{ display: "flex", justifyContent: "flex-start", padding: "20px" }}
    >
      <ResponsiveContainer width={400} height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="30%" // Moves chart more to the left
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="vote_count"
            nameKey="predicted_class"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

            {/* Custom Label on the left (centered vertically) */}
            <Label
              // value={`${totalVotes} votes`}
              // position="center"
              // offset={-100} // move label to the left
              // fontSize={16}
              // fill="#f83b4b"
  
            />
          </Pie>
          <Tooltip formatter={(value) => [`${value} votes`, "Count"]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartVoteRes;
