var React = require("react");
var Link = require("react-router").Link;

var CartSummary = React.createClass({
    render: function(){
        return (
            <div>
                <Link to="/dashboard" className="btn btn-success">
                    Go to Dashboard
                </Link>
            </div>
        );
    }
});

module.exports = CartSummary;