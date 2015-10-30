'use strict';
var React = require("react");
// var LineChart = require("react-chartjs").Line;
// var Chart = require("chart.js");
var Highstock = require('react-highcharts/dist/bundle/highstock');

var config = {
  rangeSelector: {
    selected: 1,
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
  title: {
    text: '',
    style: {
         color: '#E0E0E3',
         textTransform: 'uppercase',
         fontSize: '20px'
      }
  },
  series: [{
    name: 'OpenPRs'
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
   xAxis: {
      gridLineColor: 'rgba(32, 52, 69, 0.2)',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: 'rgba(32, 52, 69, 0.2)',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
         style: {
            color: '#A0A0A3'

         }
      }
   },
   yAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
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
            fill: '#3C76A8'
         }
      }
   },

   navigator: {
      handles: {
         backgroundColor: '#9077CC',
         borderColor: '#9077CC'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(34, 67, 128, 0.3)',
      series: {
         color: '#7798BF',
         lineColor: '#A6C7ED'
      },
      xAxis: {
         gridLineColor: '#505053'
      }
   },

   scrollbar: {
      enabled:false,
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


var AlphaChart = React.createClass({
  
  _chartRedraw: function() {
    this.props.onChange(this.getRange());
  },
  
  // var myDate = new Date("July 1, 1978 02:30:00"); // Your timezone!
  // var myEpoch = myDate.getTime()/1000.0;  
  
  
  getRange: function() {
    var range = this.refs.stock.chart.rangeSelector;
    return {
      min: (new Date(range.minInput.value)).getTime(),
      max: (new Date(range.maxInput.value)).getTime()
    };
  },
  
  render: function() {
     console.log(this.props.dataSet.length);
    config.chart = {
      events: {
                redraw: this._chartRedraw
            }
    };
    config.series[0].data = this.props.dataSet.splice(0,600);
    
    return <Highstock ref="stock" config={config} />;
  },
  componentDidMount: function() {
     $('input.highcharts-range-selector').datepicker();
  }
  
  // componentDidMount: function() {
  //   var range = this.refs.stock.chart;
  //   window.chart = range;
    // range.minInput.addEventListener('change', this._chartChanged);
    // range.maxInput.addEventListener('change', this._chartChanged);
  // }
  // componentDidUpdate: function() {
  //   var range = this.refs.stock.chart.rangeSelector;
  //   range.minInput.addEventListener('change', this._chartChanged);
  //   range.maxInput.addEventListener('change', this._chartChanged);
  // },
  // componentWillUnmount: function() {
  //   var range = this.refs.stock.chart.rangeSelector;
  //   // range.minInput.removeEventListener('change', this._chartChanged);
  //   // range.maxInput.removeEventListener('change', this._chartChanged);
  // }
  
});

module.exports = AlphaChart;
