import * as React from "react";
import Chart from "react-apexcharts";
import { cn } from "@/lib/utils";
// cSpell:ignore apexcharts
import type { ApexOptions } from "apexcharts";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ReactNode;
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn("flex justify-center text-xs", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        {children}
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
              ${prefix} [data-chart=${id}] {
              ${colorConfig
                .map(([key, itemConfig]) => {
                  const color =
                    itemConfig.theme?.[
                      theme as keyof typeof itemConfig.theme
                    ] || itemConfig.color;
                  return color ? `  --color-${key}: ${color};` : null;
                })
                .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

// ApexCharts wrapper component
interface ApexChartProps {
  type:
    | "line"
    | "area"
    | "bar"
    | "pie"
    | "donut"
    | "radialBar"
    | "scatter"
    | "bubble"
    | "heatmap";
  data: ApexOptions["series"];
  options?: ApexOptions;
  height?: number | string;
  width?: number | string;
  className?: string;
}

function ApexChart({
  type,
  data,
  options = {},
  height = 350,
  width = "100%",
  className,
}: ApexChartProps) {
  const { config } = useChart();

  // Get colors from config
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const colors = Object.entries(config).map(([_, value]) => {
    if (value.color) {
      return value.color.startsWith("var(")
        ? `hsl(${value.color.replace("var(--", "").replace(")", "")})`
        : value.color;
    }
    return value.theme?.light || "#000";
  });

  const defaultOptions: ApexOptions = {
    chart: {
      type,
      toolbar: {
        show: false,
      },
      background: "transparent",
      redrawOnParentResize: true,
    },
    markers: {
      colors: "var(--primary)",
      strokeColors: "var(--primary)",
      strokeWidth: 10,
      strokeOpacity: 0.2,
    },
    colors,
    theme: {
      mode: "light" as const,
    },
    grid: {
      borderColor: "hsl(var(--border))",
      strokeDashArray: 0,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "hsl(var(--muted-foreground))",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "hsl(var(--muted-foreground))",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      theme: "light" as const,
      style: {
        fontSize: "12px",
      },
    },
    legend: {
      labels: {
        colors: "hsl(var(--foreground))",
      },
    },
    ...options,
  };

  return (
    <div className={cn("w-full", className)}>
      <Chart
        options={defaultOptions}
        series={data}
        type={type}
        height={height}
        width={width}
      />
    </div>
  );
}

// Export components
export { ChartContainer, ApexChart, ChartStyle };

// Export hook separately to avoid fast refresh issues
// eslint-disable-next-line react-refresh/only-export-components
export { useChart };
