import React from "react";

interface GraphProps {
  data: { hour: number; temperature: number }[];
}

export function Graph({ data }: GraphProps) {
  console.log("Graph data:", data); // Log the entire data array

  const svgWidth = 800;
  const svgHeight = 400;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const xScale = (hour: number) => (hour / 24) * width;
  const yScale = (temp: number) =>
    height - ((temp - minTemp) / (maxTemp - minTemp)) * height;

  const minTemp = Math.min(...data.map((d) => d.temperature));
  const maxTemp = Math.max(...data.map((d) => d.temperature));

  console.log("Min temperature:", minTemp); // Log min temperature
  console.log("Max temperature:", maxTemp); // Log max temperature

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* X-axis */}
        <line x1={0} y1={height} x2={width} y2={height} stroke="black" />
        {[0, 6, 12, 18, 24].map((hour) => (
          <text key={hour} x={xScale(hour)} y={height + 20} textAnchor="middle">
            {hour}:00
          </text>
        ))}

        {/* Y-axis */}
        <line x1={0} y1={0} x2={0} y2={height} stroke="black" />
        {[minTemp, (minTemp + maxTemp) / 2, maxTemp].map((temp, i) => (
          <text
            key={i}
            x={-10}
            y={yScale(temp)}
            textAnchor="end"
            dominantBaseline="middle"
          >
            {temp.toFixed(1)}°C
          </text>
        ))}

        {/* Temperature line */}
        <path
          d={`M${data
            .map((d) => {
              console.log(`Point: (${d.hour}, ${d.temperature})`); // Log each point
              return `${xScale(d.hour)},${yScale(d.temperature)}`;
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
            cx={xScale(d.hour)}
            cy={yScale(d.temperature)}
            r="4"
            fill="blue"
          />
        ))}
      </g>
    </svg>
  );
}

export default Graph;
