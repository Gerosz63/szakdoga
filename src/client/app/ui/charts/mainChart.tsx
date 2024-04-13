"use client";
import { ChartData } from '@/app/lib/definitions';
import { LineChart, LineSeriesType } from "@mui/x-charts";

export default function MainChart({ data }: { data: ChartData }) {

     const series = data.chartdata.map((e) => { 
          return { data: e.data, type: "line", label: e.name, area: true, showMark: false, curve: "stepBefore", highlightScope: {highlighted:'series', faded:"global"}}
     }) as Omit<LineSeriesType, "type">[];
     return (
          <LineChart 
          series={[
               ...series,
               { data: data.demand!, label: "Fogyasztás", curve: "stepBefore", highlightScope: {highlighted: 'series', faded:"global"}},
          ]}
          xAxis={[
               {data: data.xLabels, scaleType: "point", label: "Idő intervallum"}
          ]}
          yAxis={[{ label: "Termelt energia", min:0, max: Math.max(...data.chartdata.at(-1)!.data) * 1.1, position:"left"}]}/>
     );
}
