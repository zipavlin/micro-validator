const Niggle = require('../index');
const { performance } = require('perf_hooks');

const validator = new Niggle({
    messages: {
        min: `Vrednost mora biti večja od {{options}}`,
        max: `Vrednost mora biti manjša od {{options}}`,
        email: `Vnesite pravilni email naslov`
    }
});
const validate = validator.validate;

console.log(validate('pattern:^\\d{3}$', '123'));
console.log(validate('pattern:^\\d{3}$', '1a3'));