var React = require("react");
var BetaChart = require("./betachart.js")

var BetaBox = React.createClass({
    render: function(){
        return(
            <div className="row">

                <div className="col-sm-12">
                  <div className="chart-wrapper">
                    <div className="chart-title">
                      Number of pull requests open and closed
                    </div>
                    <div className="chart-stage">
                        <BetaChart />
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

module.exports = BetaBox;
