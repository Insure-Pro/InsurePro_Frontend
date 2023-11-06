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
    ap확률: 14,
  },
  {
    name: "AD",
    ap확률: 11,
  },
  {
    name: "CD",
    ap확률: 6,
  },
  {
    name: "CP",
    ap확률: 12,
  },
  {
    name: "JD",
    ap확률: 4,
  },
];
const colors = ["#F87676", "#F4A358", "#53B1FD", "#26CEB6", "#F1BEEF"];

const ApGraph = () => (
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
      <Bar dataKey="ap확률" background={{ fill: "#eee" }}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} /> // 각 막대의 색상 지정
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export default ApGraph;
