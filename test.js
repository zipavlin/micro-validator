const Validator = require('./index');
const { performance } = require('perf_hooks');

const validator = new Validator({
    messages: {
        min: `Vrednost mora biti večja od {{options}}`,
        max: `Vrednost mora biti manjša od {{options}}`,
        email: `Vnesite pravilni email naslov`
    }
});
const validate = validator.validate;

// collect array of 1000 random strings
const tests = [];
for (let i = 0; i <= 1000; i++) {
    tests.push(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5));
}

const t0 = performance.now();
// validate all test strings
for (let test of tests) {
    validate("required|min:5|max:50", test);
}
const t1 = performance.now();
console.log("Call took " + (t1 - t0) + " milliseconds.");
