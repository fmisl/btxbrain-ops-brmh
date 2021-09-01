// import "./styles.css";
import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts";


class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;
    const txtLength = payload.value.split("-").length;
    return (
      <g transform={`translate(${x},${y})`}>
        {txtLength == 1 && (
          <text
            x={0}
            y={0}
            dy={10}
            fontSize={9}
            textAnchor="middle"
            fill="#666"
          >
            {payload.value}
          </text>
        )}
        {txtLength == 2 && (
          <>
            <text
              x={0}
              y={0}
              dy={6}
              fontSize={9}
              textAnchor="middle"
              fill="#666"
            >
              {payload.value.split("-")[0]}
            </text>
            <text
              x={0}
              y={0}
              dy={16}
              fontSize={9}
              textAnchor="middle"
              fill="#666"
            >
              {payload.value.split("-")[1]}
            </text>
          </>
        )}
      </g>
    );
  }
}

export default function ReportBar({Global,
  Frontal,
  Precuneus_PCC,
  Parietal,
  Lateral_temporal,
  Medial_temporal,
  Occipital,}) {

const data = [
  {
    name: "Global",
    suvr: Global,
  },
  {
    name: "Frontal",
    suvr: Frontal,
  },
  {
    name: "Precuneus-PCC",
    suvr: Precuneus_PCC,
  },
  {
    name: "Parietal",
    suvr: Parietal,
  },
  {
    name: "Lateral-temporal",
    suvr: Lateral_temporal,
  },
  {
    name: "Medial-temporal",
    suvr: Medial_temporal,
  },
  {
    name: "Occipital",
    suvr: Occipital,
  },
];
  console.log(Global,
    Frontal,
    Precuneus_PCC,
    Parietal,
    Lateral_temporal,
    Medial_temporal,
    Occipital,)
  return (
    <BarChart
      width={650}
      height={160}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: -20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      {/* <Tooltip cursor={{ fill: "red" }} followPointer={false} /> */}
      {/* <XAxis dataKey="name" interval={0} angle={0} dy={10} fontSize={12}> */}
      {/* <Label value="1" offset={0}/> */}
      {/* </XAxis> */}
      {/* <XAxis dataKey="name" interval={0} angle={0} dy={10} fontSize={12}/> */}
      <XAxis
        dataKey="name"
        interval={0}
        fontSize={9}
        style={{ fill: "black" }}
        tick={<CustomizedAxisTick />}
      />
      {/* <Label value="Pages of my website" offset={0} position="insideBottom" /> */}
      {/* </XAxis> */}
      <YAxis
        label={{
          value: "SUVR",
          angle: -90,
          // position: "insideLeft",
          fill: "#666",
          fontWeight: "bold",
          padding: 0,
        }}
        width={100}
        // domain={[0, (dataMax) => Math.min(2.4, dataMax + 1)]}
        domain={[0, (dataMax) => dataMax+0.2]}
        style={{ fill: "black" }}
        scale="linear"
        tickCount={8}
      />
      {/* <Tooltip /> */}
      {/* <Legend /> */}
      {/* <Bar dataKey="suvr" fill="#82ca9d"/> */}
      <Bar
        dataKey="suvr"
        fill="#014CA3"
        barSize={25}
        radius={[5, 5, 0, 0]}
      ></Bar>
    </BarChart>
  );
}
