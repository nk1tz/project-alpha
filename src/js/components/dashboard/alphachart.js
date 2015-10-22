var React = require("react");

var AlphaChart = React.createClass({
    render: function(){
        return(
            <div className="row">

                <div className="col-sm-12">
                  <div className="chart-wrapper">
                    <div className="chart-title">
                      Number of pull requests open and closed
                      <small className="pull-right">
                        <label className="pull-left">
                          Team:
                          <select id="first-choice">
                            <option selected value="base">Please Select</option>
                            <option value="allcohorts">All cohorts</option>
                            <option value="cohort1">Cohort-1</option>
                            <option value="cohort2">Cohort-2</option>
                            <option value="cohort3">Cohort-3</option>
                          </select>
                        </label>
                        <label>
                          Student:
                          <select id="second-choice">
                            <option>Please choose a team</option>
                          </select>
                        </label>
                      </small>
                      
                      
                    </div>
                    <div className="chart-stage">
                      <img data-src="../holder.js/100%x250/white"/>
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

module.exports = AlphaChart;

