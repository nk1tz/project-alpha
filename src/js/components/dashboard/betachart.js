var React = require("react");



var BetaChart = React.createClass({
  
  render: function() {
    return (
      <div >
        <div id="total-closed-pullrequests-number" >{this.props.closedTotal}</div> 
      </div>
    );
  }
  
});

module.exports = BetaChart;