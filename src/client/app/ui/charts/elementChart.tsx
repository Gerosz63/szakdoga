"use client";

import { ChartData } from "@/app/lib/definitions";
import { LineChart } from "@mui/x-charts";
import { cheerfulFiestaPalette } from '@mui/x-charts/colorPalettes';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

export default function ElementChart({ data }: { data: ChartData }) {
     const max = Math.max(...data.chartdata.map((e) => e.data).flat());
     const setting = {
          sx: {
               [`& .${axisClasses.left} .${axisClasses.label}`]: {
                    transform: `translateX(-${(max.toString().length - 1) * 5}px)`,
               },
          },
     };
     return (
          <LineChart
               {...setting}
               margin={{
                    left:100
               }}
               series={data.chartdata.map((e) => {
                    return {
                         data: e.data, label: e.name, curve: "stepBefore", highlightScope: { highlighted: 'series', faded: "global" }
                    }
               })}
               colors={cheerfulFiestaPalette}
               xAxis={[
                    { data: data.xLabels, scaleType: "point", label: "Idő intervallum" }
               ]}
               yAxis={[{ label: "Termelt energia", min: 0, max: max * 1.1, position: "left", classes: { left: "0" } }]}
          />
     );
}
