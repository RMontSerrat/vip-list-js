var vip = {
	countSpaces: function countSpaces(string) {
		var count = 0;
		for(var i = 0; i < string.length; i++) {
			if(string.charAt(i) === ' ')  {
				count++; 
			}
		}  
		return count;
	},

	eventId: function eventId(link) {
		var numberPattern = /\d+/g,
		id = link.match(numberPattern);
		return id;
	},

	errorMessage: function errorMessage(msg) {
		invalid = true;
	},

	removeAcento: function removeAcento(strToReplace) {
	    str_acento = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
	    str_sem_acento = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";
	    var nova = "";
	    for (var i = 0; i < strToReplace.length; i++) {
	        if (str_acento.indexOf(strToReplace.charAt(i)) != -1) {
	            nova += str_sem_acento.substr(str_acento.search(strToReplace.substr(i, 1)), 1);
	        } else {
	            nova += strToReplace.substr(i, 1);
	        }
	    }
	    return nova;
	},

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

	titleize: function titleize(text) {
	    var words = text.toLowerCase().split(" ");
	    for (var a = 0; a < words.length; a++) {
        	words[a] = this.specialCaracteres(this.removeAcento(words[a]));
	        var w = words[a] || [];
	        if(w[0]) {
		        words[a] = w[0].toUpperCase() + w.slice(1);
	        }

	    }
	    return words.join(" ");
	},

	filterMessages: function filterMessages(response) {
		var self = this,
			array = [];
		response.data.forEach(function(data) {
    		if(data.message !== undefined && data.type === "status") {
	        	var split;
	        	if(data.message.indexOf('\n') > -1 && (data.message.indexOf('\n') <= 30 || data.message.indexOf('↵') <= 30)) {
	        		split = data.message.split('\n');
	        	} else {
	        		split = data.message.split(',');
	        	}
        		split.forEach(function(word) {
		        	if(self.countSpaces(word) > 0 && self.countSpaces(word) <= 4 && word.length <= 30) {
        				word = self.titleize(word);
				        array = array.concat(word.trim());
        			}
        		});
    		}
		});
		return array.sort();
	},

	getAccessToken: function getAccessToken() {
    	var url = "https://graph.facebook.com/v2.3/oauth/access_token?client_id=1553906604861504&client_secret=937e3f0fb78250c0cd69634e84f7d21f&grant_type=client_credentials&method=get&pretty=0&sdk=joey",
	    	xmlHttp = new XMLHttpRequest();

	    xmlHttp.open("GET", url, false);
	    xmlHttp.send(null);

	    return JSON.parse(xmlHttp.responseText).access_token;
	},

    list: function list(event) {
		var self = this,
			access_token = self.getAccessToken(),
			id = this.eventId(event);
        if(!id) {
        	this.errorMessage();
        	return;
        }
	    FB.api(
		    id+"/feed", {
		    	access_token: access_token,
		    	fields: 'message, type',
		    	limit: 5000
		    },
		    function (response) {
		      	if (response && !response.error) {
			        var array = self.filterMessages(response);
					jsPDFEditor.init(array);
				} else {
		        	self.errorMessage();
				}
		    }
		);
	},

    init: function init() {
    	var self = this;
    	document.body.querySelector('.button-submit').onclick = function(e) {
    		e.preventDefault();
    		var event = document.body.querySelector('#event').value;
    		self.list(event);
    	};
    }
}
