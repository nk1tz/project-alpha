var React = require("react");
var teamData = require("../../../teamdata.json")


var TeamSelector = React.createClass({
    render: function(){
        return(
            <label className="pull-left">
              Team:
              <select id="first-choice">
                <option selected value="base">Select</option>
                <option value="allcohorts">All cohorts</option>
                <option value="cohort1">Cohort-1</option>
                <option value="cohort2">Cohort-2</option>
                <option value="cohort3">Cohort-3</option>
              </select>
            </label>
        );
    }  
});

// <script>
//             $("#first-choice").change(function() {
//               var $dropdown = $(this);

//               $.getJSON("data.json", function(data) {

//                 var key = $dropdown.val();
//                 var vals = [];

//                 switch (key) {
//                   case 'allcohorts':
//                     vals = data.allcohorts.split(",");
//                     break;
//                   case 'cohort1':
//                     vals = data.cohort1.split(",");
//                     break;
//                   case 'cohort2':
//                     vals = data.cohort2.split(",");
//                     break;
//                   case 'cohort3':
//                     vals = data.cohort3.split(",");
//                     break;
//                   case 'base':
//                     vals = ['Please choose a team'];
//                 }

//                 var $secondChoice = $("#second-choice");
//                 $secondChoice.empty();
//                 $.each(vals, function(index, value) {
//                   $secondChoice.append("<option>" + value + "</option>");
//                 });

//               });
//             });
//           </script>


var PersonSelector = React.createClass({
    render: function(){
        return(
            <label>
              Person:
              <select id="second-choice">
                <option value="base">Select</option>
                <option value="all">Everyone</option>
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


module.exports = {
    Team: TeamSelector,
    Person: PersonSelector,
    StartDate: StartDateSelector,
    TimeRange: TimeRangeSelector
};

