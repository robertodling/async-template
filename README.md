# async-template

> Build templates asynchronously with an easy to use API, for the browser and for node.js!


```js
asyncTemplate.
	render('{{foo}}').
	provide('foo',function (ctx, done) {
		done(null, 'bar');
	}).
	end(function (err, rendered) {
		// rendered === 'bar'
	});
```

## Installation

```bash
$ npm install --save ...
```

```bash
$ bower install --save ...
```

Grab module with
``require('async-template');``



## Usage

### Basics

A new render is initiated via the public ``render`` method

```js
asyncTemplate.render(myTemplate)

```
this will return a new instance.

<br/>

Provide values asynchronously via ``provide`` method

```js
.provide(token, function (ctx, done) {})
	
``` 
chain as many as you like.

<br/>

To finally render the template and retrieve the results invoke the ``end`` method.
```js
.end(function (err, rendered) {});
``` 

###Extras

A context object optionally be provided via ``context`` method.
```js
.context({some:'value'})
	
``` 
this object will be provided as a parameter in each ``provide`` handler.

<br/>


Optionally the template parameter can be omitted from the ``render`` method and instead be provided via ``template`` method
```js
.template(myTemplate);
	
``` 
this is nifty if you want to re-use registered providers on a new template.


##Examples##

Providing many values
```js

asyncTemplate.
	render('I {{feeling}} {{language}}!').
	provide('feeling',function (ctx, done) {
		done(null, 'love');
	}).
	provide('language',function (ctx, done) {
		done(null, 'Javascript');
	}).
	end(function (err, rendered) {
		// rendered === 'I love Javascript!'
	});

```

Passing context object

```js
asyncTemplate.
	render('protocol://authservice.site?authToken={{token}}').
	provide('token',function (ctx, done) {
		// generate token with ctx.user and ctx.password async
		setTimeout(function (){
			done(null, "qwerty");
		},0);
	}).
	context({user:'john', password:'1234'}).
	end(function (err, rendered) {
		// rendered === 'protocol://authservice.site?authToken=qwerty'
	});

```

Same provider for different templates

```js
var renderer = asyncTemplate.render().
	provide('foo',function (ctx, done) {
	    done(null, 'bar');
	}).
	provide('hello', function (ctx, done) {
	    done(null, 'world');
    });
    
renderer.template('aaa {{foo}} bbb').
	end(function (err, rendered) {
        //rendered === 'aaa bar bbb'
    });
	    
renderer.template('aaa {{hello}} bbb').
	end(function (err, rendered) {
        //rendered === 'aaa world bbb'
    });

```

## License

MIT

