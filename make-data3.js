var fs = require("fs");
var dmtldata = require("./src/dmtldata/dmtldata.json");

// var PRdata = [];
var timeZero = 1441584000000; //this is Septembre 7th 2015 1:00 am.
var dataPoint = [];
// var p = 0;
// var pp = 0;
var runningSum = 0;
var temp=[];

var EveryonePRdata = [];

function makeClosedData(){
    
    for (var i=0; i<1345; i++){
        for (var key in dmtldata.dmtldata.Cohort1.students) {

            temp = dmtldata.dmtldata.Cohort1.students[key].PRdata;
            
            // console.log(temp[i][1] );
            
            hourlySum += temp[i][1];
            // console.log(hourlySum);
        }
        
        dataPoint = [ timeZero+(3600000*i) , hourlySum ];
        EveryonePRdata.push(dataPoint);
        hourlySum = 0;
        console.log(dataPoint);
           
    }
    return EveryonePRdata;
    // console.log(EveryonePRdata);
}




fs.writeFileSync('somedata.json', JSON.stringify(makeEveryoneData()) );