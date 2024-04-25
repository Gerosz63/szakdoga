"use client";

import { chart_settins, ChartData } from "@/app/lib/definitions";
import { LineChart, LineSeriesType } from "@mui/x-charts";
import { cheerfulFiestaPalette } from '@mui/x-charts/colorPalettes';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

export default function StorageChart({ data }: { data: ChartData }) {
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

     const max = Math.max(...data.chartdata.map((e) => e.data).flat());
     const maxs = Math.max(...data.store!.map((e) => e.data).flat());

     return (
          <LineChart
               {...chart_settins(max, maxs)}
               series={[...series_normal, ...series_store]}
               xAxis={[
                    { data: data.xLabels, scaleType: "point", label: "Idő intervallum" }
               ]}
               colors={cheerfulFiestaPalette}
               yAxis={[
                    { id: "normal", label: "Termelt energia", min: 0, max: max * 1.1, position: "left" },
                    { id: "store", label: "Töltöttségi szint", min: 0, max: maxs * 1.1, position: "right" }
               ]}
               leftAxis="normal"
               rightAxis="store"
          />
     );
}