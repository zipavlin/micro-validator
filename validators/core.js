/*
url
numeric
time(format)
date(format)
pattern(format)
*/

const min = {
    name: 'min',
    synonym: 'gt',
    type: 'int',
    message: 'Value must be higher than {{options}}',
    callback: (input, options) => {
        return isNaN(input) ? (input.length > options) : (input > options);
    }
};

const max = {
    name: 'max',
    synonym: 'lt',
    type: 'int',
    message: 'Value must be lower than {{options}}',
    callback: (input, options) => {
        return isNaN(input) ? (input.length < options) : (input < options);
    }
};

const between = {
    name: 'between',
    type: 'range',
    message: 'Value must be between {{options[0]}} and {{options[1]}}',
    callback: (input, options) => {
        return isNaN(input) ? (input.length > options[0] && input.length < options[1]) : (input > options[0] && input < options[1]);
    }
};

const length = {
    name: 'length',
    type: 'int',
    message: 'Value must be {{options}} characters long',
    callback: (input, options) => {
        return ((typeof input === 'string' && input.length === options) || (typeof input === 'number' && input.toString().length === options) || (Array.isArray(input) && input.length === options));
    }
};

const is = {
    name: 'is',
    synonym: 'equal',
    type: ['string', 'int'],
    message: 'Value must be equal to {{options}}, but is {{input}} instead',
    callback: (input, options, type) => {        
        return input === options;
    }
}

const email = {
    name: 'email',
    message: 'Value does not match email pattern',
    callback: (input) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(input).toLowerCase());
    }
};

const required = {
    name: 'required',
    message: 'Value is required',
    callback: (input) => {
        return (typeof input !== 'undefined' && input !== null && input !== '');
    }
};

const inside = {
    name: 'inside',
    type: 'array',
    message: 'Value must be inside {{options}}',
    callback: (input, options) => {
        return (options.includes(input));
    }
};

const not_inside = {
    name: 'not_inside',
    type: 'array',
    message: 'Value must not be inside {{options}}',
    callback: (input, options) => {
        return (!options.includes(input));
    }
};

const pattern = {
    name: 'pattern',
    synonym: 'regex',
    type: 'pattern',
    message: 'Value must match {{options}} pattern',
    callback: (input, options) => {
        return options.test(input);
    }
};

module.exports = {
    min,
    max,
    between,
    length,
    email,
    is,
    pattern,
    all: [min, max, between, length, email, is, required, inside, not_inside, pattern]
}