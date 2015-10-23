var React = require("react");
var AlphaBox = require("./alphabox.js");
var BetaBox = require("./betabox.js");
var GammaBox = require("./gammabox.js");
var DeltaBox = require("./deltabox.js");


var Dashboard = React.createClass({
    render: function(){
        return(
            <div className="row">
                <div className="col-sm-12">
                    <AlphaBox />
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-3">
                        <BetaBox />
                    </div>
                    <div className="col-sm-12 col-md-9">
                        <GammaBox />
                    </div>
                    <div className="col-sm-12 col-md-12">
                        <DeltaBox />
                    </div>
                </div>
            </div>
        );
    }  
 
});

module.exports = Dashboard;