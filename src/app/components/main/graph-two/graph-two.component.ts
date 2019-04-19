import { Component, OnInit, Input } from "@angular/core";
import { ChartType, ChartOptions } from "chart.js";
import { Label } from "ng2-charts";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { ParamMap, ActivatedRoute } from "@angular/router";
import { GraphService } from "src/app/services/graph.service";
@Component({
  selector: "app-graph-two",
  templateUrl: "./graph-two.component.html",
  styleUrls: ["./graph-two.component.css"]
})
export class GraphTwoComponent implements OnInit {
  @Input() diningName: string;

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: "top"
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        }
      }
    }
  };
  public pieChartLabels: Label[] = ["Excellent", "Satisfactory", "Poor"];
  public pieChartData: number[] = [0, 0, 0];
  public pieChartType: ChartType = "pie";
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: [
        "rgba(255,0,0,0.3)",
        "rgba(0,255,0,0.3)",
        "rgba(0,0,255,0.3)"
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private graphService: GraphService
  ) {}

  ngOnInit() {
    let numExcellent;
    let numSatisfactory;
    let numPoor;
    /*
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
            this.pieChartData = dataArray;
            //this.barChartData[0].data = dataArray;
          });
      }
    });
    */
    this.graphService.getAverageRatings(this.diningName).subscribe(response => {
      let dataArray = [];
      numExcellent = response.ratings.numExcellent;
      numSatisfactory = response.ratings.numSatisfactory;
      numPoor = response.ratings.numPoor;
      dataArray.push(numExcellent);
      dataArray.push(numSatisfactory);
      dataArray.push(numPoor);
      this.pieChartData = dataArray;
      //this.barChartData[0].data = dataArray;
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

  changeLabels() {
    const words = [
      "hen",
      "variable",
      "embryo",
      "instal",
      "pleasant",
      "physical",
      "bomber",
      "army",
      "add",
      "film",
      "conductor",
      "comfortable",
      "flourish",
      "establish",
      "circumstance",
      "chimney",
      "crack",
      "hall",
      "energy",
      "treat",
      "window",
      "shareholder",
      "division",
      "disk",
      "temptation",
      "chord",
      "left",
      "hospital",
      "beef",
      "patrol",
      "satisfied",
      "academy",
      "acceptance",
      "ivory",
      "aquarium",
      "building",
      "store",
      "replace",
      "language",
      "redeem",
      "honest",
      "intention",
      "silk",
      "opera",
      "sleep",
      "innocent",
      "ignore",
      "suite",
      "applaud",
      "funny"
    ];
    const randomWord = () => words[Math.trunc(Math.random() * words.length)];
    this.pieChartLabels = Array.apply(null, { length: 3 }).map(_ =>
      randomWord()
    );
  }

  addSlice() {
    this.pieChartLabels.push(["Line 1", "Line 2", "Line 3"]);
    this.pieChartData.push(400);
    this.pieChartColors[0].backgroundColor.push("rgba(196,79,244,0.3)");
  }

  removeSlice() {
    this.pieChartLabels.pop();
    this.pieChartData.pop();
    this.pieChartColors[0].backgroundColor.pop();
  }

  changeLegendPosition() {
    this.pieChartOptions.legend.position =
      this.pieChartOptions.legend.position === "left" ? "top" : "left";
  }
}
