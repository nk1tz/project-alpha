var React = require("react");
var teamData = require("../../../teamdata.json")

var allCohorts = teamData.allcohorts.split(",");
var cohort1 = teamData.cohort1.split(",");
var cohort2 = teamData.cohort2.split(",");
var cohort3 = teamData.cohort3.split(",");




var Selectors = React.createClass({
    
    getInitialState: function(){
        return {persons: allCohorts};
    },
    
    componentDidMount: function(){
        console.log(this.state);
    },
    
    update: function(e){
        console.log(e.target.value);
        switch (e.target.value) {
                  case 'allcohorts':
                    this.setState( {persons: allCohorts });
                    return;
                  case 'cohort1':
                    this.setState( {persons: cohort1 });
                    return;
                  case 'cohort2':
                    this.setState( {persons: cohort2 });
                    return;
                  case 'cohort3':
                    this.setState( {persons: cohort3 });
                    return;
                }
    },
    
    render: function(){
        return(
            <div>
                <TeamSelector update={this.update} />
                <PersonSelector choices={this.state.persons} />
                <StartDateSelector />
                <TimeRangeSelector />
            </div>
        );
    }
    
});

var TeamSelector = React.createClass({
    render: function(){
        return(
            <label className="pull-left">
              Team:
              <select id="first-choice" onChange={this.props.update}>
                <option value="allcohorts">All cohorts</option>
                <option value="cohort1">Cohort 1</option>
                <option value="cohort2">Cohort 2</option>
                <option value="cohort3">Cohort 3</option>
              </select>
            </label>
        );
    }  
});


var PersonSelector = React.createClass({
    
    getIntialState: function(){
        console.log(this.props.choices);
        return this.props;    
    },
    
    componentDidUpdate: function(){
        console.log(this.props.choices);    
    },
    
    render: function(){
        return(
            <label>
                Person:
                <select id="second-choice">
                <option value="all">Everyone</option>
                {
                    this.props.choices.map(function(val){
                        return <option value={val}>{val}</option>;
                    })
                    
                }
                <option value="allstudents">All students</option>
                <option value="allstaff">All staff</option>
              </select>
            </label>
        );
    }  
});

var StartDateSelector = React.createClass({
    render: function(){
        return(
            <label>
              Start Date:
              <select id="third-choice">
                <option value="base">Choose a start date</option>
                
              </select>
            </label>
        );
    }  
});

var TimeRangeSelector = React.createClass({
    render: function(){
        return(
            <label>
              Time Range:
              <select id="fourth-choice">
                <option value="base">Select</option>
                <option value="oneDay">1 Day</option>
                <option value="twoDay">2 Days</option>
                <option value="oneWeek">1 Week</option>
                <option value="twoWeek">2 Weeks</option>
                <option value="oneMonth">1 Month</option>
                <option value="twoMonth">2 Months</option>
                <option value="allTime">All Time</option>
              </select>
            </label>
        );
    }  
});


module.exports = Selectors;