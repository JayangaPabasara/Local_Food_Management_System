import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BarGraph = ({ data, categories, graphRef }) => {
  return (
    <div className="graph-container" ref={graphRef}>
      <h2
        style={{
          textAlign: "center",
          fontSize: "20px",
          color: "#165ffd",
          marginTop: "40px",
        }}
      >
        Food Category Distribution
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          animationDuration={1000}
          isAnimationActive={true}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="province" />
          <YAxis />
          <Tooltip />
          <Legend />
          {categories.map((category, index) => (
            <Bar
              key={index}
              dataKey={category}
              fill={["#8884d8", "#82ca9d", "#ffc658", "#05acacfc"][index % 4]}
              animationDuration={500}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarGraph;
