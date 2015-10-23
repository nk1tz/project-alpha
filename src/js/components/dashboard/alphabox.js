var React = require("react");
var AlphaChart = require("./alphachart.js");
var Selectors = require("./data-selectors");
var TeamSelector = Selectors.Team;
var PersonSelector = Selectors.Person;
var StartDateSelector = Selectors.StartDate;
var TimeRangeSelector = Selectors.TimeRange;

var AlphaBox = React.createClass({
    render: function(){
        return(
            <div className="row">

                <div className="col-sm-12">
                  <div className="chart-wrapper">
                    <div className="chart-title">
                      Number of pull requests open and closed
                      <small className="pull-right">
                        <TeamSelector />
                        <PersonSelector />
                        <StartDateSelector />
                        <TimeRangeSelector />
                      </small>
                    </div>
                    <div className="chart-stage">
                        <AlphaChart />
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
