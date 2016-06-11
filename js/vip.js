'use strict';

var vip = {

	/**
	 * Number spaces of a word
	 * @return {integer}
	*/
	numberSpaces: function numberSpaces(string) {
		var count = 0;

		for(var i = 0; i < string.length; i++) {
			if(string.charAt(i) === ' ')  {
				count++;
			}
		}

		return count;
	},

	/**
	 * Number spaces of a word
	 * @return {integer}
	*/
	eventId: function eventId(link) {
		var numberPattern = /\d+/g,
			id = link.match(numberPattern);

		return id;
	},

	/**
	 * transforms the global variable 'invalid' false and returns error message
	 * @return {void}
	*/
	errorMessage: function errorMessage() {
		invalid = true;
	},

	/**
	 * remove the accents of a word
	 * @return {string}
	*/
	removeaccent: function removeaccent(strToReplace) {
		var str_accent = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ",
			str_no_accent = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC",
			newWord = "";

		for (var i = 0; i < strToReplace.length; i++) {
			if (str_accent.indexOf(strToReplace.charAt(i)) != -1) {
				newWord += str_no_accent.substr(str_accent.search(strToReplace.substr(i, 1)), 1);
			} else {
				newWord += strToReplace.substr(i, 1);
			}
		}

		return newWord;
	},

	/**
	 * remove the special caracteres of a word
	 * @return {string}
	*/
	specialCaracteres: function specialCaracteres(text) {
		if(text.length > 0) {
			var length = text.length-1,
				caracteres = ['-', '#', ')', '(', '>', '~', '+', '*', '"', '\\'];

			caracteres.forEach(function(caracter) {
				var newText = text;

				for(var i = 0; i <= length; i++) {
					if(text !== undefined) {
						if(text[i] === caracter || parseInt(text[i])) {
							newText = text.slice(i+1);
						}
					}
				}

				text = newText;
			});

			return text;
		}
	},

	/**
	 * remove the special caracteres of a word
	 * @return {void}
	*/
	titleize: function titleize(text) {
		var words = text.toLowerCase().split(" ");

		for (var a = 0; a < words.length; a++) {
			words[a] = this.specialCaracteres(this.removeaccent(words[a]));
			var w = words[a] || [];
			if(w[0]) {
				words[a] = w[0].toUpperCase() + w.slice(1);
			}
		}

		return words.join(" ");
	},

	/**
	 * algorithm to filter the event wall posts and detect what is a name and what is not
	 * @return {array}
	*/
	filterMessages: function filterMessages(response, eventLong) {
		var that = this,
			nameList = [];

		response.data.forEach(function(data) {
			if(eventLong) {
				var today = new Date(),
				postDate = new Date(data.updated_time);

				if(that.checkDate(today, postDate, 7)) {
					return;
				}
			}
			if(data.message !== undefined && data.type === "status") {
				var split;

				if(data.message.indexOf('\n') > -1 && (data.message.indexOf('\n') <= 30 || data.message.indexOf('↵') <= 30)) {
					split = data.message.split('\n');
				} else {
					split = data.message.split(',');
				}

				split.forEach(function(word) {
					if(that.numberSpaces(word) > 0 && that.numberSpaces(word) <= 4 && word.length <= 30) {
						word = that.titleize(word);
						nameList = nameList.concat(word.trim());
					}
				});
			}
		});

		return nameList.sort();
	},

	/**
	 * get the Access Token of the facebook
	 * @return {string}
	*/
	getAccessToken: function getAccessToken() {
		var url = "https://graph.facebook.com/v2.3/oauth/access_token?client_id=CLIENT_ID&client_secret=CLIENT_SECRET&grant_type=client_credentials&method=get&pretty=0&sdk=joey",
			xmlHttp = new XMLHttpRequest();

		xmlHttp.open("GET", url, false);
		xmlHttp.send(null);

		return JSON.parse(xmlHttp.responseText).access_token;
	},


	dateDifference: function dateDifference(date1, date2) {
		var oneDay = 1000 * 60 * 60 * 24,
				date1Ms = date1.getTime(),
				date2Ms = date2.getTime(),
				differenceMs = Math.abs(date1Ms - date2Ms);

		return Math.round(differenceMs/oneDay)
	},

	checkDate: function checkDate(date1, date2, diff) {
		if(this.dateDifference(date1, date2) >= diff) {
			return true;
		}
	},

	replaceAll: function replaceAll(string, token, newtoken) {
		while (string.indexOf(token) != -1) {
				string = string.replace(token, newtoken);
		}
		return string;
	},

	/**
	 * get the event posts
	 * @return {void}
	*/
	list: function list(event) {
		var that = this,
			access_token = that.getAccessToken(),
			id = this.eventId(event);

		if(!id) {
			this.errorMessage();
			return;
		}

		FB.api(
		"/"+id, {
			access_token: access_token
		},
		function (response) {
				if (response && !response.error) {
					var eventName = that.replaceAll(response.name, ' ', '-'),
						start = new Date(response.start_time),
						end = new Date(response.end_time);

					FB.api(
						id+"/feed", {
							access_token: access_token,
							fields: 'message, type, updated_time',
							limit: 5000
						},
						function (data) {
							if (data && !data.error) {
							  	var list = that.filterMessages(data, that.checkDate(end, start, 15));
								jsPDFEditor.init(list, eventName);
							} else {
								that.errorMessage();
							}
						}
					);
				} else {
					that.errorMessage();
				}
			}
		)
	},

	/**
	 * Starts functions
	 * @return {void}
	*/
	init: function init() {
		var that = this;
		document.body.querySelector('.button-submit').onclick = function(e) {
			e.preventDefault();
			var event = document.getElementById('event').value;
			that.list(event);
		};
	}
}
