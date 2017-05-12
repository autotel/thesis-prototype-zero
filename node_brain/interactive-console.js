
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

module.exports=function(question,callback){
  rl.question(question, (answer) => {
    // TODO: Log the answer in a database
    // console.log(`Thank you for your valuable feedback: ${answer}`);
    callback(answer);
    // rl.close();
  });
}