var React = require("react");
var AlphaChart = require("./alphachart.js");
var Selectors = require("./data-selectors");
var dmtldata = require("../../../dmtldata/dmtldata.json");

var AlphaBox = React.createClass({
  
  update: function(e){
    console.log(e);
  // this.setState( {chartData: dmtldata.dmtldata.cohort1.students.e.target.value.PRdata });
  },
  
    render: function(){
        return(
            <div className="row">

                <div className="col-sm-12">
                  <div className="chart-wrapper">
                    <div className="chart-title">
                      Number of pull requests open and closed
                      <small className="pull-right">
                        <Selectors update={this.update} />
                      </small>
                    </div>
                    <div className="chart-stage">
                        <AlphaChart data={this.state.chartData} />
                    </div>
                    <div className="chart-notes">
                      Select a specific day to get insights in th below sections.
                    </div>
                  </div>
                </div>
                
            </div>
        );
    }  
 
});

module.exports = AlphaBox;
