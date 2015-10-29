var React = require("react");
var BetaChart = require("./betachart.js");
var PureRenderMixin = require('react-addons-pure-render-mixin');
var dmtldata = require("../../../dmtldata/dmtldata.json");
var closedTotal = 0;
var minTime = 0;
var maxTime = 0;
var minTot = 0;
var maxTot = 0;
var dataTemp = [];


var BetaBox = React.createClass({
    mixins: [PureRenderMixin],
    getInitialState: function(){
      return {
        range: {
                min: 1441584000000,
                max: 1446422400000
            }, 
        dataSelects: {
            team:"Cohort1",
            person: "Everyone"
        }
      };
    },
    render: function(){
      
      console.log(this.props.range);
      dataTemp = dmtldata.dmtldata[this.props.dataSelects.team].students[this.props.dataSelects.person].ClosedData;
      minTime = this.props.range.min;
      maxTime = this.props.range.max;
      minTot = dataTemp.find(function(ele, ind, arr){
          if(ele[0]===minTime){
            return ele;
          }
        });
        console.log(minTot);
      maxTot = dataTemp.find(function(ele, ind, arr){
          if(ele[0]===maxTime){
            return ele;
          }
        });
        console.log(maxTot);
      closedTotal = maxTot[1] - minTot[1];
      
        return(
            <div className="row">

                <div className="col-sm-12">
                  <div id="betabox" className="chart-wrapper">
                    <div className="chart-title">
                      Total number of closed PRs during selected period
                    </div>
                    <div className="chart-stage">
                        <BetaChart closedTotal={closedTotal} />
                    </div>
                    <div className="chart-notes">
                      
                    </div>
                  </div>
                </div>
                
            </div>
        );
    }  
 
});

module.exports = BetaBox;
