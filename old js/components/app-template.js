var React = require("react");
var Header = require("./header/app-header.js");
var Cart = require("./cart/app-cart.js");

var Template = React.createClass({
    render: function(){
        return (
            <div className="container">
                <Header />
                {this.props.children}
                <Cart />
            </div>
        );
    }
});

module.exports = Template;