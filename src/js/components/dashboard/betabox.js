var React = require("react");
var BetaChart = require("./betachart.js");
var PureRenderMixin = require('react-addons-pure-render-mixin');
var dmtldata = require("../../../dmtldata/dmtldata.json");



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
    
      var dataTemp = dmtldata.dmtldata[this.props.dataSelects.team].students[this.props.dataSelects.person].ClosedData;
      var minTime = this.props.range.min;
      var maxTime = this.props.range.max;
      
      var minTot = dataTemp.find(function(ele, ind, arr){
          if(ele[0]===minTime){
            return ele;
          }
        });
      var maxTot = dataTemp.find(function(ele, ind, arr){
          if(ele[0]===maxTime){
            return ele;
          }
        });
        
      var closedTotal = maxTot[1] - minTot[1];
        
      var startInd = dataTemp.findIndex(function(ele, ind, arr){
          if(ele[0]===minTime){
            return ele;
          }
        });
      var endInd = dataTemp.findIndex(function(ele, ind, arr){
          if(ele[0]===maxTime){
            return ele;
          }
        });
      
      var relevantDataBrute = dataTemp.slice(startInd + 1, endInd + 1);

      var relevantData = relevantDataBrute.map(function(ele,ind){
        return ele[1]-relevantDataBrute[0][1];
      }); 
      
        return(
            <div className="row">

                <div className="col-sm-12">
                  <div id="betabox" className="chart-wrapper">
                    <div className="chart-title">
                      Closed Pull Requests
                    </div>
                    <div id="chart-stage">
                      <BetaChart relevantData={relevantData} closedTotal={closedTotal} />
                        <div id="bigNumber">
                          {closedTotal}
                        </div>
                        
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
