var React = require("react");
var DeltaChart = require("./deltachart.js")
var PureRenderMixin = require('react-addons-pure-render-mixin');

var DeltaBox = React.createClass({
  mixins: [PureRenderMixin],
    render: function(){
        return(
            <div className="row">

                <div className="col-sm-12">
                  <div className="chart-wrapper">
                    <div className="chart-title">
                      Number of pull requests open and closed
                    </div>
                    <div className="chart-stage">
                        <DeltaChart />
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

module.exports = DeltaBox;
