var React = require("react");
var CartSummary = require("./app-cartsummary.js");

var Header = React.createClass({
    render: function(){
        return (
           <div className="row">
                <div className="col-sm-6"><h1>DecodeMTL Dashboard</h1></div>
                <br />
                <div className="col-sm-6">
                    <CartSummary />
                    <CartSummary />
                </div>
            </div>
        );
    }
});

module.exports = Header;