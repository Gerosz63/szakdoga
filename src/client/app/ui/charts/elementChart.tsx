"use client";

import { ChartData } from "@/app/lib/definitions";
import { LineChart } from "@mui/x-charts";
import { cheerfulFiestaPalette } from '@mui/x-charts/colorPalettes';

export default function ElementChart({ data }: { data: ChartData }) {

     return (
          <LineChart
               series={data.chartdata.map((e) => {
                    return {
                         data: e.data, label: e.name, curve: "stepBefore", highlightScope: { highlighted: 'series', faded: "global" }
                    }
               })}
               colors={cheerfulFiestaPalette}
               xAxis={[
                    { data: data.xLabels, scaleType: "point", label: "Idő intervallum" }
               ]}
               yAxis={[{ label: "Termelt energia", min:0, max: Math.max(...data.chartdata.map((e) => e.data).flat()) * 1.1, position: "left" }]}
          />
     );
}
