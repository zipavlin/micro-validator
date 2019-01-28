# Niggle
Niggle is a tiny, customizable javascript value validator with laravel inspired syntax and no dependencies. 

## installation
Install using ```npm install @zipavlin/niggle```

## example

```javascript
    const niggle = require('@zipavlin/niggle');
    const validate = new Niggle({
        // optional options
        messages: {
            min: 'Your input is too low! Is should be higher than {{options}}'
        }
    }).validate;
    console.log(validate('min:2|max:5', 3));
```

## methods

Validator has only few public methods:

1. __validate(String validator, String|Int input)__ - validate input agains validator string and return validity and errors: {valid: Bool, errors: Array|null }
2. __valid(String validator, String|Int input)__ - validate input agains validator string and return validity: Bool
3. __errors(String validator, String|Int input)__ - validate input agains validator string and return array of errors: Array|null
4. __registerValidators(Array validators)__ - register validators
5. __registerPlugins(Array plugins)__

## validators

### core

Name        | Options       | Example               | Description
----------- | ------------- | --------------------- | -----------
__min__     | Number        | _'min:5'_             | length (of string) or amount (for number) must be higher than option
__max__     | Number        | _'max:5'_             | length (of string) or amount (for number) must be lower than option
__between__ | Number,Number | _'between:1,5'_       | length (of string) or amount (for number) must be between first option and second option
__length__  | Number        | _'length:5'_          | length (of string) or amount (for number) must be equal to option
__email__   | Null          | _'email'_             | input must match email pattern
__is__      | Number/String | _'is:"must be this"'_ | input must be equal to option (type included)

## creating and adding validators

Validator is basically an object with required name, message and callback properties:

```javascript
const customValidator = {
    name: 'min_or_equal', // required - is used as validator key.
    synonym: 'gte', // optional
    type: 'number', // optional - is passed to callback. Can be: string, number, range, array
    message: 'Input must be higher or equal to {{options}}', // required -- default error message with value injection. Possible dynamic values include options (including arrays), type, input
    callback: (input, options, type) => { // required
        return isNaN(input) ? (input.length >= options) : (input >= options);
    }
}
const validator = new Validator();
validator.registerValidators(customValidator);
validator.validate('min_or_equal:19', 'this is test string'); // true
```

## plugins

Plugins are not supported in this moment, but are planned.