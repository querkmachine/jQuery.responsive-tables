/*
 * jQuery Responsive Tables 1.0.0
 *
 * Developed by Kimberly Grey
 * https://github.com/querkmachine
 *
 * Based on the one built by Zurb
 * https://github.com/zurb/responsive-tables
 *
 * Licensed under the MIT licence:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 */
;(function($, window, document, undefined) {
	'use strict';
	const pluginName = 'responsiveTable';
	const defaults = {
		maxWidth: 768,
		classes: {
			wrapper: 'table-container',
			pinned: 'pinned',
			scrollable: 'scrollable'
		}
	};
	function Plugin(element, options) {
		this.$element = $(element);
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this._id = `${pluginName}-${Math.random().toString(36).substring(6)}`;
		if(typeof this.$element.data(`${pluginName}-init`) !== 'undefined') {
			return;
		};
		this.switched = false;
		this.callbacks = [];
		this.init();
	};
	$.extend(Plugin.prototype, {
		init: function() {
			this.$element.data(`${this._name}-init`, true);
			this.bindEvents();
		},
		bindEvents: function() {
			$(window).on('load resize', () => {
				this.updateTables();
			});
			$(window).on('redraw', () => {
				this.switched = false;
				this.updateTables();
			});
		},
		updateTables: function() {
			if($(window).width() < this.settings.maxWidth && !this.switched) {
				this.switched = true;
				this.splitTable(this.$element);
				return true;
			}
			else if ($(window).width() >= this.settings.maxWidth && this.switched) {
				this.switched = false;
				this.unsplitTable(this.$element);
			}
		},
		splitTable: function($original) {
			const $copy = $original.clone();
			$original.wrap($('<div/>', {
				'class': this.settings.classes.wrapper
			}));
			$copy.find('td:not(:first-child), th:not(:first-child)').css('display', 'none');
			$original.closest(`.${this.settings.classes.wrapper}`).append($copy);
			$copy.wrap($('<div/>', {
				'class': this.settings.classes.pinned
			}));
			$original.wrap($('<div/>', {
				'class': this.settings.classes.scrollable
			}));
			this.setCellHeights($original, $copy);
		},
		unsplitTable: function($original) {
			$original.closest(`.${this.settings.classes.wrapper}`).find(`.${this.settings.classes.pinned}`).remove();
			$original.unwrap().unwrap();
		},
		setCellHeights: function($original, $copy) {
			const $tr = $original.find('tr');
			const $trCopy = $copy.find('tr');
			let heights = [];
			$tr.each((i, row) => {
				const $tx = $(row).find('th, td')
				$tx.each((j, cell) => {
					const height = $(cell).height();
					heights[i] = heights[i] || 0;
					if(height > heights[i]) {
						heights[i] = height;
					}
				});
			});
			$trCopy.each((i, row) => {
				$(row).height(heights[i]);
			});
		}
	});
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if(!$.data(this, `plugin_${pluginName}`)) {
				$.data(this, `plugin_${pluginName}`, new Plugin(this, options));
			};
		});
	};
})(jQuery, window, document);