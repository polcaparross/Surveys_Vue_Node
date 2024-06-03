
//TODO
let getDelayedPromiseGenerator = function(){
  return function(vot){
    let delay = 0
    return new Promise((resolve, reject) =>{
      let timeout = 0
      if(delay == 0){
        timeout = 0
      } else{
        timeout = delay + Math.random() * 100000
        delay = timeout
      }
      setTimeout(() => {
        console.log('FINISH')
        resolve(vot)
      }, delay);
    })
  } 
}
  
//TODO
const SurveyServer = function(){

  let timeout = undefined
  
  let resolveF = null

  let surveyResult = {participants: 0, responses: [0,0,0,0,0]}

  let pendingP = 0
    
  this.toString = () =>{
    console.log(`participants: ${surveyResult.participants}`);
    surveyResult.responses.forEach((response, index)=>{
      let category = (index == 0) ? 'molt bé' : (index==1) ? 'bé'  : (index==2) ? 'ni bé ni malament' :  (index==3) ? 'regular' : 'malament'
      console.log(`${category}: ${response}`);
    })
  }

  this.getResults = () =>{
    return new Promise((resolve, response) => {
      resolveF = resolve
    })
  }

  this.addResponse = (p) => {
    pendingP++
    p.then(res => {
      surveyResult.participants += 1
      surveyResult.responses[res] += 1
    })
    .finally(res => {
      pendingP--
      if(timeout == undefined && pendingP == 0){
        resolveF(surveyResult)
      }
    })

    if(timeout != undefined){
      clearTimeout(timeout)
    }
    timeout = setTimeout(()=>{
      timeout = undefined
      if(pendingP == 0){
        resolveF(surveyResult)
      }

    },5000)
  }

}

//tests
let getDelayedPromise = getDelayedPromiseGenerator();
/*
//test 1 (ended by timeout) expected result: {participants:3 responses:[1,2,0,0,0]}
//----------------------------------------------------------------------------------
let ss = new SurveyServer()
ss.getResults().then(()=>{
  console.log("Results test 1: {participants:3 responses:[1,2,0,0,0]}");
  ss.toString()
})

let op_0 = getDelayedPromise(0)
ss.addResponse(op_0)
let op_1 = getDelayedPromise(1)
ss.addResponse(op_1)
let op_11 = getDelayedPromise(1)
ss.addResponse(op_11)
*/

/*
//test2 (ended by the last resolved promise (op_1)) expected result: {participants:3 responses:[0,0,1,2,0]}
//----------------------------------------------------------------------------------
let ss = new SurveyServer()
ss.getResults().then(()=>{
  console.log("Results test 2: {participants:3 responses:[0,0,1,2,0]}");
  ss.toString()
})

let op_3 = getDelayedPromise(3)
ss.addResponse(op_3)
let op_2 = new Promise((resolve, reject)=>{
  setTimeout(()=>{resolve(2)}, 6000)
})
ss.addResponse(op_2)
let op_33 = getDelayedPromise(3)
ss.addResponse(op_33)
*/



//== Web Server ==============================================================

import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3001;
const __dirname = path.resolve();
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let surveyServer = new SurveyServer()
app.post('/vote/:vote?', (req, res) => { 
  surveyServer.addResponse(getDelayedPromise(req.params.vote)) 
})

app.get('/results', (req, res)=>{
  if(typeof surveyServer != 'undefined'){
 //TODO
  surveyServer.getResults().then(data => res.json(data)).finally(()=>res.end())
  }else{ //dumy response
    setTimeout(()=>{
      res.json({participants: 30, responses:[5,10,12,1,2]})
      res.end()
      console.log("sending response");
    }, 1000)
  }
})

app.listen(port, () => console.log(`Server listening on port ${port}!`))


