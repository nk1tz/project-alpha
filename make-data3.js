var fs = require("fs");
var dmtldata = require("./src/dmtldata/dmtldata.json");

var timeZero = 1441584000000; //this is Septembre 7th 2015 1:00 am.
var dataPoint = [];
var runningClosedSum = 0;
var diff = 0;

var ClosedData = [];

var temp = dmtldata.dmtldata.Cohort1.students["Everyone"].PRdata;

function makeClosedData(){
    
    for (var i=0; i<1345; i++){
        if(i===0){
            dataPoint = [ timeZero+(3600000*i) , 0 ];
            ClosedData.push(dataPoint);
        }else{
            diff = temp[i-1][1]-temp[i][1];
            if( diff > 0 ){
                runningClosedSum += diff;
                dataPoint = [ timeZero+(3600000*i) , runningClosedSum];
                ClosedData.push(dataPoint);
            }else{
                dataPoint = [ timeZero+(3600000*i) , runningClosedSum];
                ClosedData.push(dataPoint);
            }
        }
        console.log(dataPoint);
    }
    return ClosedData;
    // console.log(EveryonePRdata);
}




fs.writeFileSync( 'somedata.json', JSON.stringify( makeClosedData() ) );