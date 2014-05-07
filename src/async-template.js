'use strict';

var eachAsync = require('each-async');

var tokenMatch = /\{{([^{}]*)\}}/g; // select tokens wrapped in double braces. Example: {{token}}

function parseTemplate(template) {

	var matches = template.match(tokenMatch);

	if (!matches) {
		return [];
	}

	// remove brackets
	return matches.map(function (match) {
		return match.replace(/{{|}}/g, '');

	}).
		// remove duplicates and emty
		filter(function (token, index, tokens) {
			return tokens.indexOf(token) == index && token.length > 0;
		});

}


var renderer = {
	provide: function (value, cb) {
		this.providers[value] = cb;
		return this;
	},
	context: function (context) {
		this._context = context;
		return this;
	},
	template: function (template) {
		this._template = template;
		return this;
	},

	end: function (callback) {

		var providers = this.providers;
		var context = this._context;
		var template = this._template;

		if (!template) {
			return callback('Please provide a template.');
		}

		var tokens = parseTemplate(template);

		if (tokens.length === 0) {
			return callback('Could not parse tokens from template "' + template + '".');
		}

		eachAsync(tokens, function (token, index, done) {

			var provider = providers[token];

			if (!provider) {
				return done('Found no provider for token "' + token + '".');
			}

			provider(context, function (err, value) {
				if (!err) {
					template = template.replace(new RegExp('{{' + token + '}}', 'g'), value);
				}
				// force async
				setTimeout(function () {
					done(err);
				}, 0);

			});

		}, function (err) {
			callback(err, template);
		});

	}


};

exports.render = function (template) {
	var obj = Object.create(renderer);
	obj.providers = {};
	obj._template = template;
	return obj;
};
