var fs = require("fs");
var dmtldata = require("./src/dmtldata/dmtldata.json");

// var PRdata = [];
var timeZero = 1441584000000; //this is Septembre 7th 2015 1:00 am.
var dataPoint = [];
// var p = 0;
// var pp = 0;
var hourlySum = 0;
var temp=[];

var EveryonePRdata = [];

function makeEveryoneData(){
    
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


// function randomIntFromInterval(min,max)
// {
//     return Math.floor(Math.random()*(max-min+1)+min);
// }

// function fillPRData(){
//     for (var i=0; i<1345; i++){
//         for(var j=0; j<12; j++){
//             var chanceHit = Math.random();
//             if(chanceHit<0.08){
//                 p = randomIntFromInterval(0, Math.floor( Math.abs( Math.cos(i)*10 + 3 ) ) );
//                 dataPoint = [ timeZero+(3600000*i) , p ];
//                 PRdata.push(dataPoint);
//                 pp = p;
//                 i++;
//             }else{
//                 p = pp;
//                 dataPoint = [ timeZero+(3600000*i) , p ];
//                 PRdata.push(dataPoint);
//                 i++;
//             }
//         }
//         p = randomIntFromInterval(0, Math.floor( Math.abs( Math.cos(i)*10 + 3 ) ) );
//         dataPoint = [ timeZero+(3600000*i) , p ];
//         PRdata.push(dataPoint);
//         pp = p;
//     }
//     return PRdata;
// }



fs.writeFileSync('somedata.json', JSON.stringify(makeEveryoneData()) );