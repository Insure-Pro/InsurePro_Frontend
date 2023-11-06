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
  Cell,
} from "recharts";

const data = [
  {
    name: "OD",
    pc확률: 6,
  },
  {
    name: "AD",
    pc확률: 2,
  },
  {
    name: "CD",
    pc확률: 5,
  },
  {
    name: "CP",
    pc확률: 3,
  },
  {
    name: "JD",
    pc확률: 1,
  },
];
const colors = ["#F87676", "#F4A358", "#53B1FD", "#26CEB6", "#F1BEEF"];

const PcGraph = () => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      width={500}
      height={300}
      data={data}
      layout="vertical"
      padding={{ bottom: "41px" }}
      margin={{
        top: 30,
        right: 30,
        left: 4,
        bottom: -5,
      }}
      barSize={15}
    >
      <XAxis type="number" fontSize={"12px"} tickLine={false} />
      <YAxis
        dataKey="name"
        type="category"
        scale="point"
        fontSize={"12px"}
        padding={{ top: 10, bottom: 10 }}
        marginTop={"115px"}
        tickLine={false}
      />
      <Tooltip />
      <Legend
        align="left"
        verticalAlign="top"
        wrapperStyle={{ left: 14, top: 12 }}
      />
      <CartesianGrid strokeDasharray="3 3" />
      <Bar dataKey="pc확률" background={{ fill: "#eee" }}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} /> // 각 막대의 색상 지정
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export default PcGraph;
