'use strict';
var React = require("react");
// var LineChart = require("react-chartjs").Line;
// var Chart = require("chart.js");
var Highstock = require('react-highcharts/dist/bundle/highstock');

var data = [[1220832000000, 22.56], [1220918400000, 21.67], [1221004800000, 21.66], [1221091200000, 21.81], [1221177600000, 21.28], [1221436800000, 20.05], [1221523200000, 19.98], [1221609600000, 18.26], [1221696000000, 19.16], [1221782400000, 20.13], [1222041600000, 18.72], [1222128000000, 18.12], [1222214400000, 18.39], [1222300800000, 18.85], [1222387200000, 18.32], [1222646400000, 15.04], [1222732800000, 16.24], [1222819200000, 15.59], [1222905600000, 14.3], [1222992000000, 13.87], [1223251200000, 14.02], [1223337600000, 12.74], [1223424000000, 12.83], [1223510400000, 12.68], [1223596800000, 13.8], [1223856000000, 15.75], [1223942400000, 14.87], [1224028800000, 13.99], [1224115200000, 14.56], [1224201600000, 13.91], [1224460800000, 14.06], [1224547200000, 13.07], [1224633600000, 13.84], [1224720000000, 14.03], [1224806400000, 13.77], [1225065600000, 13.16], [1225152000000, 14.27], [1225238400000, 14.94], [1225324800000, 15.86], [1225411200000, 15.37], [1225670400000, 15.28], [1225756800000, 15.86], [1225843200000, 14.76], [1225929600000, 14.16], [1226016000000, 14.03], [1226275200000, 13.7], [1226361600000, 13.54], [1226448000000, 12.87], [1226534400000, 13.78], [1226620800000, 12.89], [1226880000000, 12.59], [1226966400000, 12.84], [1227052800000, 12.33], [1227139200000, 11.5], [1227225600000, 11.8], [1227484800000, 13.28], [1227571200000, 12.97], [1227657600000, 13.57], [1227830400000, 13.24], [1228089600000, 12.7], [1228176000000, 13.21], [1228262400000, 13.7], [1228348800000, 13.06], [1228435200000, 13.43], [1228694400000, 14.25], [1228780800000, 14.29], [1228867200000, 14.03], [1228953600000, 13.57], [1229040000000, 14.04], [1229299200000, 13.54]];

var config = {
  rangeSelector: {
    selected: 1
  },
  title: {
    text: 'Open Pull Requests per Hour'
  },
  series: [{
    name: 'OpenPRs',
    data: data,
    tooltip: {
      valueDecimals: 2
    }
  }]
};

var AlphaChart = React.createClass({
  
  render: function() {
    return <Highstock config={config} />;
  }
  
});

module.exports = AlphaChart;



// function rand(min, max, num) {
//   var rtn = [];
//   while (rtn.length < num) {
//     rtn.push((Math.random() * (max - min)) + min);
//   }
//   return rtn;
// }

// var AlphaChart = React.createClass({
    
//   chartOptions: {
//     ///Boolean - Whether grid lines are shown across the chart
//     scaleShowGridLines : true,
//     //String - Colour of the grid lines
//     scaleGridLineColor : "rgba(0,0,0,.05)",
//     //Number - Width of the grid lines
//     scaleGridLineWidth : 1,
//     //Boolean - Whether to show horizontal lines (except X axis)
//     scaleShowHorizontalLines: true,
//     //Boolean - Whether to show vertical lines (except Y axis)
//     scaleShowVerticalLines: true,
//     //Boolean - Whether the line is curved between points
//     bezierCurve : true,
//     //Number - Tension of the bezier curve between points
//     bezierCurveTension : 0.4,
//     //Boolean - Whether to show a dot for each point
//     pointDot : true,
//     //Number - Radius of each point dot in pixels
//     pointDotRadius : 4,
//     //Number - Pixel width of point dot stroke
//     pointDotStrokeWidth : 1,
//     //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
//     pointHitDetectionRadius : 20,
//     //Boolean - Whether to show a stroke for datasets
//     datasetStroke : true,
//     //Number - Pixel width of dataset stroke
//     datasetStrokeWidth : 2,
//     //Boolean - Whether to fill the dataset with a colour
//     datasetFill : true,
//     //String - A legend template
//     legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

//   },
  
//   chartData: {
//         labels: ["January", "February", "March", "April", "May", "June", "July","August","September","October", "Novembre", "December"],
//         datasets: [
//           {
//               label: "Open Pull Requests",
//               fillColor: "rgba(220,220,220,0.2)",
//               strokeColor: "rgba(220,220,220,1)",
//               pointColor: "rgba(220,220,220,1)",
//               pointStrokeColor: "#fff",
//               pointHighlightFill: "#fff",
//               pointHighlightStroke: "rgba(220,220,220,1)",
//               data: rand(32, 100, 12)
//           },
//           {
//               label: "Closed Pull Requests",
//               fillColor: "rgba(151,187,205,0.2)",
//               strokeColor: "rgba(151,187,205,1)",
//               pointColor: "rgba(151,187,205,1)",
//               pointStrokeColor: "#fff",
//               pointHighlightFill: "#fff",
//               pointHighlightStroke: "rgba(151,187,205,1)",
//               data: rand(32, 100, 12)
//           }
//         ]
//   },
  
//   render: function() {
//     return <LineChart data={this.chartData} options={this.chartOptions} style={{"height" : "400px", "width" : "100%"}} />;
//   }
  
// });

// module.exports = AlphaChart;