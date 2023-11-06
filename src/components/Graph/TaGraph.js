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
    ta개수: 13,
    fill: "#F87676",
  },
  {
    name: "AD",
    ta개수: 18,
    fill: "#F4A358",
  },
  {
    name: "CD",
    ta개수: 8,
    fill: "#53B1FD",
  },
  {
    name: "CP",
    ta개수: 12,
    fill: "#26CEB6",
  },
  {
    name: "JD",
    ta개수: 4,
    fill: "#F1BEEF",
  },
];
const colors = ["#F87676", "#F4A358", "#53B1FD", "#26CEB6", "#F1BEEF"];
const gname = ["OD", "AD", "CD", "CP", "JD"];

const CustomLegend = (props) => {
  const { payload } = props; // 이 payload는 Recharts에서 제공하는 데이터 포맷입니다.

  return (
    <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
      {payload.map((entry, index) => (
        <li
          key={`item-${index}`}
          style={{
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: entry.color,
              marginRight: "10px",
              fontSize: "10px",
            }}
          />
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const TaGraph = () => (
  <ResponsiveContainer width="90%" height="100%">
    <BarChart
      width={300}
      height={300}
      data={data}
      layout="vertical"
      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      padding={{ bottom: "20px" }}
      margin={{
        top: 30,
        right: 30,
        left: -12,
        bottom: 25,
      }}
      barSize={10}
    >
      <CartesianGrid display="none" />
      <XAxis
        type="number"
        fontSize={"12px"}
        tickLine={false}
        display={"none"}
      />
      <YAxis
        dataKey="name"
        type="category"
        scale="point"
        fontSize={"12px"}
        padding={{ top: 10, bottom: 10 }}
        marginTop={"115px"}
        tickLine={false}
        display={"none"}
      />
      <Tooltip
        itemStyle={{
          fontSize: "12px",
          paddingTop: "0px",
          paddingBottom: "0px",
          marginBottom: "-4px",
          marginTop: "-4px",
        }}
        labelStyle={{ fontSize: "12px" }}
        labelFormatter={() => ""}
        formatter={(value, name, entry) => `${entry.payload.name} : ${value}`}
      />
      <Legend
        align="left"
        verticalAlign="top"
        content={CustomLegend}
        wrapperStyle={{ left: 30, top: 28, fontSize: "12px" }}
        layout="vertical"
        payload={data.map((entry) => ({
          color: entry.fill, // 이 부분은 해당 데이터셋의 색상에 맞게 조정해야 합니다.
          value: entry.name, // 'OD', 'AD', 'CD', 'CP', 'JD' 등의 라벨로 매핑해야 합니다.
          type: "circle", // 범례 아이콘 형태를 정사각형으로 설정합니다.
        }))}
      />
      <CartesianGrid strokeDasharray="3 3" />
      <Bar dataKey="ta개수" background={{ fill: "#eee" }}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} /> // 각 막대의 색상 지정
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export default TaGraph;
