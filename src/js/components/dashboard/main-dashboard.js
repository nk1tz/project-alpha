var React = require("react");
var AlphaChart = require("./alphachart.js");

var Dashboard = React.createClass({
    render: function(){
        return(
            <div className="row">
                <div className="col-sm-12">
                    <AlphaChart />
                </div>
            </div>
        );
    }  
 
});

module.exports = Dashboard;