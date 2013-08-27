# legit.js 0.1.0

Lightweight objects and strings validation for Node.js.


## Usage

Create a schema and use it to validate data.

There are two equivalent usages:
- `schema.test(data)`
- `legit.mize(schema, data)`

These functions return `null` if there was no error validating the data.
If the data didn't fit the schema, they return a description of the error (either a String, an Array, or a Map/Object).

```js
    var schema = legit.Number().min(5).max(10);
    
    var err1 = schema.test(30);  // err1 = 'Greater than max'
    var err2 = schema.test(6);   // err2 = null
    
    // alternative usage:
    err1 = legit.mize(schema, 30);  // err1 = 'Greater than max'
    err2 = legit.mize(schema, 6);   // err2 = null
```

Note: The keyword "new" should not be used when creating an instance of a schema.

### Real world example

Suppose you have some incoming network data and you want to validate it before using/processing it.

```js
    // Create the schema
    var userSchema = legit.Map().strict()
        .key("user", legit.String().min(3).max(20))
        .key("age", legit.Number().min(21));
    
    // Validate incoming data
    var err = userSchema.test(data);

    if (err) {
        // Data did not fit the schema. Check 'err' to learn what went wrong.
        console.log(err);
    }
    else {
        // Data successfully validated! Now you can use/process it with confidence.
        ...
    }
```


## Types Of Schemas

- [legit.Any()](#legitany)
- [legit.Null()](#legitnull)
- [legit.Boolean()](#legitboolean)
- [legit.Number()](#legitnumber)
- [legit.String()](#legitstring)
- [legit.Array()](#legitarray)
- [legit.Map()](#legitmap)


### legit.Any()

Accepts anything.

Example:
```js
        var schema = legit.Any();
        schema.test("POTATO")   // null
        schema.test([1, 2, 3])  // null
```

### legit.Null()

Accepts only `null`.

Example:
```js
        var schema = legit.Null();
        schema.test("Hello")    // 'Not null'
        schema.test(null)       // null
```

### legit.Boolean()

Accepts only Booleans.

Modifiers:
- none(): Accepts `null` and `undefined`.

Example:
```js
        var schema = legit.Bool();
        schema.test(123)    // 'Not a boolean'
        schema.test(null)   // 'Boolean is null or undefined'
        schema.test(true)   // null

        var schema2 = legit.Bool().none()
        schema2.test(null)   // null
```

### legit.Number()

Accepts only Numbers.

Modifiers:
- `none()`: Accepts `null` and `undefined`.
- `min(a)`: Sets minimum allowed value (`a`).
- `max(b)`: Sets maximum allowed value (`b`).

Example:
```js
        var schema = legit.Number().min(-5).max(30);
        schema.test(-5);    // null
        schema.test(31);    // 'Greater than maximum'
        schema.test(true);  // 'Not a number'
        schema.test(null);  // 'Number is null or undefined'
```

### legit.String()

Accepts only Strings.

Modifiers:
- `none()`: Accepts `null` and `undefined`.
- `min(a)`: Sets minimum allowed length (`a`).
- `max(b)`: Sets maximum allowed length (`b`).
- `regex(e)`: Sets a regular expression to use (`e`).

Example:
```js
        var schema = legit.String().max(12).regex(/(\w+)\s(\w+)/);
        schema.test("JohnSmith");      // 'Regular expression didn't match'
        schema.test("John Smith");     // null
        schema.test("John R. Smith");  // 'Greater than maxmimum'
```

### legit.Array()

Accepts only Arrays. Can be used recursively with all other schemas.

You have two options when using legit.Array():
- Set a schema to validate all objects of the array by using `.type(schema)` once.
- Set a different schema for each item by using `.item(schema)` once for each item, in the expected order.

Modifiers:
- `none()`: Accepts `null` and `undefined`.
- `min(a)`: Sets minimum allowed length (`a`). Only affects same-type arrays.
- `max(b)`: Sets maximum allowed length (`b`). Only affects same-type arrays.
- `type(s)`: Sets a schema (`s`) to test all array items. Establishes array as same-type.
- `item(s)`: Sets a schema (`s`) to test a single item of the array. Establishes array as different-type.
- `strict()`: Rejects arrays with length greater than expected. Only affects different-type arrays.

Example:
```js
        // Same-type array
        var schema = legit.Array().max(4)
            .type(legit.Number().min(0).max(10));

        schema.test([1, 2, 3, 4]);     // null
        schema.test([1, 2, 3, 4, 5]);  // 'Greater than maxmimum'
        schema.test([5, 11]);          // [null, 'Greater than maximum']
        
        // Different-type array
        var schema = legit.Array().strict()
            .item(legit.String().min(3).max(12))
            .item(legit.Number().min(21));

        schema.test(["John Smith", 25]);
        // null

        schema.test(["John", 25, true]);  
        // [ null, null, 'More items than expected (Array in strict mode)' ]
        
        schema.test(["John Smith Jr.", 20]);
        // [ 'Greater than maximum', 'Less than minimum' ]
```

### legit.Map()

Accepts only Maps/Objects. Can be used recursively with all other schemas.

Modifiers:
- `none()`: Accepts `null` and `undefined`.
- `strict()`: Rejects maps with unexpected keys.
- `key(n, s)`: Sets an expected key-value pair. `n` is the expected key and `s` is the schema that will be used to validate the value.

Example:
```js
    var schema = legit.Map().strict()
        .key("user", legit.String().min(3).max(12))
        .key("age", legit.Number().min(21));

    schema.test({
        "user": "John Smith",
        "age": 25
    }) 
            // null
    
    schema.test({
        "user": "John Smith Junior",
        "age": 16
    })
            // { user: 'Greater than maximum',
            //    age: 'Less than minimum' } 


```

## Support/Contact

Feel free to [contact me](https://github.com/danaugrs) with questions, suggestions, or comments.

I hope you enjoy using legit.js as much as I enjoyed writing it.

If you come across any issues, please [report them](https://github.com/danaugrs/legitjs/issues).

