"use client";
import { Charts } from '@/app/lib/definitions';
import {ResponsiveChartContainer} from "@mui/x-charts";

export default function MainChart({ data }: { data: ChartData }) {
     return (
          <ResponsiveChartContainer />
     );
}
