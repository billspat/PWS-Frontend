import React from "react";

interface DataPoint {
  [key: string]: number;
}

interface GraphProps {
  data: DataPoint[];
  xAxis: string;
  yAxis: string;
  xLabel: string;
  yLabel: string;
}

export function Graph({ data, xAxis, yAxis, xLabel, yLabel }: GraphProps) {
  console.log("Graph data:", data);

  const svgWidth = 800;
  const svgHeight = 400;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const xValues = data.map((d) => d[xAxis]);
  const yValues = data.map((d) => d[yAxis]);

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  console.log(`X range: ${xMin} to ${xMax}`);
  console.log(`Y range: ${yMin} to ${yMax}`);

  const xScale = (value: number) => ((value - xMin) / (xMax - xMin)) * width;
  const yScale = (value: number) =>
    height - ((value - yMin) / (yMax - yMin)) * height;

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* X-axis */}
        <line x1={0} y1={height} x2={width} y2={height} stroke="black" />
        {[xMin, (xMin + xMax) / 2, xMax].map((value, i) => (
          <text key={i} x={xScale(value)} y={height + 20} textAnchor="middle">
            {value.toFixed(1)}
          </text>
        ))}
        <text x={width / 2} y={height + 40} textAnchor="middle">
          {xLabel}
        </text>

        {/* Y-axis */}
        <line x1={0} y1={0} x2={0} y2={height} stroke="black" />
        {[yMin, (yMin + yMax) / 2, yMax].map((value, i) => (
          <text
            key={i}
            x={-10}
            y={yScale(value)}
            textAnchor="end"
            dominantBaseline="middle"
          >
            {value.toFixed(1)}
          </text>
        ))}
        <text
          transform={`rotate(-90) translate(-${height / 2}, -30)`}
          textAnchor="middle"
        >
          {yLabel}
        </text>

        {/* Data line */}
        <path
          d={`M${data
            .map((d) => {
              console.log(`Point: (${d[xAxis]}, ${d[yAxis]})`);
              return `${xScale(d[xAxis])},${yScale(d[yAxis])}`;
            })
            .join(" L")}`}
          fill="none"
          stroke="blue"
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={xScale(d[xAxis])}
            cy={yScale(d[yAxis])}
            r="4"
            fill="blue"
          />
        ))}
      </g>
    </svg>
  );
}

export default Graph;
