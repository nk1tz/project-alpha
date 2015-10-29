var React = require("react");
var GammaChart = require("./gammachart.js");
var PureRenderMixin = require('react-addons-pure-render-mixin');
var dmtldata = require("../../../dmtldata/dmtldata.json");



var GammaBox = React.createClass({
  
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
    
    // commentsData: 
    
    render: function(){

      var dataTemp = dmtldata.dmtldata[this.props.dataSelects.team].students[this.props.dataSelects.person].CommentsData;
      console.log(this.props.dataSelects);
      var minTime = this.props.range.min;
      var maxTime = this.props.range.max;
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
      
      var relevantData = dataTemp.slice(startInd, endInd + 1);
      console.log(relevantData);
      
      
        return(
            <div className="row">

                <div className="col-sm-12">
                  <div className="chart-wrapper">
                    <div className="chart-title">
                      Comments over time
                    </div>
                    <div className="chart-stage">
                      <GammaChart relevantData={relevantData} />
                    </div>
                    <div className="chart-notes">
                    </div>
                  </div>
                </div>
                
            </div>
        );
    }  
 
});

module.exports = GammaBox;