
export interface ChartSeriesDTO<T> {
  name: string;
  field: keyof T;
  stacked?: boolean;
}

export interface ChartConfigDTO<T> {
  data: T[];
  categoryField: keyof T;
  series: ChartSeriesDTO<T>[];
  height?: number;
  showLegend?: boolean;
  showLabels?: boolean;
}

export interface ChartDataDTO {
  [key: string]: string | number;
}
