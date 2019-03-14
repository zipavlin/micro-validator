// require core validators
const { all } = require('./validators/core');

function Niggle (options = {}) {
    // private variables
    const _options = Object.assign({
        overwriteValidators: false
    }, options);
    const _parser = new RegExp(/^([\w_]+)(:)?(([\d, ]+)|(?:["']([\w\s\dščćž,\-_.?:;@]+)["'])|(?:\[(.*)])|([\\\w\d*,()^$"'| _\-:+?{}[\]]+))?$/);
    
    // public variables
    this.validators = _register(all);

    // private methods
    const _exist = function (variable) {
        return typeof variable !== 'undefined';
    };
    const _parseValidationString = function (string) {
        /*
        1. name
        2: divider
        3: value
        4. value: digit or range of digits
        5. value: string
        6. value: array
        7. value: pattern
        */
        if (_parser.test(string)) {
            const match = string.match(_parser);
            const name = match[1];
            let options = null;
            let type = null;            
            if(_exist(match[2])) {
                if (_exist(match[4])) {
                    options = match[4].split(",").map(x => parseInt(x.trim()));
                    switch (options.length) {
                        case 0: options = null; type = null; break;
                        case 1: options = options[0]; type = 'int'; break;
                        case 2: type = 'range'; break;
                        default: type = 'array'; break;
                    }
                }
                else if (_exist(match[5])) {
                    options = match[5];
                    type = 'string';
                }
                else if (_exist(match[6])) {
                    options = match[6].split(',').map(x => {
                        x = x.replace(/"|'|\\"|\\'/g, '').trim();
                        return isNaN(x) ? x : parseFloat(x);
                    });
                    type = 'array';
                }
                else if (_exist(match[7])) {
                    options = new RegExp(match[7]);
                    type = 'pattern';
                }
            }
            return {
                name,
                options,
                type,
                extended: (_exist(match[2]) && _exist(match[3]))
            };
        } else {
            throw new Error (`'${string}' is not a valid validator`);
        }
    };
    const _message = function (message, values) {
        return message.replace(/{{(.*?)}}/g, (match, p1, offset, string) => {
            if (/.*?\[\d+\]/.test(p1)) {
                const p2 = p1.match(/(.*?)\[(\d+)\]/);
                return values[p2[1]][p2[2]];
            } else {
                return Array.isArray(values[p1]) ? `[${values[p1].join(", ")}]` : values[p1];
            }
        })
    };
    const _customMessage = function (name) {
        return (options && options.hasOwnProperty('messages') && options.messages.hasOwnProperty(name)) ? options.messages[name] : null;
    };
    const _validate = function (validation, input, fast, verbose) {
        // parse validation to validators
        const validatorStringsArray = validation.split('|').map(x => x.trim().toLowerCase());
        const errors = [];
        const results = [];
        for (let validatorString of validatorStringsArray) {
            // parse validator
            let parsed = _parseValidationString(validatorString);
            if (verbose) console.log(parsed);
            if (!this.validators.hasOwnProperty(parsed.name)) {
                console.log('error');
                //return false;
                throw new Error(`Validator '${parsed.name}' doesn't exist`);
            }
            // get validator
            let validator = this.validators[parsed.name];
            // validate type
            if (validator.hasOwnProperty('type') && ((!Array.isArray(validator.type) && parsed.type !== validator.type) || (Array.isArray(validator.type) && !validator.type.includes(parsed.type)))) throw new Error(`Validator type should be ${validator.type}, but is ${parsed.type} instead`);
            // validate value
            let valid = validator.callback(input, parsed.options, parsed.type);
            results.push(valid);
            // push to array
            if (fast) {
                if (valid === false) {
                    // fail validation and break out of loop
                    return false;
                }
            } else if (valid === false) {
                // push error to array
                errors.push(_message(_customMessage(parsed.name) || validator.message, Object.assign(parsed, {input})));
            }
        }
        return fast ? results.filter(x => x !== null).length ? true : null : errors;
    }.bind(this);
    function _register (newValidators, oldValidators = {}, force = false) {
        // prepare array
        if (typeof newValidators !== 'object') return new Error('Validator must be either an object or array of objects');
        if (!Array.isArray(newValidators)) newValidators = [newValidators];
        // prepare object
        const newValidatorsObject = newValidators.reduce((acc, cur, idx, src) => {
            // don't duplicate
            if (acc.hasOwnProperty(cur.name)) return acc;
            // add new validator
            let {name, synonym, ...properties} = cur;
            acc[cur.name] = {...properties};
            // link synonyms
            if (synonym) {
                if (!Array.isArray(synonym)) synonym = [synonym];
                for (let n of synonym) {
                    acc[n] = acc[name];
                }
            }
            return acc;
        }, {});
        // merge validators with current validators
        if (force) {
            return Object.assign(oldValidators, newValidatorsObject);
        } else {
            return Object.assign(newValidatorsObject, oldValidators);
        }
    };

    // public methods
    this.validate = function (validation, input, verbose) {
        // return if input doesn't exist
        //const validate = _validate(validation, input, true, verbose);
        switch(_validate(validation, input, true, verbose)) {
            case null:
                return {
                    valid: null,
                    errors: null
                }
            case true:
                return {
                    valid: true,
                    errors: null
                }
            case false:
                return {
                    valid: false,
                    errors: _validate(validation, input, false, verbose)
                }
        }
    };
    this.valid = function (validation, input) {
        // return if input doesn't exist
        return _validate(validation, input, true);
    };
    this.errors = function (validation, input) {
        // return if input doesn't exist
        return _validate(validation, input);
    };
    this.registerValidators = function (validators, force) {
        this.validators = _register(validators, this.validators, force);
    }
    this.registerPlugins = function (plugins) {
        // this is only a place holder method for latter
    }
}

module.exports = Niggle;