/**
 * Legit.js
 */

"use strict";


/************************
 * Bool Legitimizer
 */

function Boolean() {
    this._none = false;
}

Boolean.prototype.none = function(state) {
    state = (state == undefined) ? true : state;
    this._none = state;
    return this;
}

Boolean.prototype.test = function(value) {
    
    if (value == null) {
        if (this._none) {
            return null;
        }
        return "Boolean is null or undefined";
    }
    if (typeof(value) != "boolean") {
        return "Not a boolean";
    }
    return null;
}


/************************
 * Number Legitimizer
 */

function Number() {
    this._none = false;
    this._min  = null;
    this._max  = null;
}

Number.prototype.none = function(state) {
    state = (state == undefined) ? true : state;
    this._none = state;
    return this;
}

Number.prototype.min = function(min) {
    this._min = min;
    return this;
}

Number.prototype.max = function(max) {
    this._max = max;
    return this;
}

Number.prototype.test = function(value) {
    
    if (value == null) {
        if (this._none) {
            return null;
        }
        return "Number is null or undefined";
    }
    if (typeof(value) != "number") {
        return "Not a number";
    }
    if (this._min !== null && value < this._min) {
        return "Less than minimum";
    }
    if (this._max !== null && value > this._max) {
        return "Greater than maximum";
    }
    return null;
}


/************************
 * String Legitimizer
 */

function String() {
    this._none = false;
    this._min  = null;
    this._max  = null;
   	this._re = null;
}

String.prototype.none = function(state) {
    state = (state == undefined) ? true : state;
    this._none = state;
    return this;
}

String.prototype.min = function(min) {
    this._min = min;
    return this;
}

String.prototype.max = function(max) {
    this._max = max;
    return this;
}

String.prototype.regex = function(patt) {
	this._re = new RegExp(patt);
    return this;
}

String.prototype.test = function(value) {

    var i, l;

    if (value == null) {
        if (this._none) {
            return null;
        }
        return "String is null or undefined";
    }
    if (typeof(value) != "string") {
        return "Not a string";
    }
	if (this._min !== null && value.length < this._min) {
        return "Less than minimum";
    }
    if (this._max !== null && value.length > this._max) {
        return "Greater than maximum";
    }
	if (this._re && this._re.test(value) == false) {
		return "Regular expression didn't match"
	}
    return null;
}


/************************
 * Array Legitimizer
 */

function Array() {
    this._none = false;
    this._min  = null;
    this._max  = null;
    this._items = [];
	this._type = null;
    this._strict = false;
}

Array.prototype.none = function(state) {
    state = (state == undefined) ? true : state;
    this._none = state;
    return this;
}

Array.prototype.min = function(min) {
    this._min = min;
    return this;
}

Array.prototype.max = function(max) {
    this._max = max;
    return this;
}

Array.prototype.item = function(schema) {
    this._items.push(schema);
    return this;
}

Array.prototype.type = function(schema) {
    this._type = schema;
    return this;
}

Array.prototype.strict = function(state) {
    state = (state == undefined) ? true : state;
    this._strict = state;
    return this;
}

Array.prototype.test = function(value) {
	
    var errs = [];
	var error = false;
    var err, i, l;

    if (value == null) {
        if (this._none) {
            return null;
        }
        return "Array is null or undefined";
    }
    if (typeof(value) != "object") {
        return "Not an array";
    }
    l = value.length;
	if (this._type) { // If Array has same-type items
        if (this._min !== null && l < this._min) {
            return "Less than minimum";
        }
        if (this._max !== null && l > this._max) {
            return "Greater than maximum";
        }
		for (i = 0; i < l; i++) {
        	err = this._type.test(value[i]);
            errs.push(err);
            if (err != null) {
		    	error = true;
            }
    	}
	} else { // If Array has different-type items 
		for (i = 0; i < l; i++) {
            if (this._items[i] == undefined) {
                if (this._strict == true) {
                    error = true;
                    err = "More items than expected (Array in strict mode)"
                    errs.push(err);
                }
                break
            } else {
        	    err = this._items[i].test(value[i]);
                errs.push(err);
                if (err != null) {
		        	error = true;
                }
            }
    	}
	}
	if (error) {return errs}
    else {return null};
}


/************************
 * Map Legitimizer
 */

function Map() {
	this._none = false;
    this._strict = false;
    this._keys = {};
}

Map.prototype.none = function(state) {
    state = (state == undefined) ? true : state;
    this._none = state;
    return this;
}

Map.prototype.strict = function(state) {
    state = (state == undefined) ? true : state;
    this._strict = state;
    return this;
}

Map.prototype.key = function(name, schema) {
    this._keys[name] = schema;
    return this;
}

Map.prototype.test = function(value) {
	
    var errs = {};
	var error = false;
    var err, el;

    if (value == null) {
        if (this._none) {
            return null;
        }
        return "Map is null or undefined";
    }
    if (typeof(value) != "object") {
        return "Not a map";
    }
    for (el in this._keys) {
        if (value[el] == undefined) {
            err = "Missing this key";
        } else {
            err = this._keys[el].test(value[el]);
        }
		errs[el] = err;
        if (err != null) {
			error = true;
        }
    }
    if (this._strict) {
        for (el in value) {
            if (this._keys[el] == undefined) {
                err = "Unexpected key (Map in strict mode)" 
            } else {
                err = this._keys[el].test(value[el]);
            }
		    errs[el] = err;
            if (err != null) {
		    	error = true;
            }
        }
    }
	if (error) {return errs}
    else {return null};
}


/************************
 * Node.js module exports
 */

module.exports = {
	Boolean		: function() {return new Boolean()},
	Number		: function() {return new Number()},
	String		: function() {return new String()},
	Array		: function() {return new Array()},
	Map			: function() {return new Map()},
	mize		: function(l, v) {return l.test(v)}
    }

