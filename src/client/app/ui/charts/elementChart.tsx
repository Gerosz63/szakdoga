"use client";

import { ChartData } from "@/app/lib/definitions";
import { LineChart } from "@mui/x-charts";

export default function ElementChart({ data }: { data: ChartData }) {

     return (
          <LineChart
               series={data.chartdata.map((e) => {
                    return {
                         data: e.data, label: e.name, curve: "stepBefore", highlightScope: { highlighted: 'series', faded: "global" }
                    }
               })}
               xAxis={[
                    { data: data.xLabels, scaleType: "point", label: "Idő intervallum" }
               ]}
               yAxis={[{ label: "Termelt energia", min:0, max: Math.max(...data.chartdata.map((e) => e.data).flat()) * 1.1, position: "left" }]}
          />
     );
}
