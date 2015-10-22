var React = require("react");
var LineChart = require("react-chartjs").Line;
var Chart = require("chartjs");

Chart.defaults.global.responsive = true;


function rand(min, max, num) {
          var rtn = [];
          while (rtn.length < num) {
            rtn.push((Math.random() * (max - min)) + min);
          }
          return rtn;
        }

function data1() {
  return {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: rand(32, 100, 7)
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: rand(32, 100, 7)
        }
    ]
  };
}

var MainChart = React.createClass({
  
  chartData: function(){
    data1();
  },
  
  render: function() {
    return <LineChart data={this.chartData} width="600" height="250"/>
  }
});

var AlphaChart = React.createClass({
    render: function(){
        return(
            <div className="row">

                <div className="col-sm-12">
                  <div className="chart-wrapper">
                    <div className="chart-title">
                      Number of pull requests open and closed
                      <small className="pull-right">
                        <label className="pull-left">
                          Team:
                          <select id="first-choice">
                            <option selected value="base">Please Select</option>
                            <option value="allcohorts">All cohorts</option>
                            <option value="cohort1">Cohort-1</option>
                            <option value="cohort2">Cohort-2</option>
                            <option value="cohort3">Cohort-3</option>
                          </select>
                        </label>
                        <label>
                          Student:
                          <select id="second-choice">
                            <option>Please choose a team</option>
                          </select>
                        </label>
                      </small>
                    </div>
                    <div className="chart-stage">
                        <MainChart />
                    </div>
                    <div className="chart-notes">
                      Select a specific day to get insights
                    </div>
                  </div>
                </div>
                
            </div>
        );
    }  
 
});

module.exports = AlphaChart;



// <img data-src="../holder.js/100%x250/white"/>