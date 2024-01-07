import React, { PureComponent } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Sector,
} from "recharts";
const colors = [
  "var(--color-1)",
  "var(--color-2)",
  "var(--color-3)",
  "var(--color-4)",
  "var(--color-5)",
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";
  // ... (the same as in your provided code)
  const activeInnerRadius = innerRadius; // 활성 상태에서 더 큰 내부 반경
  const activeOuterRadius = outerRadius + 5; // 활성 상태에서 더 큰 외부 반경

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={activeInnerRadius}
        outerRadius={activeOuterRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      // ... 나머지 렌더링 로직을 추가합니다.
    </g>
  );
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

export default class ContractGraph extends PureComponent {
  state = {
    activeIndex: 0,
  };

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };
  createChartData = () => {
    const { data } = this.props; // props에서 data를 가져옵니다.

    return [
      { name: "OD", 청약건수: data.OD ?? 0 },
      { name: "AD", 청약건수: data.AD ?? 0 },
      { name: "CD", 청약건수: data.CD ?? 0 },
      { name: "CP", 청약건수: data.CP ?? 0 },
      { name: "JD", 청약건수: data.JD ?? 0 },
    ];
  };

  render() {
    const chartData = this.createChartData(); // 차트 데이터를 생성합니다.
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 80 }}>
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={90}
            outerRadius={110}
            fill="#8884d8"
            dataKey="청약건수"
            onMouseEnter={this.onPieEnter}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            itemStyle={{
              fontSize: "14px",
              marginBottom: "-4px",
              marginTop: "-4px",
            }}
          />
          <Legend
            content={CustomLegend}
            wrapperStyle={{
              top: 180,
              left: 50, // 이 값을 조정하여 레전드의 위치를 왼쪽으로 이동시킵니다.
              position: "absolute",
              width: "80px",
              color: "var(--LightMode-Subtext)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
