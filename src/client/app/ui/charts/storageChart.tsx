"use client";

import { ChartData } from "@/app/lib/definitions";
import { LineChart, LineSeriesType } from "@mui/x-charts";


export default function StorageChart({data} : {data: ChartData}) {
     const series_normal = data.chartdata.map((e) => {
          return {
               yAxisKey: "normal", data: e.data, label: e.name, curve: "stepBefore", highlightScope: { highlighted: 'series', faded: "global" }
          }
     }) as Omit<LineSeriesType, "type">[];

     const series_store = data.store!.map((e) => {
          return {
               yAxisKey: "store", data: e.data, label: e.name, curve: "stepBefore", highlightScope: { highlighted: 'series', faded: "global" }
          }
     }) as Omit<LineSeriesType, "type">[];

     return (
          <LineChart
          series={[...series_normal, ...series_store]}
          xAxis={[
               { data: data.xLabels, scaleType: "point", label: "Idő intervallum" }
          ]}
          yAxis={[
               {id:"normal", label: "Termelt energia", min:0, max: Math.max(...data.chartdata.map((e) => e.data).flat()) * 1.1, position: "left" },
               {id:"store", label: "Töltöttségi szint", min:0, max: Math.max(...data.store!.map((e) => e.data).flat()) * 1.1, position: "right" }
          ]}
          leftAxis="normal"
          rightAxis="store"
          />
     );
}