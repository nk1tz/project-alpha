var React = require("react");
var GammaChart = require("./gammachart.js")

var GammaBox = React.createClass({
    render: function(){
        return(
            <div className="row">

                <div className="col-sm-12">
                  <div className="chart-wrapper">
                    <div className="chart-title">
                      Number of pull requests open and closed
                    </div>
                    <div className="chart-stage">
                        <GammaChart />
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

module.exports = GammaBox;
