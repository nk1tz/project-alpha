var React = require("react");
var teamData = require("../../../teamdata.json")

var allCohorts = teamData.allcohorts.split(",");
var cohort1 = teamData.cohort1.split(",");
var cohort2 = teamData.cohort2.split(",");
var cohort3 = teamData.cohort3.split(",");




var Selectors = React.createClass({
    
    getInitialState: function(){
        return {teamSelected: allCohorts};
    },
    
    updateTeam: function(e){
        switch (e.target.value) {
                  case 'allcohorts':
                    this.setState( {teamSelected: allCohorts });
                    return;
                  case 'cohort1':
                    this.setState( {teamSelected: cohort1 });
                    return;
                  case 'cohort2':
                    this.setState( {teamSelected: cohort2 });
                    return;
                  case 'cohort3':
                    this.setState( {teamSelected: cohort3 });
                    return;
                }
    },
    
    updatePerson: function(e){
        this.setState({person: e.target.value });
                  
    },
    
    render: function(){
        return(
            <div>
                <TeamSelector update={this.updateTeam} />
                <PersonSelector choices={this.state.teamSelected} update={this.updatePerson} onChange={this.props.update} />
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
        return this.props;    
    },
    
    
    render: function(){
        return(
            <label>
                Person:
                <select id="second-choice" onChange={this.props.updatePerson}>
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

module.exports = Selectors;

// var StartDateSelector = React.createClass({
//     render: function(){
//         return(
//             <label>
//               Start Date:
//               <select id="third-choice">
//                 <option value="base">Choose a start date</option>
                
//               </select>
//             </label>
//         );
//     }  
// });

// var TimeRangeSelector = React.createClass({
//     render: function(){
//         return(
//             <label>
//               Time Range:
//               <select id="fourth-choice">
//                 <option value="base">Select</option>
//                 <option value="oneDay">1 Day</option>
//                 <option value="twoDay">2 Days</option>
//                 <option value="oneWeek">1 Week</option>
//                 <option value="twoWeek">2 Weeks</option>
//                 <option value="oneMonth">1 Month</option>
//                 <option value="twoMonth">2 Months</option>
//                 <option value="allTime">All Time</option>
//               </select>
//             </label>
//         );
//     }  
// });


