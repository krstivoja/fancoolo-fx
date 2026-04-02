jQuery(function($) {
	// Fallback copy that works on HTTP (no clipboard API needed)
	function copyText(text) {
		var ta = document.createElement('textarea');
		ta.value = text;
		ta.style.position = 'fixed';
		ta.style.opacity = '0';
		document.body.appendChild(ta);
		ta.select();
		document.execCommand('copy');
		document.body.removeChild(ta);
	}

	// Tab switching
	$('.ffx-tab').on('click', function() {
		var tab = $(this).data('tab');
		$('.ffx-tab').removeClass('active');
		$(this).addClass('active');
		$('.ffx-panel').removeClass('active');
		$('.ffx-panel[data-panel="' + tab + '"]').addClass('active');
	});

	// Copy code blocks
	$('.ffx-copy-btn').on('click', function() {
		var btn = $(this);
		var target = $('#' + btn.data('target'));
		copyText(target.text());
		btn.text('Copied!').addClass('copied');
		setTimeout(function() { btn.text('Copy').removeClass('copied'); }, 1500);
	});

	// Copy class on click
	$('[data-copy]').on('click', function() {
		var el = $(this);
		var original = el.text();
		copyText(original);
		el.text('Copied!').addClass('copied');
		setTimeout(function() { el.text(original).removeClass('copied'); }, 1000);
	});

	// Tag Map repeater
	var effectOptions = '<option value="textReveal">Text Reveal</option>'
		+ '<option value="reveal">Reveal</option>'
		+ '<option value="spinReveal">Spin Reveal</option>'
		+ '<option value="bgReveal">BG Reveal</option>'
		+ '<option value="scaleIn">Scale In</option>'
		+ '<option value="fadeIn">Fade In</option>'
		+ '<option value="blurIn">Blur In</option>'
		+ '<option value="clipUp">Clip Up</option>'
		+ '<option value="clipDown">Clip Down</option>'
		+ '<option value="tiltIn">Tilt In</option>';

	function reindexTagMap() {
		$('#ffx-tagmap-rows .ffx-tagmap-row').each(function(i) {
			$(this).find('input').attr('name', 'fancoolo_fx_tag_map[' + i + '][selector]');
			$(this).find('select').attr('name', 'fancoolo_fx_tag_map[' + i + '][effect]');
		});
	}

	$('#ffx-tagmap-add').on('click', function() {
		var i = $('#ffx-tagmap-rows .ffx-tagmap-row').length;
		var row = '<div class="ffx-tagmap-row">'
			+ '<input type="text" name="fancoolo_fx_tag_map[' + i + '][selector]" placeholder="h1,h2,h3">'
			+ '<select name="fancoolo_fx_tag_map[' + i + '][effect]">' + effectOptions + '</select>'
			+ '<button type="button" class="ffx-tagmap-remove" title="Remove">&times;</button>'
			+ '</div>';
		$('#ffx-tagmap-rows').append(row);
	});

	$('#ffx-tagmap-rows').on('click', '.ffx-tagmap-remove', function() {
		$(this).closest('.ffx-tagmap-row').remove();
		reindexTagMap();
	});
});
