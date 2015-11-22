'use strict'
var React = require("react");
var Highstock = require('react-highcharts/dist/bundle/highstock');

 
var data = [[1220832000000, 22.56], [1220918400000, 21.67], [1221004800000, 21.66], [1221091200000, 21.81], [1221177600000, 21.28], [1221436800000, 20.05], [1221523200000, 19.98], [1221609600000, 18.26], [1221696000000, 19.16], [1221782400000, 20.13], [1222041600000, 18.72], [1222128000000, 18.12], [1222214400000, 18.39], [1222300800000, 18.85], [1222387200000, 18.32], [1222646400000, 15.04], [1222732800000, 16.24], [1222819200000, 15.59], [1222905600000, 14.3], [1222992000000, 13.87], [1223251200000, 14.02], [1223337600000, 12.74], [1223424000000, 12.83], [1223510400000, 12.68], [1223596800000, 13.8], [1223856000000, 15.75], [1223942400000, 14.87], [1224028800000, 13.99], [1224115200000, 14.56], [1224201600000, 13.91], [1224460800000, 14.06], [1224547200000, 13.07], [1224633600000, 13.84], [1224720000000, 14.03], [1224806400000, 13.77], [1225065600000, 13.16], [1225152000000, 14.27], [1225238400000, 14.94], [1225324800000, 15.86], [1225411200000, 15.37], [1225670400000, 15.28], [1225756800000, 15.86], [1225843200000, 14.76], [1225929600000, 14.16], [1226016000000, 14.03], [1226275200000, 13.7], [1226361600000, 13.54], [1226448000000, 12.87], [1226534400000, 13.78], [1226620800000, 12.89], [1226880000000, 12.59], [1226966400000, 12.84], [1227052800000, 12.33], [1227139200000, 11.5], [1227225600000, 11.8], [1227484800000, 13.28], [1227571200000, 12.97], [1227657600000, 13.57], [1227830400000, 13.24], [1228089600000, 12.7], [1228176000000, 13.21], [1228262400000, 13.7], [1228348800000, 13.06], [1228435200000, 13.43], [1228694400000, 14.25], [1228780800000, 14.29], [1228867200000, 14.03], [1228953600000, 13.57], [1229040000000, 14.04], [1229299200000, 13.54]];

var config = {
  rangeSelector: {
     enabled: false,
      buttonTheme: {
         fill: '#505053',
         stroke: '#000000',
         style: {
            color: '#CCC'
         },
         states: {
            hover: {
               fill: '#707073',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            },
            select: {
               fill: '#000003',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            }
         }
      },
      inputBoxBorderColor: '#505053',
      inputStyle: {
         backgroundColor: '#333',
         color: 'silver'
      },
      labelStyle: {
         color: 'silver'
      }
   },
  series: [{
    type: 'column',
    name: 'Comments',
    data: data,
  }],
  colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
   chart: {
      backgroundColor: {
         linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
         stops: [
            [0, '#2a2a2b'],
            [1, '#3e3e40']
         ]
      },
      style: {
         fontFamily: "'Unica One', sans-serif"
      },
      plotBorderColor: '#606063'
   },
   title: {
     text: '',
      style: {
         color: '#E0E0E3',
         textTransform: 'uppercase',
         fontSize: '20px'
      }
   },
   subtitle: {
      style: {
         color: '#E0E0E3',
         textTransform: 'uppercase'
      }
   },
   xAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
         style: {
            color: '#A0A0A3'

         }
      }
   },
   yAxis: {
      gridLineColor: '#272739',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#272739',
      minorGridLineColor: '#272739',
      tickColor: '#707073',
      tickWidth: 1,
      title: {
         style: {
            color: '#A0A0A3'
         }
      }
   },
   tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
         color: '#F0F0F0'
      }
   },
   plotOptions: {
      series: {
         dataLabels: {
            color: '#B0B0B3'
         },
         marker: {
            lineColor: '#333'
         }
      },
      boxplot: {
         fillColor: '#505053'
      },
      candlestick: {
         lineColor: 'white'
      },
      errorbar: {
         color: 'white'
      }
   },
   legend: {
      itemStyle: {
         color: '#E0E0E3'
      },
      itemHoverStyle: {
         color: '#FFF'
      },
      itemHiddenStyle: {
         color: '#606063'
      }
   },
   credits: {
      style: {
         color: '#666'
      }
   },
   labels: {
      style: {
         color: '#707073'
      }
   },

   drilldown: {
      activeAxisLabelStyle: {
         color: '#F0F0F3'
      },
      activeDataLabelStyle: {
         color: '#F0F0F3'
      }
   },

   navigation: {
      buttonOptions: {
         symbolStroke: '#DDDDDD',
         theme: {
            fill: '#505053'
         }
      }
   },

   // scroll charts
   

   navigator: {
     enabled: false,
      handles: {
         backgroundColor: '#666',
         borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(255,255,255,0.1)',
      series: {
         color: '#7798BF',
         lineColor: '#A6C7ED'
      },
      xAxis: {
         gridLineColor: '#505053'
      }
   },

   scrollbar: {
      enabled: false,
      barBackgroundColor: '#808083',
      barBorderColor: '#808083',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: '#606063',
      buttonBorderColor: '#606063',
      rifleColor: '#FFF',
      trackBackgroundColor: '#404043',
      trackBorderColor: '#404043'
   },

   // special colors for some of the
   legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
   background2: '#505053',
   dataLabelsColor: '#B0B0B3',
   textColor: '#C0C0C0',
   contrastTextColor: '#F0F0F3',
   maskColor: 'rgba(255,255,255,0.3)'
};

var GammaChart = React.createClass({
  
  
  render: function() {
    
    config.series[0].data = this.props.relevantData;
    
    return <Highstock ref="stock" config={config} />;
  }
  
});

module.exports = GammaChart;




// var LineChart = require("react-chartjs").Line;
// var Chart = require("chart.js");



// function rand(min, max, num) {
//   var rtn = [];
//   while (rtn.length < num) {
//     rtn.push((Math.random() * (max - min)) + min);
//   }
//   return rtn;
// }


// getInitialState: function(){
//       return this.props;
//   },
  
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
  
//   getChartData: function(){
//     return {
//         labels: this.props.timeData,
//         datasets: [
//           {
//               label: "Comments over time",
//               fillColor: "rgba(220,220,220,0.2)",
//               strokeColor: "rgba(220,220,220,1)",
//               pointColor: "rgba(220,220,220,1)",
//               pointStrokeColor: "#fff",
//               pointHighlightFill: "#fff",
//               pointHighlightStroke: "rgba(220,220,220,1)",
//               data: this.props.commentData
//           },
//         ]
//     }
//   },
  
//   render: function() {
//     console.log(this.getChartData());
//     return <LineChart data={this.getChartData()} options={this.chartOptions} style={{"height" : "300px", "width" : "100%"}} />;
//   }