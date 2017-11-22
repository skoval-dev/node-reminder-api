const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

let data = {
  id: 10,
    _id: 2
};

let token = jwt.sign(data, '123abc');
let verify = jwt.verify(token, '123abc');
console.log(verify);


// let message = "I am user number 3";
// let hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// let data = {
//     id: 4,
// };
//
// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret')
// };
//
//   //token.data.id = 5;
//   //token.hash = SHA256.encrypt(JSON.stringify((token.data))).toString();
//
//
// let result_hash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(result_hash === token.hash){
//     console.log("Data was not change");
// } else {
//   console.log("Data was changed. Not trust.")
// }