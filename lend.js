const _ = require('lodash');

let string = 'hellz2';

let newString = _.times(string.length, (i) => string.toUpperCase().charCodeAt(i));
for(let i = newString.length - 1; i>=0; i--) {
	if(newString[i] + 1 == 58) {
		newString[i] = 48;
	}
	else if(newString[i] + 1 == 91) {
		newString[i] = 65;
	}
	else {
		 newString[i] += 1;
		 break;
	}
}
newString = String.fromCharCode(...newString);

console.log(newString);