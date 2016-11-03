fuelGauge = function (config) {
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

        // fontValSize : int
        // Value font size
        fontValSize: checkFGconfig(config.fontValSize, 20),

        // fontTitleSize : int
        // Title font size
        fontTitleSize: checkFGconfig(config.fontTitleSize, 20),

        // title : string
        // title at the top
        title: checkFGconfig(config.title, "Gauge"),

        // showTitle : bool
        // show title
        showTitle: checkFGconfig(config.showTitle, true),

        // titleBottom : bool
        // show title
        titleBottom: checkFGconfig(config.titleBottom, false),

        // showVal : bool
        // show val
        showVal: checkFGconfig(config.showVal, true),

        // shadow : bool
        // showshadow
        shadow: checkFGconfig(config.shadow, false),

        // rounded : bool
        // Round corners
        rounded: checkFGconfig(config.rounded, false),

        // gaugeColor : string
        // background color of gauge element
        gaugeColor: checkFGconfig(config.gaugeColor, "#edebeb"),

        // gaugeColor : string
        // background color of gauge element
        fontColor: checkFGconfig(config.fontColor, "#000000"),

        // levelColors : string[]
        // colors of indicator, from lower to upper, in RGB format
        levelColors: checkFGconfig(config.levelColors, ["#ff0000", "#f9c802", "#a9d70b"])
    };

    // make gauge

    if (obj.config.showVal) {
        obj.config.valboxsize = obj.config.fontValSize + 20;
    } else {
        obj.config.valboxsize = 0;
    }
    if (obj.config.showTitle) {
        obj.config.titleboxsize = obj.config.fontTitleSize + 20;
    } else {
        obj.config.titleboxsize = 0;
    }
    obj.config.shadowSpread = Math.round(obj.config.width / 3);
    obj.config.gaugeHeight = obj.config.height - obj.config.valboxsize - obj.config.titleboxsize;
    var str = '';
    var titlebox = '';
    if (obj.config.showTitle) {
        titlebox += '<div class="FGtitle" style="font-size: ' + obj.config.fontTitleSize + 'px; line-height:' + obj.config.fontTitleSize + 'px;' +
            ' text-align: center; margin-top:10px;">' +
            obj.config.title + '</div>';
    }
    if(!obj.config.titleBottom){
        str += titlebox;
    }
    str += '<div class="FGbox1" style="width:' + obj.config.width + 'px; height: ' + obj.config.gaugeHeight + 'px;' +
        ' background-color:' + obj.config.gaugeColor + '; margin:10px auto 10px; position:relative; overflow:hidden;';
    if (obj.config.shadow) {
        str += ' box-shadow: inset 0px 5px ' + obj.config.shadowSpread + 'px 0px rgba(0,0,0,.6); ';
    }
    if (obj.config.rounded) {
        str += 'border-radius: ' + obj.config.width / 2 + 'px;';
    }
    str += '">';
    var startColor = FGgetColor(0, obj.config.levelColors);
    str += '<div class="FGbox2" style="height:0px; background-color:' + startColor + '; position: absolute;' +
        ' bottom:0; width:100%; transition: height 1s, background-color 1s; ';
    if (obj.config.shadow) {
        str += ' box-shadow: inset 0px 5px ' + obj.config.shadowSpread + 'px 0px rgba(0,0,0,.6); ';
    }
    if (obj.config.rounded && obj.config.shadow) {
        str += ' border-bottom-right-radius:' + obj.config.width / 2 + 'px; border-bottom-left-radius: ' +
            obj.config.width / 2 + 'px;';
    }
    str += '"> </div>';


    // end main box
    str += '</div>';
    if (obj.config.showVal) {
        str += '<div class="FGval" style="font-size:' + obj.config.fontValSize + 'px; text-align:center; line-height:' +
            obj.config.fontValSize + 'px; color:' + obj.config.fontColor + ';">';
        str += obj.config.value;
        str += '</div>';
    }
    if(obj.config.titleBottom){
        str += titlebox;
    }
    $(obj.config.target).html(str);
    // add data later for animation
    setTimeout(function () {
        obj.val(obj.config.value);
    }, 100);


};

/** Get color for value */
function FGgetColor(val, col) {
    if (val > 99) val = 99;
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

function checkFGconfig(val, defaultVal) {
    if (typeof(val) == 'undefined') {
        return defaultVal;
    } else {
        return val;
    }
}


fuelGauge.prototype.val = function (val) {
    var obj = this;
    obj.config.value = val;
    // calculate fuel level
    if (obj.config.value > 99) {
        obj.config.fuelheight = obj.config.gaugeHeight;
    } else {
        obj.config.fuelheight = obj.config.gaugeHeight * obj.config.value / 100;
    }
    var color = FGgetColor(obj.config.value, obj.config.levelColors);
    $(obj.config.target + ' .FGbox2').css('background-color', color).css('height', obj.config.fuelheight + 'px');
    if (obj.config.showVal) {
        $(obj.config.target + ' .FGval').html(obj.config.value);
    }
};
