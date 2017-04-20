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
			if(data.message !== undefined) {
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
        var url = "https://graph.facebook.com/v2.8/oauth/access_token?client_id=410943725904366&client_secret=77b003970fb4af218ae66222a1314520&grant_type=client_credentials&method=get&pretty=0&sdk=joey",
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
                        id+"/feed",
                        "GET",
                        {
                            "access_token": 'EAAF1wErOIe4BAJLjRTmy8xBjM41hXZAyShVmJp2sLNG3ZBXkrVnZApQ4y8vjKZCrpSAcsAy1TB8QDYYK1PsP02PN8ONMo3x8KHuivyy0Bnn1f1XGnkBylcocPSChoh5aJQrOZB96TecBsavbamsaN6sLHBPyZCAUZCQ89K2KzqnK2taM1Ce841IhZAXMTia4v5sZD',
                            "message": "This is a test message"
                        },
						function (data) {
							data = {"data":[{"message":"LISTA ENCERRADA!!!!!!!","updated_time":"2017-04-14T00:04:51+0000","id":"392419864477436_393840117668744"},{"message":"Artur Brayner","updated_time":"2017-04-13T23:43:22+0000","id":"392419864477436_393835471002542"},{"message":"Julia Fernandes \nJo\u00e3o Victor Muniz","updated_time":"2017-04-13T23:19:16+0000","id":"392419864477436_393829101003179"},{"message":"Igor Fernandes","updated_time":"2017-04-13T23:07:03+0000","id":"392419864477436_393825887670167"},{"message":"Andrews Fourny","updated_time":"2017-04-13T23:06:39+0000","id":"392419864477436_393825811003508"},{"message":"Diogo Barbosa","updated_time":"2017-04-13T22:54:07+0000","id":"392419864477436_393823157670440"},{"message":"Luiz Viana \nIgor dias \nChristian guilherme \nJardel silva","updated_time":"2017-04-13T22:40:44+0000","id":"392419864477436_393819271004162"},{"message":"Yasmin Chaves","updated_time":"2017-04-13T22:38:11+0000","id":"392419864477436_393818624337560"},{"message":"Victor Macedo (aniversariante)\nBreno Gomes","updated_time":"2017-04-13T22:27:28+0000","id":"392419864477436_393815364337886"},{"message":"Ingrid Bendas","updated_time":"2017-04-13T22:18:11+0000","id":"392419864477436_393813447671411"},{"message":"BRUNA SILVA","updated_time":"2017-04-13T22:12:30+0000","id":"392419864477436_393812461004843"},{"message":"Bruna Silva","updated_time":"2017-04-13T22:12:18+0000","id":"392419864477436_393812401004849"},{"message":"Petrus Pacheco","updated_time":"2017-04-13T21:38:54+0000","id":"392419864477436_393802884339134"},{"message":"Carla Cristina Dos Santos De Canena\nRenata Simao","updated_time":"2017-04-13T21:37:15+0000","id":"392419864477436_393802561005833"},{"message":"Yann Abreu","updated_time":"2017-04-13T21:25:45+0000","id":"392419864477436_393799644339458"},{"message":"Pedro cortezia\nFelipe Moraes \nRick Salom\u00e3o","updated_time":"2017-04-13T21:19:18+0000","id":"392419864477436_393798137672942"},{"message":"Gabriel Resende","updated_time":"2017-04-13T21:17:44+0000","id":"392419864477436_393797807672975"},{"message":"Marcelo Martins\nCaio Eduardo\nMatheus do vale","updated_time":"2017-04-13T21:14:21+0000","id":"392419864477436_393797077673048"},{"message":"Giovana tomelin","updated_time":"2017-04-13T21:13:30+0000","id":"392419864477436_393796861006403"},{"message":"Leonardo lima","updated_time":"2017-04-13T21:12:23+0000","id":"392419864477436_393796564339766"},{"message":"Karen Gomes","updated_time":"2017-04-13T21:05:49+0000","id":"392419864477436_393794564339966"},{"message":"Marcos Paulo \nLarissa Munis \nCaroline Fernandes \nGabriel Nunes","updated_time":"2017-04-13T21:02:55+0000","id":"392419864477436_393793854340037"},{"message":"Franklin oliveira","updated_time":"2017-04-13T21:02:06+0000","id":"392419864477436_393793697673386"},{"message":"Rodrigo navarro (aniversariante 11\/04)\nBeatriz martins \nLaiz quaresma \nGabriel ruy\nBreno john \nDavid Duarte \nLucas Belcastro \nLeticia Moreira \nPedro Henrique \nGabriel freitas","updated_time":"2017-04-13T20:57:11+0000","id":"392419864477436_393792234340199"},{"message":"Rafael Nunes","updated_time":"2017-04-13T20:55:37+0000","id":"392419864477436_393791537673602"},{"message":"Romulo Mont Serrat\nRamon Ferreira\nThiago Alves\nIgor Duarte","updated_time":"2017-04-13T20:51:18+0000","id":"392419864477436_393790571007032"},{"message":"Lucas Diniz","updated_time":"2017-04-13T20:45:35+0000","id":"392419864477436_393789007673855"},{"message":"Stefany Loureiro\nGabriel Freire\nMarcella Gouvea\nIsabella Lima","updated_time":"2017-04-13T20:43:34+0000","id":"392419864477436_393788457673910"},{"message":"Bruno C\u00e2mara","updated_time":"2017-04-13T20:31:05+0000","id":"392419864477436_393784794340943"},{"message":"Matheus Cassiano","updated_time":"2017-04-13T20:19:15+0000","id":"392419864477436_393775524341870"},{"message":"Mariana Paix\u00e3o \nDaniela Teixera","updated_time":"2017-04-13T20:07:58+0000","id":"392419864477436_393760587676697"},{"message":"Ana Luiza Lopes\nCamila Bibiano","updated_time":"2017-04-13T20:02:45+0000","id":"392419864477436_393758691010220"},{"message":"Lorena Souza\nKayo Pinheiro","updated_time":"2017-04-13T19:54:31+0000","id":"392419864477436_393756601010429"},{"message":"Andrhessa Armada","updated_time":"2017-04-13T19:47:41+0000","id":"392419864477436_393754171010672"},{"message":"Kayo Fernandes \nLucas postigo\nPhelippe vergara\nJoao pedro pontes\nMichael Garcia \nFelipe Matarazzo","updated_time":"2017-04-13T19:39:55+0000","id":"392419864477436_393752221010867"},{"message":"Gabriel Gesteira","updated_time":"2017-04-13T18:58:13+0000","id":"392419864477436_393733677679388"},{"message":"Renan dornelles \nTayn\u00e1 dos santos\nKianny Ribeiro","updated_time":"2017-04-13T18:44:03+0000","id":"392419864477436_393729094346513"},{"message":"T\u00c1 CHEGANDO A HORA GALERA!!!!!","updated_time":"2017-04-13T18:36:48+0000","id":"392419864477436_393726774346745"},{"message":"Bruna Ribeiro","updated_time":"2017-04-13T18:20:53+0000","id":"392419864477436_393722044347218"},{"message":"Vitor Alexandre","updated_time":"2017-04-13T18:18:48+0000","id":"392419864477436_393721401013949"},{"message":"Vinicius Franklin\nLeonardo Ferreira","updated_time":"2017-04-13T18:13:36+0000","id":"392419864477436_393716224347800"},{"message":"Pedro Coutinho \nRodrigo Gomes","updated_time":"2017-04-13T17:58:42+0000","id":"392419864477436_393711461014943"},{"message":"Thamara Lopes \nAlexandra Menezes","updated_time":"2017-04-13T17:35:16+0000","id":"392419864477436_393700264349396"},{"message":"Mariana Marques\nCamila Teixeira","updated_time":"2017-04-13T17:25:43+0000","id":"392419864477436_393697184349704"},{"message":"Jennefer Braga\nThayna Soares\nBeatriz Oliveira","updated_time":"2017-04-13T17:21:08+0000","id":"392419864477436_393695871016502"},{"message":"Izabella neves\nJessica Fernandes\nYuri moura\nVinicius Muniz\nThallis dias\nEduardo Vogel \nGabrielly Sim\u00f5es","updated_time":"2017-04-13T17:09:23+0000","id":"392419864477436_393691167683639"},{"message":"Tha\u00eds Fernanda \nD\u00e9bora Freitas \nJessica Daiana","updated_time":"2017-04-13T16:59:25+0000","id":"392419864477436_393684811017608"},{"message":"Ursula Mattos","updated_time":"2017-04-13T16:54:30+0000","id":"392419864477436_393682877684468"},{"message":"Alice Baldi\nPatrick Fran\u00e7a","updated_time":"2017-04-13T16:30:43+0000","id":"392419864477436_393672917685464"},{"message":"Marcos Vinicius Freitas","updated_time":"2017-04-13T15:59:39+0000","id":"392419864477436_393661644353258"},{"message":"Leticia dos santos","updated_time":"2017-04-13T15:38:15+0000","id":"392419864477436_393648957687860"},{"message":"Ana Carolina Simplicio \nNathalia castro","updated_time":"2017-04-13T15:35:24+0000","id":"392419864477436_393647691021320"},{"message":"Alexandre Bertin","updated_time":"2017-04-13T15:30:20+0000","id":"392419864477436_393645361021553"},{"message":"Larissa faria (aniversariante)\nKarina gomes \nHugo Bragan\u00e7a \nMatheus Lopes","updated_time":"2017-04-13T15:23:25+0000","id":"392419864477436_393642127688543"},{"message":"Jo\u00e3o Dantas (aniversariante)\nPedro augusto\nRafael meirelles\nRafael magalhaes\nGustavo souza\nThiago serpa\nCaio teixeira\nCaio simoes\nGuilherme mello\nJonathan gon\u00e7alves\nCayo soares\nJorge sampaio\nLucas sobrinho\nMilton leao\nBeatriz figueiredo\nRaissa lopes\nDeborah mazolli\nBrenda santiago\nCleo serpa\nEric antonucci\nRafaella chiodo\nBeatriz scoralick\nJulliana dantas\nJuliano nascimento\nEmanuelle ara\u00fajo\nThais risso\nThayna garavello\nGabriel werneck\nOswaldo junior\nGustavo souza","updated_time":"2017-04-13T15:20:40+0000","id":"392419864477436_393641231021966"},{"message":"Renan Simplicio \nThiago Filemon\nCaio Rodrigues \nVictor bastos","updated_time":"2017-04-13T15:04:36+0000","id":"392419864477436_393630527689703"},{"message":"Vinicius Coutinho","updated_time":"2017-04-13T14:52:22+0000","id":"392419864477436_393625431023546"},{"message":"Fernanda Galdino","updated_time":"2017-04-13T12:59:59+0000","id":"392419864477436_393569547695801"},{"message":"Lucas Martins \nGabriel Rodrigues \nIsabele Costa","updated_time":"2017-04-13T12:52:56+0000","id":"392419864477436_393566994362723"},{"message":"Olha ai Joyce Cerqueira","updated_time":"2017-04-13T12:35:41+0000","id":"392419864477436_393560887696667"},{"message":"Lucas Monte \nPhylipe Sabino","updated_time":"2017-04-13T12:34:46+0000","id":"392419864477436_393560671030022"},{"message":"Alexsander Paes \nMarcelo Lacerda","updated_time":"2017-04-13T11:51:14+0000","id":"392419864477436_393544114365011"},{"message":"Olha Raphael Diniz vai ter Renan da Penha hahahhahahaha..\nVamoss?? \ud83d\ude02\ud83d\ude02\ud83d\ude02\ud83d\ude02\ud83d\ude02\ud83d\ude02","updated_time":"2017-04-13T10:50:44+0000","id":"392419864477436_393515657701190"},{"message":"Rebeca Cami\u00f1a \nSuellem Bassil","updated_time":"2017-04-13T02:52:26+0000","id":"392419864477436_393337624385660"},{"message":"Lara Morgado\nLuiz Carlos Junior\nGabriela Martins\nIsabela Martins\nIzabel Senna","updated_time":"2017-04-13T02:49:31+0000","id":"392419864477436_393336807719075"},{"message":"Gabriela Falda","updated_time":"2017-04-13T01:59:06+0000","id":"392419864477436_393320824387340"},{"message":"Rafaella Almeida \nJuliana Duarte \nSabrina Marinho","updated_time":"2017-04-13T01:48:42+0000","id":"392419864477436_393316851054404"},{"message":"Carolina Gagliasso\nDimas Velloso","updated_time":"2017-04-13T01:12:52+0000","id":"392419864477436_393301411055948"},{"message":"Clara Rianelli","updated_time":"2017-04-13T01:11:26+0000","id":"392419864477436_393301071055982"},{"message":"Rafaella Fran\u00e7ois\nLeonardo Ara\u00fajo\nIngrid Bendas","updated_time":"2017-04-13T01:01:42+0000","id":"392419864477436_393294541056635"},{"message":"Luana Frizzera","updated_time":"2017-04-13T01:01:02+0000","id":"392419864477436_393294304389992"},{"message":"Maria Eduarda vieira","updated_time":"2017-04-13T00:18:40+0000","id":"392419864477436_393279491058140"},{"message":"Karen Barreto\nAriel Firmino\nYaromaia Bispo\nLeticia Martins\nLarissa Costa\nMylena Bispo\nDandara Bispo\nAl\u00ea Rodrigues\nMilton Menga","updated_time":"2017-04-12T23:49:31+0000","id":"392419864477436_393270047725751"},{"message":"Juliana Franco\nLaryssa araujo","updated_time":"2017-04-12T23:33:06+0000","id":"392419864477436_393264531059636"},{"message":"Lu\u00edsa Dantas (aniversariante)\nGuilherme martinelli \nCamila Ferraz\nLuiz Ant\u00f3nio \nIsabel Andrade \nCaiane melo\nJo\u00e3o Victor Silva \nKevin Vasconcelos \nAna Carolina marinho  \nBruno dur\u00e3o \nVictoria martinelli \nMatheus Viana \nYollana nakamura \n Mauro lins \nLaura oliveira\nWendel ferreira \nJo\u00e3o Pedro Coutinho \nMatheus Siqueira\nMatheus Alves \nRicardo manna \nLucas dur\u00e3o \nMilena sarte \nWallace costa\nAndr\u00e9 Cesar \nLuana Viegas\nLucas Alexandria\nGabriel Martins \nAdilson mota\nJeferson torres \nJonathan ribeiro \nRafael Escobar\nLeon Valente","updated_time":"2017-04-12T23:29:27+0000","id":"392419864477436_393250884394334"},{"message":"Giovanna Ramos","updated_time":"2017-04-12T23:27:01+0000","id":"392419864477436_393246277728128"},{"message":"Gabriela Scher \nRuan Barreto \nLuciani Nascimento \nIsabela Pires","updated_time":"2017-04-12T22:47:04+0000","id":"392419864477436_393234447729311"},{"message":"Michelle oliveira \nSuzana soares","updated_time":"2017-04-12T21:37:47+0000","id":"392419864477436_393190091067080"},{"message":"Nath\u00e1lia Falc\u00e3o\nPriscilla Garcia\nNath\u00e1lia Carvalho\nVick Ricciardi\nLeticia Guimar\u00e3es\nAnna Carolina","updated_time":"2017-04-12T21:34:58+0000","id":"392419864477436_393189144400508"},{"message":"Marcelle Amaral \nStefany Amaral \nIsabella Belmonte \nBeatriz Miranda \nAna Caroline nocito \nRachel Moreira \nIsabel Andrade \nLuiz antonio","updated_time":"2017-04-12T21:19:48+0000","id":"392419864477436_393184024401020"},{"message":"Arian Gouvea","updated_time":"2017-04-12T21:00:48+0000","id":"392419864477436_393166147736141"},{"message":"Carolinne Corr\u00eaa\nCaroline Stefannie \nVictoria Garcia\nKarine Kelly\nMilena Benevides\nLet\u00edcia Barboza \nMarcella Marques\nLuisa Cunha \nJulia Rohnelt","updated_time":"2017-04-12T21:00:07+0000","id":"392419864477436_393165671069522"},{"message":"Thayn\u00e1 Fernandes (Aniversariante)\nJ\u00falia Lopes \nRayssa Nunes\nJuliana Nascimento\nMarianna Carvalhosa \nJuliana Falc\u00e3o \nSamara Rayane \nThain\u00e1 Sanches \nJo\u00e3o Vasconcelos \nDayana Souza \nAllan Henrique \nLais Reis \nPamella Nunes \nPedro Lopes\nLouhram Carvalho \nDaniel Cassiano \nLucas Batista \nJo\u00e3o Victor Carvalho \nJardison Augusto \nGuilherme Neves \nLuis Fernando \nLu\u00eds Felipe Baptista\nRonald Rodrigues","updated_time":"2017-04-12T20:18:37+0000","id":"392419864477436_393129274406495"},{"message":"Leticia silvestre\nMarianna trovejani \nJulia Devellard \nBreno john \nLucas zanardi","updated_time":"2017-04-12T18:41:11+0000","id":"392419864477436_393101184409304"},{"message":"Guilherme Almada","updated_time":"2017-04-12T18:26:39+0000","id":"392419864477436_393093797743376"},{"message":"Victor Barcellos\nAnderson Ibraim\nMatheus Mello\nPedro Marques\nAlberto Zarife\nDaniel Gontijo\nRenan Nascimento\nRenan Ribeiro\nRodrigo Nestor\nDavid Velloso\nJohn Fabio\nT\u00e1keo Bastos\nQUE CILADA BINO!!!!!!!","updated_time":"2017-04-12T18:21:26+0000","id":"392419864477436_393091897743566"},{"message":"Leandro Fernandes","updated_time":"2017-04-12T18:18:58+0000","id":"392419864477436_393090667743689"},{"message":"Daniel DL","updated_time":"2017-04-12T18:18:27+0000","id":"392419864477436_393090517743704"},{"message":"Luciana Lira\nFabiana Lira\nCaroline Moraes\nThaiane Amaral\nIngrid Souza\nAna Lucia","updated_time":"2017-04-12T17:55:05+0000","id":"392419864477436_393079524411470"},{"message":"Taisa torres \nFernanda Xavier\nGiovanna Morcillo\nThayana Ribeiro \nGiulia Morcillo \nMario Santanna \nMarcos cunha\nLucas percine\nLeonardo feitosa","updated_time":"2017-04-12T17:54:24+0000","id":"392419864477436_393079361078153"},{"message":"Victor Souza","updated_time":"2017-04-12T17:48:35+0000","id":"392419864477436_393076647745091"},{"message":"Rafael braga \nWando Rodrigues \nIgor gorces","updated_time":"2017-04-12T17:48:13+0000","id":"392419864477436_393076541078435"},{"message":"Mariana felix \nCaio braga\nJulia Faber\nMaria Clara gomes \nBruna Souza","updated_time":"2017-04-12T17:44:09+0000","id":"392419864477436_393075471078542"},{"message":"Marcela Moreira\nIsabelle Lopes\nJamille Machado\nMariana Souza\nSatye Sampaio","updated_time":"2017-04-12T17:16:23+0000","id":"392419864477436_393058827746873"},{"message":"Ta\u00eds Santos","updated_time":"2017-04-12T12:44:09+0000","id":"392419864477436_392948787757877"},{"message":"Amanda Amorim\nYulli Sp\u00ednola\nSuzana Alexandrino","updated_time":"2017-04-12T12:07:41+0000","id":"392419864477436_392927781093311"},{"message":"Catarina Oliveira ( aniversariante)\n\nBarbara Moura\nBrenda Vasconcelos\nIsabelle Guimar\u00e3es\nMariana orlandini\nRaiany alencar\nJhon F\u00e1bio\nMarcelle Guimar\u00e3es\nDaniel atayde\nJonathan Almeida\nYdrish tanzakya\nDaniel Goulart \nLarissa tribiane\nRodrigo Nestor\nTha\u00eds Rodrigues\nAlan coelho\nEllen J\u00falia\nAlexandre Medeiros\nVitor Hip\u00f3lito\nLucas dos santos\nRayza vit\u00f3ria\nTakeo bastos \nRafael Fernandes\nAna rosa marquezine\nPedro Henrique \nLeandro Fernandes\nP\u00e2mela durso\nLidia pinheiro \nDanilo Barreto \nLena orlandini \nTha\u00eds lobianco\nLeticia lima\nSuelen oliveira \nYasmin arao\nSara lopis\nEstef\u00e2ni Nunes\nAllana Nakamura\nAlana castro \nLet\u00edcia Fran\u00e7a\nJonatas Ferreira\nCaroline julio\nBruno costa \nSoane oliveira \nSheila Ferreira \nVanessa Seixas\nThaina Emmanuel\nGabriela nogueira\nKarlline carvalho \nDouglas nascimento\nVit\u00f3ria Azeredo\nMichel Tavares\nMarlon Albuquerque\nThati santos\nBrandon Barcellos\nLorrana maio \nLucao\nDaniel pinheiro\nRafael torres\nIanca policanti\nCamila Silva\nMariana Mattos\nGustava Dantas \nLuana azevedo\nVictor barbatto\nCamila fiuza\nGeanny matos\nThaisa Fernandes\nF\u00e1bio Daniel\nLucas palomo\nCristal rosa\nLaura Fran\u00e7a\nJo\u00e3o Maciel\nLet\u00edcia de Paula \nAne Beatriz Alves\nAna Paula \nRebecca Marques\nRaphael machado \nMichel Tavares\nIgor C\u00e9sar\nGlaceli ribeiro \nCamila Martins\nTha\u00eds morais\nNathane Ximenes\nAlana nakamura\nMatheus Mello\nPedro Marques","updated_time":"2017-04-12T04:24:33+0000","id":"392419864477436_392687187784037"},{"message":"Renata Silva\nNath\u00e1lia Falc\u00e3o\nFlavia Morais\nChristian Alves","updated_time":"2017-04-12T04:16:04+0000","id":"392419864477436_392685414450881"},{"message":"Rayane Menezes","updated_time":"2017-04-12T03:31:31+0000","id":"392419864477436_392674374451985"},{"message":"Matheus Braz - aniversariante \n\nFelipe Bartkevihi\nFabio Bartkevihi\nBianca Martins\nCarolina Paiva\nCaroline Oliveira\nLarissa Martins\nDaniella Malheiro\nHugo Bartkevihii\nAna Carolina F\u00e9lix \nJade Oliveira \nLarha Rueger\nJulia Cavalcante \nVinicius Sim\u00f5es \nJoao Vinicius\nNath\u00e1lia Pacheco\nPaula Helena \nRafaela Lacerda\nClara Guedes\nAna Clara Casagrande\nEmanuelle Azevedo\nViviane Oliveira \nAlexandre Bartkevihi\nNatalia Nobre \nThaina Souto\nLuana Simoni","updated_time":"2017-04-12T03:23:10+0000","id":"392419864477436_392672391118850"},{"message":"Manoela Cahet\nKallina Seravat\nKamilla Ribeiro\nQueren Hapuque","updated_time":"2017-04-12T02:54:37+0000","id":"392419864477436_392664611119628"},{"message":"Vinicius sim\u00f5es","updated_time":"2017-04-12T02:36:35+0000","id":"392419864477436_392659797786776"},{"message":"divirtam se com cuidado!!\nBeber com modera\u00e7\u00e3o.boa \nDivers\u00e3o beijos!","updated_time":"2017-04-12T02:30:37+0000","id":"392419864477436_392658377786918"},{"message":"Mariana Cardoso\nCaio Cesar\nLeonardo Andrade \nMatheus Bastos \nVanessa Oliveira \nLeticia Maria \nAdriano Gomes","updated_time":"2017-04-12T02:20:37+0000","id":"392419864477436_392655767787179"},{"message":"Pedro Cavalcanti","updated_time":"2017-04-12T01:00:36+0000","id":"392419864477436_392633164456106"},{"message":"Beatriz Favrat","updated_time":"2017-04-12T00:32:26+0000","id":"392419864477436_392618584457564"},{"message":"Daniele Peclat \nCarolina Rodrigues\nStefani Moraes","updated_time":"2017-04-12T00:31:16+0000","id":"392419864477436_392616844457738"},{"message":"Gabriela Barros\nLeonardo vieira \nThamires Portilho","updated_time":"2017-04-12T00:29:13+0000","id":"392419864477436_392615577791198"},{"message":"Marco Ant\u00f4nio Azevedo","updated_time":"2017-04-11T22:40:32+0000","id":"392419864477436_392587237794032"},{"message":"Rafaela Lacerda","updated_time":"2017-04-11T20:59:45+0000","id":"392419864477436_392555131130576"},{"message":"Carolina paiva \nMayara Benini\nMarina lima \nPaula helena \nJulia Rodrigues","updated_time":"2017-04-11T20:54:35+0000","id":"392419864477436_392553841130705"},{"message":"Amanda Barros\nTiago Azeredo","updated_time":"2017-04-11T20:27:45+0000","id":"392419864477436_392546147798141"},{"message":"Vou dar uma passadinha. Moro perto. Obg pelo convite Alice Baldi. \ud83d\ude18","updated_time":"2017-04-11T20:24:52+0000","id":"392419864477436_392545397798216"},{"message":"Michael Feliciano\nDouglas Soares\nLucas Henrique\nRodrigo Machado\nArthur Maltez\nLucas Pereira","updated_time":"2017-04-11T20:24:43+0000","id":"392419864477436_392545347798221"},{"message":"Andr\u00e9a Theodoro\nThais Moura\nJuliana Vieira","updated_time":"2017-04-11T20:23:22+0000","id":"392419864477436_392544817798274"},{"message":"Luana Freitas\nAmanda Pereira \nBeatriz de Andr\u00e9\nAlessandra Batista\nNathalia Pires\nAmandinha Freitas","updated_time":"2017-04-11T20:23:04+0000","id":"392419864477436_392544734464949"},{"message":"Diego Loureiro\nIrwen Pereira\nRicardo Volponi\nLucas Andrade","updated_time":"2017-04-11T20:22:31+0000","id":"392419864477436_392544491131640"},{"message":"Thiago Barata","updated_time":"2017-04-11T20:22:26+0000","id":"392419864477436_392544454464977"},{"message":"Felipe Molinero","updated_time":"2017-04-11T20:21:33+0000","id":"392419864477436_392544134465009"},{"message":"Victor Barcellos \nWilliam Ventapane\nNeymar jr \nPhilipe Coutinho \nDaniel Alves","updated_time":"2017-04-11T20:21:25+0000","id":"392419864477436_392544104465012"},{"message":"Vitor Hyppolito\nJava Machado\nDanilo Barreto\nFelipe Mike Barreto","updated_time":"2017-04-11T20:21:15+0000","id":"392419864477436_392544034465019"},{"message":"Vit\u00f3ria Azeredo\nDaniella Malheiro\nCaroline Oliveira\nLarissa Martins\nEmanuelle Conrado","updated_time":"2017-04-11T20:20:06+0000","id":"392419864477436_392543697798386"},{"message":"Gabrielly Gonzaga\nLarissa Tribbiane\nVanessa Oliveira","updated_time":"2017-04-11T20:17:00+0000","id":"392419864477436_392542884465134"},{"message":"Rebecca Marques\nB\u00e1rbara Rodrigues\nPaulinha Campbell\nB\u00e1rbara Moura\nMariana Orlandini\nCarine Monique Miranda\nCaroline Soares\nTata Vasconcelos","updated_time":"2017-04-11T20:16:23+0000","id":"392419864477436_392542811131808"},{"message":"Paulo victor ferreira \nVictor lemos","updated_time":"2017-04-11T20:07:01+0000","id":"392419864477436_392540351132054"},{"message":"N\u00e3o tem como n\u00e3o ir!","updated_time":"2017-04-11T20:05:44+0000","id":"392419864477436_392431684476254"},{"message":"Yulli Sp\u00ednola e Suzana Alexandrino","updated_time":"2017-04-11T20:05:39+0000","id":"392419864477436_392508357801920"},{"message":"Anderson Freire\nAaron Dourado\nRicardo Almeida \nLa\u00edsa Bittencourt\nGabriel Freire\nGuilherme Mazioli","updated_time":"2017-04-11T20:05:36+0000","id":"392419864477436_392513684468054"}],"paging":{"previous":"https:\/\/graph.facebook.com\/v2.8\/392419864477436\/feed?limit=5000&format=json&since=1492128291&access_token=EAAF1wErOIe4BAJLjRTmy8xBjM41hXZAyShVmJp2sLNG3ZBXkrVnZApQ4y8vjKZCrpSAcsAy1TB8QDYYK1PsP02PN8ONMo3x8KHuivyy0Bnn1f1XGnkBylcocPSChoh5aJQrOZB96TecBsavbamsaN6sLHBPyZCAUZCQ89K2KzqnK2taM1Ce841IhZAXMTia4v5sZD&__paging_token=enc_AdDPwaeO6ZACQPXUB4jsOa3TBurgljgggfUhyd9333agReqARS6c0MZCuWnAQsFtuTNzNAfefIaWFye6ojn7iB6h9HLvcDvMuQqYUajSPct8b9TAZDZD&__previous=1","next":"https:\/\/graph.facebook.com\/v2.8\/392419864477436\/feed?limit=5000&format=json&access_token=EAAF1wErOIe4BAJLjRTmy8xBjM41hXZAyShVmJp2sLNG3ZBXkrVnZApQ4y8vjKZCrpSAcsAy1TB8QDYYK1PsP02PN8ONMo3x8KHuivyy0Bnn1f1XGnkBylcocPSChoh5aJQrOZB96TecBsavbamsaN6sLHBPyZCAUZCQ89K2KzqnK2taM1Ce841IhZAXMTia4v5sZD&until=1491941136&__paging_token=enc_AdAsNsKZC0ZBqDp5vvIEg7NDZAZBWEg5vsGZCSa4wq9U2FTzZAmvT5sjCU8fYK7NETCvZBZBZCVIFKl4oejTzYHMvZBWiTm0ljSykZAFgwXCun3tS53GhIcEQZDZD"},"__debug__":{}}
							if (data && !data.error) {
								console.log(data["data"]);
							  	var list = that.filterMessages(data, that.checkDate(end, start, 15));
							  	console.log('list', list)
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
