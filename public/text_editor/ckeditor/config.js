/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.fillEmptyBlocks = false;
	config.autoParagraph = false;
	config.tabSpaces = 0;
	basicEntities: false;
	config.extraPlugins = 'wordcount';
	config.enterMode = CKEDITOR.ENTER_BR;
//	config.extraPlugins = 'sourcedialog';
//	config.width = '75%';
	config.wordcount = {

	    // Whether or not you want to show the Word Count
	    showWordCount: true,

	    // Whether or not you want to show the Char Count
	    showCharCount: true,

	    // Whether or not to include Html chars in the Char Count
	    countHTML: false
	};
	config.toolbar = 'MyToolbar';
	 
	config.toolbar_MyToolbar =
	[
	];
};
//CKEDITOR.on('MyToolbar', function (ev) {
//    ev.editor.dataProcessor.writer.setRules('br',
//     {
//         indent: false,
//         breakBeforeOpen: false,
//         breakAfterOpen: false,
//         breakBeforeClose: false,
//         breakAfterClose: false
//     });
//});
//
//config.enterMode = CKEDITOR.ENTER_BR;
//config.shiftEnterMode = CKEDITOR.ENTER_BR;
