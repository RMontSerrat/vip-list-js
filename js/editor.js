/**
 * jsPDFEditor
 * @return {[type]} [description]
 */
var jsPDFEditor = {

	editor: {},

	aceEditor: function aceEditor() {
		editor = ace.edit("editor");
		editor.setTheme("ace/theme/github");
		editor.getSession().setMode("ace/mode/javascript");
		editor.getSession().setUseWorker(false); // prevent "SecurityError: DOM Exception 18"
	},

	pdf: function pdf(array) {
		var source = "var doc = new jsPDF(); doc.setFontSize(10);\n",
			x = 10,
			y = 10;
		for(var i = 0; i <= array.length; i++) {
			if(array[i]) {
				if(y%290 == 0) {
					source += "doc.addPage();\n";
					y = 10;
				}
				source += "doc.text("+x+","+y+",\""+array[i]+"\");\n";
				y = y + 5;
			}
		}
		editor.setValue(source);
		editor.gotoLine(0);
	},

	initDownloadPDF: function initDownloadPDF() {
		progress = 1;
		eval('try{' + editor.getValue() + '} catch(e) { console.error(e.message,e.stack,e); }'); 

		var file = 'demo';
		if (typeof doc !== 'undefined') {
			doc.save(file + '.pdf');
		} else if (typeof pdf !== 'undefined') {
			setTimeout(function() {
				pdf.save(file + '.pdf');
			}, 2000);
		} else {
			alert('Error 0xE001BADF');
		}
		return false;
	},

	/**
	 * Start the editor demo
	 * @return {void}
	 */
	init: function init(array) {

		// Init the ACE editor
		this.aceEditor();

		this.pdf(array);
		// Do the first update on init

		this.initDownloadPDF();
	}
};