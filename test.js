/**
 * Legit.js Tests
 */

"use strict";

var legit = require("./legit");

// Test function

function test(leg, ok, nok, loghead) {
    for (var pos = 0; pos < ok.length; pos++) {
        var err = leg.test(ok[pos]);
        if (err !== null) {
            ok = false;
            console.log("%s: ok[%d]:", loghead, pos);
		    console.log("   ->", err);
		}
    }
    for (var pos = 0; pos < nok.length; pos++) {
        var err = leg.test(nok[pos]);
        if (err == null) {
            ok = false;
            console.log("%s: nok[%d]", loghead, pos);
        }
    }
}

// Main program

function main() {

    var ok, nok;

    // Boolean tests
    var boolean1 = legit.Boolean();
    ok = [true, false];
    nok = ["34", -10, 200, null];
    test(boolean1, ok, nok, "Boolean1");

    var boolean2 = legit.Boolean().none();
    ok = [true, false, null, undefined];
    nok = ["34", -10, 200];
    test(boolean2, ok, nok, "Boolean2");

    // Number tests
    var number1 = legit.Number().min(1).max(10);
    ok = [1.1, 2, 5.3, 8];
    nok = ["34", true, -10, 200, null];
    test(number1, ok, nok, "Number1");
    
	var number2 = legit.Number().none().max(100);
    ok = [-200, 0, 100, null];
    nok = ["34", true, 200];
    test(number2, ok, nok, "Number2");
    
	// String tests
    var string1 = legit.String().min(3).max(10).none();
    ok = ["hello", "123", null, undefined];
    nok = ["12", true, -10, 200];
    test(string1, ok, nok, "String1");

	var string2 = legit.String().min(3).max(30).regex(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
    ok = ["user@site.com", "abc@abc.com"];
    nok = ["abc@abc", "@abc.com.br", -10, 200, null];
    test(string2, ok, nok, "String2");

    // Array tests
    var array1 = legit.Array().min(1).max(2).none().type(legit.Number().min(2).max(10));
    ok = [[2, 10], null, undefined, [4, 6]];
    nok = [["12"], [true, false], [-1, 4], [2, 10.1]];
    test(array1, ok, nok, "Array1");
    
    var array2 = legit.Array().none().
        item(legit.Number().min(2).max(10)).
        item(legit.String().min(3).max(7));
    ok = [[2, "hello", 1234, true], null, undefined, [4, "goodbye"]];
    nok = [["12"], [true, false], [12, "asd"], [0, "feature"]];
    test(array2, ok, nok, "Array2");
    
    var array3 = legit.Array().strict().
        item(legit.Number().min(2).max(10)).
        item(legit.String().min(3).max(7));
    ok = [[2, "hello"], [4, "goodbye"]];
    nok = [["12"], [true, false], [12, "asd"], [0, "feature"], [3, "testing", "other"]];
    test(array3, ok, nok, "Array3");

    // Map tests
    var map1 = legit.Map().strict().
        key("id1", legit.Number().min(0).max(100)).
        key("id2", legit.Number().min(1).max(100));
	ok = [{"id1": 19, "id2": 2}, {"id1": 99, "id2":50}];
	nok = [{"id2": 19, "id3": 2}, {"id1": 100, "id2":-3, "other": 42}];
    test(map1, ok, nok, "Map1");

    var map2 = legit.Map().strict().
        key("id1", legit.Number().min(0).max(100), true).
        key("id2", legit.Number().min(1).max(100), false);
	ok = [{"id1": 19, "id2": 2}, {"id1": 99}];
	nok = [{"id2": 2}, {"id2": 19, "id3": 2}, {"id1": 100, "id2":-3, "other": 42}];
    test(map2, ok, nok, "Map2");

}

main();
