//--------------------------------
// TW21Saver (inherits from SaverBase)

function TW21Saver() {}

TW21Saver.prototype = new SaverBase();

TW21Saver.prototype.externalizeTiddler = function(store,tiddler) 
{
	try {
		var extendedAttributes = "";
		var usePre = config.usePreForStorage;
		store.forEachField(tiddler,
			function(tiddler,fieldName,value) {
				// don't store stuff from the temp namespace
				if (!fieldName.match(/^temp\./))
					extendedAttributes += ' %0="%1"'.format([fieldName,value.escapeLineBreaks().htmlEncode()]);
			},true);
		var created = tiddler.created.convertToYYYYMMDDHHMM();
		var modified = tiddler.modified.convertToYYYYMMDDHHMM();
		var attributes = ' modifier="' + tiddler.modifier.htmlEncode() + '"';
		attributes += (usePre && modified == created) ? "" : ' modified="' + modified +'"';
		attributes += ' created="' + created + '"';
		var tags = tiddler.getTags();
		if(!usePre || tags)
			attributes += ' tags="' + tags.htmlEncode() + '"';
		return '<div %0="%1"%2%3>%4</div>'.format([
				usePre ? "title" : "tiddler",
				tiddler.title.htmlEncode(),
				attributes,
				extendedAttributes,
				usePre ? "\n<pre>" + tiddler.text.htmlEncode() + "</pre>\n" : tiddler.escapeLineBreaks().htmlEncode()
			]);
	} catch (ex) {
		throw exceptionText(ex, config.messages.tiddlerSaveError.format([tiddler.title]));
	}
}
