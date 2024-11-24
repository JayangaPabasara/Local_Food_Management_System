import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const TopSoldItemsPieChart = ({ topSoldItems }) => {
  return (
    <div
      className="pie-chart-container"
      style={{ margin: "20px 0px 20px 150px" }}
    >
      <h2
        style={{
          marginLeft: "150px",
          fontSize: "20px",
          color: "#165ffd",
          marginTop: "40px",
        }}
      >
        Top Four Most Sold Food Items
      </h2>
      <PieChart width={500} height={300}>
        <Pie
          data={topSoldItems}
          dataKey="quantity"
          nameKey="name"
          cx="30%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {topSoldItems.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </div>
  );
};

export default TopSoldItemsPieChart;
