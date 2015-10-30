var React = require("react");
var ReactRouter = require('react-router');
var Header = require("./header/app-header.js")
var Dashboard = require("./dashboard/main-dashboard.js")

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;

var App = React.createClass({
    render: function(){
        return (
            <div >
                <Header />
                <Dashboard />
            </div>
        );
    }
});


module.exports = App;