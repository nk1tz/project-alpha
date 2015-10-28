var React = require("react");
var BetaChart = require("./betachart.js");
var PureRenderMixin = require('react-addons-pure-render-mixin');

var BetaBox = React.createClass({
    mixins: [PureRenderMixin],
    render: function(){
      console.log('hello from betabox: ' + this.props.min);
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
