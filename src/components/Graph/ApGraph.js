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
  const formattedData = Object.keys(data)
    .filter((key) => key !== "All") // 'All' 타입 제거
    .map((key) => ({
      name: key,
      // ap확률: data[key].ratio ?? 0,
      ap개수: data[key].count ?? 0,
      fill: data[key].color || "#cccccc", // 색상 동적 적용
    }));

  console.log("Formatted Data for ApGraph:", formattedData);
  return formattedData;
};

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
          display: "flex",
          fontSize: "12px",
          height: "32px",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
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
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={100}
        height={100}
        data={chartData}
        layout="horizontal"
        // label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        // padding={{ bottom: "20px" }}
        margin={{
          top: 30,
          right: 30,
          left: -12,
          bottom: 25,
        }}
        barSize={20}
      >
        <CartesianGrid display="none" />
        <XAxis
          dataKey="name"
          type="category"
          fontSize={"12px"}
          // tickLine={false}
          tick={{ fontSize: 12 }}
          // display={"none"}
        />
        <YAxis
          // dataKey="number"
          type="number"
          // scale="point"
          fontSize={"12px"}
          domain={[0, "auto"]}
          // domain={[0, totalTaCount]}
          // domain={[0, 10]}
          // tick={{ fontSize: 12 }}
          // padding={{ bottom: -12, top: 5 }}
          tickLine={false}
          allowDecimals={false} // Y축이 정수만 표시되도록 수정
          // display={"none"}
        />
        <Tooltip content={<CustomTooltip chartData={chartData} />} />
        {/* <Legend
          align="center"
          verticalAlign="bottom"
          content={CustomLegend}
          wrapperStyle={{
            // left: 30,
            // top: 28,
            display: "flex",
            width: "100%",
            paddingTop: "10px",
            fontSize: "12px",
            color: "var(--LightMode-Subtext)",
          }}
          layout="horizontal"
          payload={chartData.map((entry) => ({
            color: entry.fill,
            value: entry.name,
            type: "square",
          }))}
        /> */}

        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <Bar dataKey="ap개수" background={{ fill: "#eee" }}>
          {chartData.map((entry, index) => {
            console.log(
              `Cell Fill Value for ${entry.name}:AP Count: ${entry.ap개수}, ${entry.fill}`,
            ); // Debugging line
            return (
              <Cell key={`cell-${index}`} fill={entry.fill || "#cccccc"} />
            ); // Fallback color added
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
export default ApGraph;
