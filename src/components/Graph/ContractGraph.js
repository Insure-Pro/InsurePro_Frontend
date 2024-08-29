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

// This function renders the active shape of the pie chart
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

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value}`}</text>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333">{`${
        payload.name
      } (${(percent * 100).toFixed(2)}%)`}</text>
    </g>
  );
};

// Custom legend component
const CustomLegend = (props) => {
  const { payload } = props;

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
    const { data } = this.props;

    return Object.keys(data)
      .filter((key) => key !== "All") // 'All' 타입 제거
      .map((key) => ({
        name: key,
        청약건수: data[key].count, // Use dynamic count value
        fill: data[key].color, // Use dynamic color from data
      }));
  };

  render() {
    const chartData = this.createChartData();

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 130 }}>
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
              <Cell key={`cell-${index}`} fill={entry.fill} />
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
              top: 110,
              left: 50,
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
