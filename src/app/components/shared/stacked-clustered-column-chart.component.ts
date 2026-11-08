
import {
  afterNextRender,
  Component,
  ElementRef,
  input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  viewChild,
} from '@angular/core';

import type { Root } from '@amcharts/amcharts5';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';

import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Responsive from '@amcharts/amcharts5/themes/Responsive';
import am5themes_Adaptive from '@amcharts/amcharts5/themes/Adaptive';
import { ChartConfigDTO } from './chart.dto';


@Component({
  selector: 'app-stacked-clustered-column-chart',
  standalone: true,
  template: `
    <div
      #chartContainer
      [style.height.px]="config().height ?? 500"
      style="width: 100%"
    ></div>
  `,
})
export class StackedClusteredColumnChartComponent<T extends object>
  implements OnChanges, OnDestroy {

  readonly config = input.required<ChartConfigDTO<T>>();

  private readonly chartContainer =
    viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');

  private root?: Root;
  private chart?: am5xy.XYChart;
  private xAxis?: am5xy.CategoryAxis<am5xy.AxisRendererX>;
  private yAxis?: am5xy.ValueAxis<am5xy.AxisRendererY>;

  private initialized = false;

  constructor() {
    afterNextRender(() => {
      this.createChart();
      this.initialized = true;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.initialized) {
      this.updateChart();
    }
  }

  private createChart(): void {
    const element = this.chartContainer().nativeElement;

    this.root = am5.Root.new(element);

    this.root.setThemes([
      am5themes_Animated.new(this.root),
      am5themes_Adaptive.new(this.root, {
        baseColor: 0x4150a0,
        baseColor2: 0xf0825a,
        count: 6,
        mapShade: true,
        keepContrast: true,
      }),
      am5themes_Responsive.new(this.root),
    ]);

    this.chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panX: false,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
        paddingLeft: 0,
        layout: this.root.verticalLayout,
      }),
    );

    this.createAxes();
    this.updateChart();

    this.chart.appear(1000, 100);
  }

  private createAxes(): void {
    const root = this.root!;
    const chart = this.chart!;

    const config = this.config();

    const xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
    });

    this.xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: String(config.categoryField),
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      }),
    );

    xRenderer.grid.template.setAll({
      location: 1,
    });

    this.yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1,
        }),
      }),
    );
  }

  private updateChart(): void {
    if (!this.root || !this.chart || !this.xAxis || !this.yAxis) {
      return;
    }

    const config = this.config();

    this.xAxis.data.setAll(config.data as any[]);

    this.chart.series.clear();

    const legend = this.chart.children.push(
      am5.Legend.new(this.root, {
        centerX: am5.p50,
        x: am5.p50,
      }),
    );

    legend.valueLabels.template.set('forceHidden', true);

    for (const item of config.series) {
      this.createSeries(item, legend);
    }
  }

  private createSeries(
    item: ChartConfigDTO<T>['series'][number],
    legend: am5.Legend,
  ): void {
    const root = this.root!;
    const chart = this.chart!;

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: item.name,
        stacked: item.stacked ?? false,
        xAxis: this.xAxis!,
        yAxis: this.yAxis!,
        valueYField: String(item.field),
        categoryXField: String(this.config().categoryField),
      }),
    );

    series.columns.template.setAll({
      tooltipText: '{name}, {categoryX}: {valueY}',
      width: am5.percent(90),
      tooltipY: am5.percent(10),
      shadowColor: am5.color(0x000000),
      shadowOpacity: 0.3,
      shadowBlur: 6,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
    });

    series.data.setAll(this.config().data as any[]);

    if (this.config().showLabels ?? true) {
      series.bullets.push(() =>
        am5.Bullet.new(root, {
          locationY: 0.5,
          sprite: am5.Label.new(root, {
            text: '{valueY}',
            fill: root.interfaceColors.get('alternativeText'),
            centerY: am5.percent(50),
            centerX: am5.percent(50),
            populateText: true,
          }),
        }),
      );
    }

    series.appear();

    legend.data.push(series);
  }

  ngOnDestroy(): void {
    this.root?.dispose();
    this.root = undefined;
  }
}
