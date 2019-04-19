import { Component, OnInit, Input } from "@angular/core";
import { ChartOptions, ChartType, ChartDataSets } from "chart.js";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { Label } from "ng2-charts";
import { GraphService } from "src/app/services/graph.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
@Component({
  selector: "app-graph",
  templateUrl: "./graph.component.html",
  styleUrls: ["./graph.component.css"]
})
export class GraphComponent implements OnInit {
  //@Input() childDiningName: string;
  public diningName: string;
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end"
      }
    }
  };
  public barChartLabels: Label[] = ["Excellent", "Satisfactory", "Poor"];
  public barChartType: ChartType = "bar";
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [{ data: [] }];

  constructor(
    private graphService: GraphService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    let numExcellent;
    let numSatisfactory;
    let numPoor;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      //check if contain diningName in the param route
      if (paramMap.has("diningName")) {
        //get diningName from the param route
        this.diningName = paramMap.get("diningName");

        this.graphService
          .getAverageRatings(this.diningName)
          .subscribe(response => {
            let dataArray = [];
            numExcellent = response.ratings.numExcellent;
            numSatisfactory = response.ratings.numSatisfactory;
            numPoor = response.ratings.numPoor;
            dataArray.push(numExcellent);
            dataArray.push(numSatisfactory);
            dataArray.push(numPoor);
            console.log(dataArray);
            this.barChartData.push({
              data: dataArray
            });
          });
      }
    });
  }
  // events
  public chartClicked({
    event,
    active
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.random() * 100,
      56,
      Math.random() * 100,
      40
    ];
    this.barChartData[0].data = data;
  }
}
