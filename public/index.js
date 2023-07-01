// SIGNUP-LOGIN CONTAINER

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});
const Handlebars = require('handlebars');

Handlebars.registerHelper('isEqual', function (value1, value2, options) {
    return value1 == value2 ? options.fn(this) : options.inverse(this);
});

