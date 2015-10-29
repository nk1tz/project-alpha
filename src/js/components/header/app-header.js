var React = require("react");

var ReactBootstrap = require('react-bootstrap'),
    Nav = ReactBootstrap.Nav,
    NavItem = ReactBootstrap.NavItem,
    Navbar = ReactBootstrap.Navbar,
    MenuItem = ReactBootstrap.MenuItem,
    NavDropdown = ReactBootstrap.NavDropdown;


var Header = React.createClass({
     clickHandler: function (e) {
        e.preventDefault();
        console.log('team selected');
     },
    
    render: function(){
        return (
            <div>
                <div className="navbar navbar-inverse" role="navigation">
                    <div className="container-fluid">
                      <div className="navbar-header">
                        <a className="navbar-brand" href="index.html">DecodeMTL - Github dashboard</a>
                      </div>
                      <div className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-left">
                          <li><a href="https://github.com/DecodeMTL">Repositories</a></li>
                          <li><a href="https://github.com/orgs/DecodeMTL/people">Students</a></li>
                          <li><a href="https://github.com/orgs/DecodeMTL/teams">Teams</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
            </div>
        );
    }
});

module.exports = Header;