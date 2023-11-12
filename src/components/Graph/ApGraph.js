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

const data5 = (data) => {
  return [
    {
      name: "OD",
      ap확률: data.OD ?? 0,
      ap개수: data.ODcount ?? 0,
      fill: "#F87676",
    },
    {
      name: "AD",
      ap확률: data.AD ?? 0,
      ap개수: data.ADcount ?? 0,
      fill: "#F4A358",
    },
    {
      name: "CD",
      ap확률: data.CD ?? 0,
      ap개수: data.CDcount ?? 0,
      fill: "#53B1FD",
    },
    {
      name: "CP",
      ap확률: data.CP ?? 0,
      ap개수: data.CPcount ?? 0,
      fill: "#26CEB6",
    },
    {
      name: "JD",
      ap확률: data.JD ?? 0,
      ap개수: data.JDcount ?? 0,
      fill: "#F1BEEF",
    },
  ];
};
const colors = ["#F87676", "#F4A358", "#53B1FD", "#26CEB6", "#F1BEEF"];

const CustomTooltip = ({ active, payload, label, chartData }) => {
  if (active) {
    // 해당 항목의 'ap개수' 찾기
    const apCountItem = chartData.find((item) => item.name === label);
    const apCount = apCountItem ? apCountItem["ap개수"] : 0;
    const apCountFormatted = String(apCount).padStart(2, "0");

    return (
      <div
        className="custom-tooltip"
        style={{
          fontSize: "12px",
          height: "40px",
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
          display: "flex",
        }}
      >
        <p className="label">{label}</p>
        <p className="intro">{`: ${apCountFormatted} 개`}</p>
      </div>
    );
  }

  return null;
};

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

const ApGraph = ({ data }) => {
  const chartData = data5(data);
  return (
    <ResponsiveContainer width="90%" height="100%">
      <BarChart
        width={300}
        height={300}
        data={chartData}
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
          domain={[0, 1]}
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
        <Tooltip content={<CustomTooltip chartData={chartData} />} />
        <Legend
          align="left"
          verticalAlign="top"
          content={CustomLegend}
          wrapperStyle={{ left: 30, top: 28, fontSize: "12px" }}
          layout="vertical"
          payload={chartData.map((entry) => ({
            color: entry.fill, // 이 부분은 해당 데이터셋의 색상에 맞게 조정해야 합니다.
            value: entry.name, // 'OD', 'AD', 'CD', 'CP', 'JD' 등의 라벨로 매핑해야 합니다.
            type: "circle", // 범례 아이콘 형태를 정사각형으로 설정합니다.
          }))}
        />

        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="ap확률" background={{ fill: "#eee" }}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} /> // 각 막대의 색상 지정
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
export default ApGraph;
