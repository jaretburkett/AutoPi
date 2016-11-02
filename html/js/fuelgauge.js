fuelGauge = function(config) {
    var obj = this;

    // configurable parameters
    obj.config = {
        // id : string
        // this is container element id
        target: config.target,

        // value : float
        // value gauge is showing
        value: checkFGconfig(config.value, 50),

        // width : int
        // gauge width
        width: checkFGconfig(config.width, 100),

        // height : int
        // gauge height
        height: checkFGconfig(config.height, 400),

        // gaugeColor : string
        // background color of gauge element
        gaugeColor: checkFGconfig(config.gaugeColor, "#edebeb"),

        // levelColors : string[]
        // colors of indicator, from lower to upper, in RGB format
        levelColors: checkFGconfig(config.levelColors, ["#ff0000", "#f9c802", "#a9d70b"])
    };

    // make gauge
    var str = '';
    str += '<div class="FGbox1" style="width:'+obj.config.width+'px; height: '+obj.config.height+'px;'+
        ' background-color:'+obj.config.gaugeColor+'; margin:20px 10px; position:relative;">';

    // calculate fuel level
    var fuelheight = obj.config.height * obj.config.value / 100;
    var startColor = FGgetColor(0, obj.config.levelColors);
    var color = FGgetColor(obj.config.value, obj.config.levelColors);
    str += '<div class="FGbox2" style="height:0px; background-color:'+startColor+'; position: absolute;'+
        ' bottom:0; width:100%; transition: height 1s, background-color 1s;"> </div>';


    // end main box
    str += '</div>';
    $(obj.config.target).html(str);
    // add data later for animation
    $(obj.config.target + ' .FGbox2').css('background-color', color).css('height', fuelheight+'px');

};

/** Get color for value */
function FGgetColor(val, col) {
    var pct = (val - 0) / (100 - 1);
    var noGradient = false;
    var custSec = [];

    var no, inc, colors, percentage, rval, gval, bval, lower, upper, range, rangePct, pctLower, pctUpper, color;
    var noGradient = noGradient || custSec.length > 0;

    if (custSec.length > 0) {
        for (var i = 0; i < custSec.length; i++) {
            if (val > custSec[i].lo && val <= custSec[i].hi) {
                return custSec[i].color;
            }
        }
    }

    no = col.length;
    if (no === 1) return col[0];
    inc = (noGradient) ? (1 / no) : (1 / (no - 1));
    colors = [];
    for (i = 0; i < col.length; i++) {
        percentage = (noGradient) ? (inc * (i + 1)) : (inc * i);
        rval = parseInt((cutHex(col[i])).substring(0, 2), 16);
        gval = parseInt((cutHex(col[i])).substring(2, 4), 16);
        bval = parseInt((cutHex(col[i])).substring(4, 6), 16);
        colors[i] = {
            pct: percentage,
            color: {
                r: rval,
                g: gval,
                b: bval
            }
        };
    }

    if (pct === 0) {
        return 'rgb(' + [colors[0].color.r, colors[0].color.g, colors[0].color.b].join(',') + ')';
    }

    for (var j = 0; j < colors.length; j++) {
        if (pct <= colors[j].pct) {
            if (noGradient) {
                return 'rgb(' + [colors[j].color.r, colors[j].color.g, colors[j].color.b].join(',') + ')';
            } else {
                lower = colors[j - 1];
                upper = colors[j];
                range = upper.pct - lower.pct;
                rangePct = (pct - lower.pct) / range;
                pctLower = 1 - rangePct;
                pctUpper = rangePct;
                color = {
                    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
                };
                return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
            }
        }
    }

}

function checkFGconfig(val, defaultVal){
    if (typeof(val) == 'undefined'){
        return defaultVal;
    } else {
        return val;
    }
}
fuelGauge.prototype.refresh = function(val){
    var obj = this;
    var fuelheight = obj.config.height * val / 100;
    var color = FGgetColor(val, obj.config.levelColors);
    $(obj.config.target + ' .FGbox2').css('background-color', color).css('height', fuelheight+'px');
};
