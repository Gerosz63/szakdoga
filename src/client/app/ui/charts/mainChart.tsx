"use client";
import { chart_settins, ChartData } from '@/app/lib/definitions';
import { LineChart, LineSeriesType } from "@mui/x-charts";
import { cheerfulFiestaPalette } from '@mui/x-charts/colorPalettes';


export default function MainChart({ data }: { data: ChartData }) {
     const max = Math.max(...data.chartdata.at(-1)!.data);
     

     const series = data.chartdata.map((e) => { 
          return { data: e.data, type: "line", label: e.name, area: true, showMark: false, curve: "stepBefore", highlightScope: {highlighted:'series', faded:"global"}}
     }) as Omit<LineSeriesType, "type">[];
     return (
          <LineChart
          {...chart_settins(max)}
          series={[
               ...series,
               { data: data.demand!, label: "Fogyasztás", curve: "stepBefore", highlightScope: {highlighted: 'series', faded:"global"}},
          ]}
          colors={cheerfulFiestaPalette}
          xAxis={[
               {data: data.xLabels, scaleType: "point", label: "Idő intervallum"}
          ]}
          yAxis={[{ label: "Termelt energia", min:0, max: max * 1.1, position:"left"}]}/>
     );
}
