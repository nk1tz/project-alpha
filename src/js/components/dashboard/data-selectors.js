var React = require("react");
var teamData = require("../../../teamdata.json");

var allCohorts = teamData.allcohorts.split(",");
var cohort1 = teamData.cohort1.split(",");
var cohort2 = teamData.cohort2.split(",");
var cohort3 = teamData.cohort3.split(",");


var Selectors = React.createClass({
    
    getInitialState: function(){
        return {
            teamSelected: cohort1,
            team:"Cohort1",
            person: "Everyone"
        };
    
    },
    
    getDataSelects: function(){
        return {
          team: this.state.team,
          person: this.state.person
        };
    },
    
    updateTeam: function(e){
        switch (e.target.value) {
                  case 'cohort1':
                    this.setState( {teamSelected: cohort1, team:"Cohort1" });
                    return;
                  case 'cohort2':
                    this.setState( {teamSelected: cohort2, team:"Cohort2" });
                    return;
                  case 'cohort3':
                    this.setState( {teamSelected: cohort3, team:"Cohort3" });
                    return;
                }
    },
    
    updatePerson: function(e){
        var personSelected = e.target.value;
        console.log(personSelected);
        this.setState({person: e.target.value }, function(){
            this.props.onChange(this.getDataSelects());
        }.bind(this));
                  
    },
    
    // componentDidMount: function(){
    //     window.team = this.refs.team;    
    // },
    
    render: function(){
        return(
            <div>
                <TeamSelector ref="team" update={this.updateTeam} />
                <PersonSelector ref="person" choices={this.state.teamSelected} update={this.updatePerson} />
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
                <select id="second-choice" onChange={this.props.update}>
                <option value="Everyone">Everyone</option>
                {
                    this.props.choices.map(function(val){
                        return <option value={val}>{val}</option>;
                    })
                    
                }
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


