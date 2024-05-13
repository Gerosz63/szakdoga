"use client";
import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';
import { ChartData } from "@/app/lib/definitions";
import { axisClasses, LineChart, LineSeriesType } from "@mui/x-charts";
import { cheerfulFiestaPalette } from '@mui/x-charts/colorPalettes';
import { useSession } from 'next-auth/react';
/**
 * Function to create settings for charts y axis label transformation. With this setting we can prevent the label from overlapping the axis ticks.
 * @param length_left Character length of the maximum value of the y axis
 * @returns 
 */
export const chart_settins = (length_left: number, length_right?: number) => {
     if (isNaN(length_left))
          return {};
     length_left = length_left.toString().length;
     if (length_right) {
          length_right = length_right.toString().length;
          return {
               sx: {
                    [`.${axisClasses.left} .${axisClasses.label}`]: {
                         transform: `translateX(-${(length_left - 1) * 8}px)`,
                    },
                    [`.${axisClasses.right} .${axisClasses.label}`]: {
                         transform: `translateX(${(length_right - 1) * 8}px)`,
                    },
               },
               margin: {
                    left: 40 + (length_left - 1) * 8,
                    right: 40 + (length_right - 1) * 8,
               },
               className: "text-dark"
          };
     }
     else
          return {
               sx: {
                    [`.${axisClasses.left} .${axisClasses.label}`]: {
                         transform: `translateX(-${(length_left - 1) * 8}px)`,
                    },
               },
               margin: {
                    left: 40 + (length_left - 1) * 8
               },
               className: "text-dark"
          };
};

export function ElementChart({ data }: { data: ChartData }) {
     const user = useSession().data?.user
     const theme = useTheme();
     const newTheme = createTheme({ palette: { mode: user?.theme } });
     const max = Math.max(...data.chartdata.map((e) => e.data).flat());

     return (
          <ThemeProvider theme={newTheme}>
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
                    yAxis={[{ label: "Termelt energia", min: 0, max: max * 1.1, position: "left" }]}
               />
          </ThemeProvider>
     );
}

export function DemandChart({ data }: { data: ChartData }) {
     const user = useSession().data?.user
     const theme = useTheme();
     const newTheme = createTheme({ palette: { mode: user?.theme } });
     const max = Math.max(...data.chartdata.map((e) => e.data).flat());

     return (
          <ThemeProvider theme={newTheme}>
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
                    yAxis={[{ label: "Fogyasztás mértéke", min: 0, max: max * 1.1, position: "left" }]}
               />
          </ThemeProvider>
     );
}

export function MainChart({ data }: { data: ChartData }) {
     const user = useSession().data?.user
     const theme = useTheme();
     const newTheme = createTheme({ palette: { mode: user?.theme } });
     const max = Math.max(...data.chartdata.at(-1)!.data);


     const series = data.chartdata.map((e) => {
          return { data: e.data, type: "line", label: e.name, curve: "stepBefore", highlightScope: { highlighted: 'series', faded: "global" } }
     }) as Omit<LineSeriesType, "type">[];
     return (
          <ThemeProvider theme={newTheme}>
               <LineChart
                    {...chart_settins(max)}
                    series={[
                         ...series,
                         { data: data.demand!, label: "Fogyasztás", color: "red", curve: "stepBefore", highlightScope: { highlighted: 'series', faded: "global" } },
                    ]}
                    colors={cheerfulFiestaPalette}
                    xAxis={[
                         { data: data.xLabels, scaleType: "point", label: "Idő intervallum" }
                    ]}
                    yAxis={[{ label: "Termelt energia", min: 0, max: max * 1.1, position: "left" }]} />
          </ThemeProvider>
     );
}

export function StorageChart({ data }: { data: ChartData }) {
     const user = useSession().data?.user
     const theme = useTheme();
     const newTheme = createTheme({ palette: { mode: user?.theme } });
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
          <ThemeProvider theme={newTheme}>
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
          </ThemeProvider>
     );
}