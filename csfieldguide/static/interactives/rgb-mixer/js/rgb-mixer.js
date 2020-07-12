// Adapted from http://refreshless.com/nouislider/examples/#section-colorpicker

var urlParameters = require('../../../js/third-party/url-parameters.js')
const noUiSlider = require('nouislider');
var useHex = false;

const sFormat = {
  to: function (value) {
    if (useHex) {
      return decimalToHex(Math.round(value));
    }
    return Math.round(value);
  },
  from: function (value) {
    return Math.round(Number(value));
  }
};

RGB_Mixer = {};

RGB_Mixer.minimum = 0
RGB_Mixer.maximum = 255

RGB_Mixer.sliders = document.getElementsByClassName('interactive-rgb-mixer-slider');
RGB_Mixer.result = document.getElementById('interactive-rgb-mixer-result');

$(document).ready(function () {
  useHex = (urlParameters.getUrlParameter('hex') || 'false') == 'true';
  $("input[id='hex-colour-code']").prop('checked', useHex);
  $("input[id='dec-colour-code']").prop('checked', !useHex);

  for ( var i = 0; i < RGB_Mixer.sliders.length; i++ ) {
    noUiSlider.create(RGB_Mixer.sliders[i], {
      start: Math.floor(Math.random() * RGB_Mixer.maximum),
      step: 1,
      connect: "lower",
      orientation: "horizontal",
      range: {
        'min': RGB_Mixer.minimum,
        'max': RGB_Mixer.maximum
      },
      format: sFormat,
      pips: {
        mode: 'count',
    		values: 9,
    		density: 9,
        stepped: true,
        format: sFormat
    	}
    });
  }

  $('#interactive-rgb-mixer-red-value').on('input', RGB_Mixer.setColorFromInputBox);
  $('#interactive-rgb-mixer-green-value').on('input', RGB_Mixer.setColorFromInputBox);
  $('#interactive-rgb-mixer-blue-value').on('input', RGB_Mixer.setColorFromInputBox);

  // Bind the color changing function
  // to the update event. Fires immediately so has to be outside for-loop.
  RGB_Mixer.sliders[0].noUiSlider.on('update', RGB_Mixer.setColor);
  RGB_Mixer.sliders[1].noUiSlider.on('update', RGB_Mixer.setColor);
  RGB_Mixer.sliders[2].noUiSlider.on('update', RGB_Mixer.setColor);
  // Update display
  RGB_Mixer.setColor();
});


$("input[name='colourCode']").click(function() {
  var temp = $("input[name='colourCode']:checked").val() == 'hex';
  if (temp != useHex) {
    useHex = temp;
    var r_val = $('#interactive-rgb-mixer-red-value').val() || 0;
    var g_val = $('#interactive-rgb-mixer-green-value').val() || 0;
    var b_val = $('#interactive-rgb-mixer-blue-value').val() || 0;
    var vals = [r_val, g_val, b_val];

    if (useHex) {
      r_val = decimalToHex(parseInt(r_val));
      g_val = decimalToHex(parseInt(g_val));
      b_val = decimalToHex(parseInt(b_val));
    } else {
      r_val = parseInt(r_val, 16);
      g_val = parseInt(g_val, 16);
      b_val = parseInt(b_val, 16);
      vals = [r_val, g_val, b_val];
    }
    $('#interactive-rgb-mixer-red-value').val(r_val);
    $('#interactive-rgb-mixer-green-value').val(g_val);
    $('#interactive-rgb-mixer-blue-value').val(b_val);

    for ( var i = 0; i < RGB_Mixer.sliders.length; i++ ) {
      RGB_Mixer.sliders[i].noUiSlider.destroy();
      noUiSlider.create(RGB_Mixer.sliders[i], {
        start: vals[i],
        step: 1,
        connect: "lower",
        orientation: "horizontal",
        range: {
          'min': RGB_Mixer.minimum,
          'max': RGB_Mixer.maximum
        },
        format: sFormat,
        pips: {
          mode: 'count',
          values: 9,
          density: 9,
          stepped: true,
          format: sFormat
        }
      });
    }
  }

  RGB_Mixer.sliders[0].noUiSlider.on('update', RGB_Mixer.setColor);
  RGB_Mixer.sliders[1].noUiSlider.on('update', RGB_Mixer.setColor);
  RGB_Mixer.sliders[2].noUiSlider.on('update', RGB_Mixer.setColor);
});


RGB_Mixer.setColor = function() {
  // Get the slider values,
  var r_val = RGB_Mixer.sliders[0].noUiSlider.get();
  var g_val = RGB_Mixer.sliders[1].noUiSlider.get();
  var b_val = RGB_Mixer.sliders[2].noUiSlider.get();
	// stick them together.
  if (useHex) {
    r_val = parseInt(r_val, 16);
    g_val = parseInt(g_val, 16);
    b_val = parseInt(b_val, 16);
  }
	var color = 'rgb(' +
		r_val + ',' +
		g_val + ',' +
		b_val + ')';

	// Fill the color box.
	RGB_Mixer.result.style.background = color;
	RGB_Mixer.result.style.color = color;

  // Set text for labels
  $('#interactive-rgb-mixer-red-value').val(RGB_Mixer.sliders[0].noUiSlider.get());
  $('#interactive-rgb-mixer-green-value').val(RGB_Mixer.sliders[1].noUiSlider.get());
  $('#interactive-rgb-mixer-blue-value').val(RGB_Mixer.sliders[2].noUiSlider.get());
};

RGB_Mixer.setColorFromInputBox = function(){
  // Get the slider values,
  red_val = $('#interactive-rgb-mixer-red-value').val() || 0;
  green_val = $('#interactive-rgb-mixer-green-value').val() || 0;
  blue_val = $('#interactive-rgb-mixer-blue-value').val() || 0;
	// stick them together.
  if (useHex) {
    red_val = parseInt(red_val, 16);
    green_val = parseInt(green_val, 16);
    blue_val = parseInt(blue_val, 16);
  }
	var color = 'rgb(' + red_val + ',' + green_val + ',' + blue_val + ')';

	// Fill the color box.
	RGB_Mixer.result.style.background = color;
	RGB_Mixer.result.style.color = color;

  // Set slider handle position
  RGB_Mixer.sliders[0].noUiSlider.set(red_val);
  RGB_Mixer.sliders[1].noUiSlider.set(green_val);
  RGB_Mixer.sliders[2].noUiSlider.set(blue_val);
};

function decimalToHex(d) {
  var hex = d.toString(16).toUpperCase();
  return hex;
}
