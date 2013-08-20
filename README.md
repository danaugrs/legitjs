# legit.js 0.1.0

Lightweight objects and strings validation for Node.js.


## Usage

```js
    var legit = require("./legit");

    var schema = legit.Number().min(0).max(10);

    schema.test(30);  // 'Greater than max'
    schema.test(5);   // null

    legit.mize(schema, 30);  // 'Greater than max'
    legit.mize(schema, 5);   // null
```

Note: Use of "new" is not needed when creating an instance of a schema.

## Examples

### Boolean

```js
        var schema = legit.Bool();

        var good_data = true;
        var bad_data = 123;

        var result1 = legit.mize(schema, good_data); // null (no error)
                //  = schema.test(good_data);
        
        var result2 = legit.mize(schema, bad_data);  // 'Not a boolean'
                //  = schema.test(bad_data);
```

### Number

```js
        var schema = legit.Number().min(-10).max(10);

        var good_data = -3;
        var bad_data = 11;

        var result1 = legit.mize(schema, good_data); // null (no error)
                //  = schema.test(good_data);
        
        var result2 = legit.mize(schema, bad_data);  // 'Greater than maximum'
                //  = schema.test(bad_data);
```

### String

```js
        var schema = legit.String().min(5).max(19);

        var good_data = "Legit.js is cool!";
        var bad_data = "Legit.js is not cool.";

        var result1 = legit.mize(schema, good_data); // null (no error)
                //  = schema.test(good_data);
        
        var result2 = legit.mize(schema, bad_data);  // 'Greater than maximum'
                //  = schema.test(bad_data);
```

### Array

```js
        var schema = legit.Array().min(2).max(5).
            type(legit.Number().min(0).max(100));

        var good_data = [1, 2, 3];
        var bad_data = [-10, true, "potato", [1, 2], null];
        
        var result1 = legit.mize(schema, good_data); // null (no error)
                //  = schema.test(good_data);
        
        var result2 = legit.mize(schema, bad_data);  // ['Less than minimum',
                //  = schema.test(bad_data);         //  'Not a number',
                                                     //  'Not a number',
                                                     //  'Not a number',
                                                     //  'Number is null or undefined']
```

### Map

```js
        var schema = legit.Map().
            key("name", legit.String().min(5).max(10)).
            key("age", legit.Number().min(21).max(130));

        var good_data = {
            "name"  : "John Doe",
            "age"   : 21
            };
        
        var bad_data = {
            "name"  : "SuperLongName",
            "age"   : 16
            };

        var result1 = legit.mize(schema, good_data); // null (no error)
                //  = schema.test(good_data);
        
        var result2 = legit.mize(schema, bad_data);  // { name: 'Greater than maximum',
                //  = schema.test(bad_data);         //   age:  'Less than minimum' }
```

