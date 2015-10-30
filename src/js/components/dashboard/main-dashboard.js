var React = require("react");
var AlphaBox = require("./alphabox.js");
var BetaBox = require("./betabox.js");
var GammaBox = require("./gammabox.js");
var DeltaBox = require("./deltabox.js");
var _ = require('underscore');


var Dashboard = React.createClass({
    
    getInitialState: function() {
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
     _alphaBoxChanged: _.debounce(function(newRange) {
         this.setState( {range: newRange} );
     }, 400),
     
    _updateSelects: function(dataSelects){
        this.setState( {dataSelects: dataSelects});
    },
    
    render: function(){
        return(
            <div>
                <div className="row">
                    <div className="col-sm-12">
                        <AlphaBox onChange={this._alphaBoxChanged} updateSelects={this._updateSelects} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-4">
                        <BetaBox range={this.state.range} dataSelects={this.state.dataSelects} />
                    </div>
                    <div className="col-sm-12 col-md-8">
                        <GammaBox range={this.state.range} dataSelects={this.state.dataSelects} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <DeltaBox range={this.state.range} />
                    </div>
                </div>
            </div>
        );
    }  
 
});

module.exports = Dashboard;