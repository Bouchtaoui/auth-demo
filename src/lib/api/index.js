
import Parse from "parse/node";

const P = {};

Parse.serverURL = 'https://parseapi.back4app.com';
Parse.initialize(
    'BCrUQVkk80pCdeImSXoKXL5ZCtyyEZwbN7mAb11f', // This is your Application ID
    '4wPYRKbpTJeCdmFNaS31AiQZ8344aaYubk6Uo8VW', // This is your Javascript key
);

/**
 * 
 * @param {string} email 
 * @param {string} pwd 
 */
P.register = function signUp(email, pwd) {
    // Create a new instance of the user class
    const user = new Parse.User();
    // user.set("username", "my name");
    user.set("email", email);
    user.set("password", pwd);

    user.signUp().then(function(user) {
        console.log('User created successful with name: ' + user.get("username") + ' and email: ' + user.get("email"));
    }).catch(function(error){
        console.log("Error: " + error.code + " " + error.message);
    });
}

/**
 * 
 * @param {string} email 
 * @param {string} pwd 
 */
P.login = function signIn(email, pwd) {
    // Create a new instance of the user class
    const user = new Parse.User();
    // user.set("username", "my name");
    user.set("email", email);
    user.set("password", pwd);

    user.logIn().then(function(usr) {
        console.log('User created successful with name: ' + usr.get("username") + ' and email: ' + usr.get("email"));
    }).catch(function(error){
        console.log("Error: " + error.code + " " + error.message);
    });
}

export default P;
