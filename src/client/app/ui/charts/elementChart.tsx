"use client";

import { chart_settins, ChartData } from "@/app/lib/definitions";
import { LineChart } from "@mui/x-charts";
import { cheerfulFiestaPalette } from '@mui/x-charts/colorPalettes';

export default function ElementChart({ data }: { data: ChartData }) {
     const max = Math.max(...data.chartdata.map((e) => e.data).flat());
     
     return (
          <LineChart
               {...chart_settins(max)}
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
