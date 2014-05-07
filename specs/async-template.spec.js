describe('async-template', function () {
	'use strict';

	var asyncTemplate = require('async-template');

	describe('render', function () {


		it('should replace token with correct value', function (done) {

			asyncTemplate.
				render('{{foo}}').
				provide('foo',function (data, done) {
					done(null, 'bar');
				}).
				end(function (err, rendered) {
					expect(rendered).to.equal('bar');
					done();
				});

		});


		it('should replace many tokens with correct values', function (done) {

			asyncTemplate.
				render('{{one}}{{two}}{{three}}').
				provide('one',function (data, done) {
					done(null, "1");
				}).
				provide('two',function (data, done) {
					done(null, "2");
				}).
				provide('three',function (data, done) {
					done(null, "3");
				}).
				end(function (err, rendered) {
					expect(rendered).to.equal('123');
					done();
				});

		});

		it('should provide context to providers', function (done) {

			asyncTemplate.render('{{value}}').
				provide('value',function (ctx, done) {
					done(null, ctx.value);
				}).
				context({value: 'sayHello'}).
				end(function (err, rendered) {
					expect(rendered).to.equal('sayHello');

					done();
				});
		});


		it('should be possible to set template from method', function (done) {

			asyncTemplate.
				render().
				template('{{foo}}').
				provide('foo',function (data, done) {
					done(null, 'bar');
				}).
				end(function (err, rendered) {
					expect(rendered).to.equal('bar');
					done();
				});

		});

	});

	it('should only invoke provide once when token is repeated', function (done) {
		var count = 0;
		asyncTemplate.render('{{foo}}{{foo}}{{foo}}{{foo}}').
			provide('foo',function (ctx, done) {
				done(null, 'bar');
				count++;
			}).
			end(function (err, rendered) {

				expect(count).to.equal(1);
				done();
			});
	});

	describe('error handling', function () {


		it('should provide error if provider for token is missing', function (done) {

			asyncTemplate.render('{{what}}').

				end(function (err, rendered) {
					expect(err).to.equal('Found no provider for token "what".');

					done();
				});
		});

		it('should provide error if template is missing', function (done) {

			asyncTemplate.render().

				end(function (err, rendered) {
					expect(err).to.equal('Please provide a template.');

					done();
				});
		});

		[
			"{{foo}",
			"{foo}",
			"{{}}",
			"{foo}}"

		].forEach(function (template) {
				it('should provide error if unable to parse tokens for "' + template + '"', function (done) {

					asyncTemplate.render(template).

						end(function (err, rendered) {
							expect(err).to.equal('Could not parse tokens from template "' + template + '".');
							done();
						});
				});
			});

		it('should provide error from provider', function (done) {

			asyncTemplate.render('{{value}}').
				provide('value',function (ctx, done) {

					done("I don't like this...");
				}).
				context({value: 'sayHello'}).
				end(function (err, rendered) {
					expect(err).to.equal("I don't like this...");

					done();
				});
		});
	});

	describe('misc', function () {

		it('should correctly render simple example', function () {


			asyncTemplate.
				render('{{foo}}').
				provide('foo',function (ctx, done) {
					done(null, 'bar');
				}).
				end(function (err, rendered) {
					expect(rendered).to.equal('bar');
				});
		});

		it('should correctly render multi provide example', function () {


			asyncTemplate.
				render('I {{feeling}} {{language}}!').
				provide('feeling',function (ctx, done) {
					done(null, 'love');
				}).
				provide('language',function (ctx, done) {
					done(null, 'Javascript');
				}).
				end(function (err, rendered) {
					expect(rendered).to.equal('I love Javascript!');
				});
		});

		it('should correctly render passing context example', function (done) {
			asyncTemplate.
				render('protocol://authservice.site?authToken={{token}}').
				provide('token',function (ctx, done) {
					// generate token with ctx.user and ctx.password async
					setTimeout(function () {
						done(null, "qwerty");
					}, 0);

				}).
				context({user: 'john', password: '1234'}).
				end(function (err, rendered) {
					expect(rendered).to.equal('protocol://authservice.site?authToken=qwerty');
					done();
				});
		});
		describe('saved renderer', function () {
			var renderer;
			before(function () {
				renderer = asyncTemplate.render().
					provide('foo',function (ctx, done) {
						done(null, 'bar');
					}).
					provide('hello', function (ctx, done) {
						done(null, 'world');
					});
			});

			it('should correctly render template with foo token', function (done) {

				renderer.template('aaa {{foo}} bbb').
					end(function (err, rendered) {
						expect(rendered).to.equal('aaa bar bbb');
						done();
					});
			});

			it('should correctly render template with foo token', function (done) {

				renderer.template('aaa {{hello}} bbb').
					end(function (err, rendered) {
						expect(rendered).to.equal('aaa world bbb');
						done();
					});
			});
		});


	});


});

