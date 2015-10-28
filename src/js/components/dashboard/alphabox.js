var React = require("react");
var AlphaChart = require("./alphachart.js");
var Selectors = require("./data-selectors");
var dmtldata = require("../../../dmtldata/dmtldata.json");
var PureRenderMixin = require('react-addons-pure-render-mixin');

var AlphaBox = React.createClass({
  
  mixins: [PureRenderMixin],
  
  getInitialState: function(){
    return {dataSet: dmtldata.dmtldata.Cohort1.students.Everyone.PRdata};
  },
  
  _selectorsChanged: function(dataSelects){
    console.log(dataSelects);
    console.log(dmtldata.dmtldata[dataSelects.team].students[dataSelects.person].PRdata);
    this.setState({dataSet: dmtldata.dmtldata[dataSelects.team].students[dataSelects.person].PRdata});
  },
  
  _alphaChanged: function(newRange) {
    this.props.onChange(newRange);
  },
  
    render: function(){
      // console.log(dmtldata.dmtldata.Cohort1.students."Aviva Wolpert".PRdata);
        return(
            <div className="row">
            
                <div className="col-sm-12">
                  <div className="chart-wrapper">
                    <div className="chart-title">
                      Number of pull requests open and closed
                      <small className="pull-right">
                        <Selectors onChange={this._selectorsChanged} />
                      </small>
                    </div>
                    <div className="chart-stage">
                        <AlphaChart ref="chart" dataSet={this.state.dataSet} onChange={this._alphaChanged} />
                    </div>
                    <div className="chart-notes">
                      Select a specific range to get insights in the below sections.
                    </div>
                  </div>
                </div>
                
            </div>
        );
    }  
 
});

module.exports = AlphaBox;
