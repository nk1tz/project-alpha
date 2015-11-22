var React = require("react");
var Catalog = require("./catalog/app-catalog");
var Cart = require("./cart/app-cart.js");
var Template = require("./app-template.js");
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;

var App = React.createClass({
    render: function(){
        return (
            <Router>
                <Route path="/" component={Template}>
                    <IndexRoute component={Catalog}/>
                </Route>
                <Route path="/dashboard" component={Cart} />
            </Router>
        );
    }
});

module.exports = App;