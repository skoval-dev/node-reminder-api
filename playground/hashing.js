const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abc!';

let hash = bcrypt.genSalt(10, (err, salt) => {
    console.log(salt);
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

let hashed_pass = '$2a$10$RtW.CoVXGnHrpPkiCMSOheNpjzJ2hIqwlOawP8DWw2xmoaxdZTz9S';
bcrypt.compare(password, hashed_pass, (err, res) => {
   console.log(res);
});

let message = "I am user number 3";
hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

data = {
    id: 4,
};

token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret')
};

  //token.data.id = 5;
  //token.hash = SHA256.encrypt(JSON.stringify((token.data))).toString();


let result_hash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if(result_hash === token.hash){
    console.log("Data was not change");
} else {
  console.log("Data was changed. Not trust.")
}

data = {
  id: 10,
    _id: 2
};

token = jwt.sign(data, '123abc');
verify = jwt.verify(token, '123abc');
console.log(verify);


