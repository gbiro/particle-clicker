var detector =
{
    core:
    {
        canvas: null,
        ctx: null
    },

    events:
    {
        canvas: null,
        ctx: null,
        list: [],
    },

    visible: true,

    width: 400,
    height: 400,

    ratio: 1,

    colors: 
    {
        its:              '#0B610B',
        itsLine:          '#0A2A12',

        tpcLight:         '#5882FA', 
        tpcDark:          '#0B0B61', 
        tpcLine:          '#81DAF5',

        trd:              '#F8E0E0',
        trdLine:          '#3B0B0B',
        trd2:             '#BDBDBD',
        trd2Line:         '#190B07',

        dcalLine:         '#088A08',
        dcal:             '#2A120A',
        dcalHolder:       '#A4A4A4',

        ecal:             '#0040FF',

        hmpid:            '#8904B1',

        tof:              '#DF7401',
        tofSep:           '#B45F04',
        tofLine:          '#B18904',

        mucalDark:        '#EA301F',
        mucalDarkLine:    '#C5291A',
        mucalLine:        '#8A0808'
    },

    radius:
    {
        its:      10,
        tpcInner: 30,
        tpcOuter: 60,

        trd:      90,
        tof:      100,

        trd2:     99,
        hmpid:    110,
        dcal:     125,

        ecal:     125,

        mucal: 130,
        mucalLight: 8,
        mucalDark: 52
    },

    tracks:
    [
        {
            name: 'electron',
            color: '#0016EA'
        },
        {
            name: 'jet',
            color: '#0B7700'
        },
        {
            name: 'jet2',
            color: '#FFF268'
        },
        {
            name: 'jet3',
            color: '#A0B3AC'
        },
        {
            name: 'jet4',
            color: '#FFDFB7'
        },
        {
            name: 'jet5',
            color: '#ABCDEF'
        },
        {
            name: 'jet6',
            color: '#1753F2'
        },
        {
            name: 'jet7',
            color: '#A42B42'
        },
        {
            name: 'muon',
            color: '#775400'
        }
    ],

    lastRender: 0,

    animate: function(time)
    {
        var duration = typeof time !== 'undefined' ? time - detector.lastRender : 32;
        detector.lastRender = time;

        requestAnimFrame(detector.animate);
        detector.draw(duration);
    },

    init: function()
    {
        detector.core.canvas = document.getElementById('detector-core');
        detector.core.ctx = detector.core.canvas.getContext('2d');

        detector.events.canvas = document.getElementById('detector-events');
        detector.events.ctx = detector.events.canvas.getContext('2d');

        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = detector.core.ctx.webkitBackingStorePixelRatio ||
                                detector.core.ctx.mozBackingStorePixelRatio ||
                                detector.core.ctx.msBackingStorePixelRatio ||
                                detector.core.ctx.oBackingStorePixelRatio ||
                                detector.core.ctx.backingStorePixelRatio || 1;

        var ratio = devicePixelRatio / backingStoreRatio;

        detector.ratio = detector.core.canvas.width / 400;

        detector.width = detector.core.canvas.width;
        detector.height = detector.core.canvas.height;

        if (devicePixelRatio !== backingStoreRatio) {
            var oldWidth = detector.core.canvas.width;
            var oldHeight = detector.core.canvas.height;

            detector.core.canvas.width = oldWidth * ratio;
            detector.core.canvas.height = oldHeight * ratio;
            detector.core.canvas.style.width = oldWidth + 'px';
            detector.core.canvas.style.height = oldHeight + 'px';

            detector.events.canvas.width = oldWidth * ratio;
            detector.events.canvas.height = oldHeight * ratio;
            detector.events.canvas.style.width = oldWidth + 'px';
            detector.events.canvas.style.height = oldHeight + 'px';

            // now scale the context to counter
            // the fact that we've manually scaled
            // our canvas element
            detector.core.ctx.scale(ratio, ratio);
            detector.events.ctx.scale(ratio, ratio);
        }

        detector.core.ctx.scale(detector.ratio, detector.ratio);
        detector.events.ctx.scale(detector.ratio, detector.ratio);

        detector.coreDraw();
        detector.animate();
    },

//  octagon: a=0.4721r

    coreDraw: function()
    {
        var a = (detector.radius.mucalDark + detector.radius.mucal) * 0.8721;
        var r = detector.radius.mucalDark + detector.radius.mucal;
        var r2= detector.radius.mucal;
        var a2 = detector.radius.mucal * 0.8721;
        var ctx = detector.core.ctx;
        var cx = detector.width / 2;
        var cy = detector.height / 2;

        ctx.clearRect(0, 0, 400, 400);

        ctx.beginPath();
        ctx.moveTo (cx +  r * Math.cos(0), cy +  r *  Math.sin(0));          
        ctx.lineTo ( cx + r, cy + a/2 );
        ctx.lineTo ( cx + a/2, cy + r );
        ctx.lineTo ( cx - a/2, cy + r );
        ctx.lineTo ( cx - r, cy + a/2 );
        ctx.lineTo ( cx - r, cy - a/2 );
        ctx.lineTo ( cx - a/2, cy - r );
        ctx.lineTo ( cx + a/2, cy - r );
        ctx.lineTo ( cx + r, cy - a/2 );
        ctx.lineTo ( cx + r, cy +  0  );
        ctx.strokeStyle = detector.colors.mucalDarkLine;
        ctx.fillStyle = detector.colors.mucalDark;
        ctx.stroke();
        ctx.fill();

        /*****************************************************************/

        ctx.strokeStyle = detector.colors.mucalLine;
        ctx.moveTo (cx, cy);
        ctx.lineTo ( cx + r, cy + a/2);
        ctx.stroke();
        ctx.moveTo (cx, cy);
        ctx.lineTo ( cx - r, cy + a/2);
        ctx.stroke();
        ctx.moveTo (cx, cy);
        ctx.lineTo ( cx + r, cy - a/2);
        ctx.stroke();
        ctx.moveTo (cx, cy);
        ctx.lineTo ( cx - r, cy - a/2);
        ctx.stroke();
        ctx.moveTo (cx, cy);
        ctx.lineTo ( cx + a/2, cy + r);
        ctx.stroke();
        ctx.moveTo (cx, cy);
        ctx.lineTo ( cx - a/2, cy + r);
        ctx.stroke();
        ctx.moveTo (cx, cy);
        ctx.lineTo ( cx + a/2, cy - r);
        ctx.stroke();
        ctx.moveTo (cx, cy);
        ctx.lineTo ( cx - a/2, cy - r);
        ctx.stroke();

        /*****************************************************************/

        ctx.strokeStyle = detector.colors.mucalDarkLine;
        ctx.beginPath();
        ctx.moveTo (cx +  r2 * Math.cos(0), cy +  r2 *  Math.sin(0));          
        ctx.lineTo ( cx + r2, cy + a2/2 );
        ctx.lineTo ( cx + a2/2, cy + r2 );
        ctx.lineTo ( cx - a2/2, cy + r2 );
        ctx.lineTo ( cx - r2, cy + a2/2 );
        ctx.lineTo ( cx - r2, cy - a2/2 );
        ctx.lineTo ( cx - a2/2, cy - r2 );
        ctx.lineTo ( cx + a2/2, cy - r2 );
        ctx.lineTo ( cx + r2, cy - a2/2 );
        ctx.lineTo ( cx + r2, cy +  0  );
        ctx.stroke();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';

        ctx.fillStyle = detector.colors.mucalDark;
        ctx.strokeStyle = detector.colors.mucalDarkLine;
        ctx.fillRect ( cx - r2 + 3, cy + a2/2 + 3 , 40, 40);
        ctx.stroke();
        ctx.fillRect ( cx + r2 - 43, cy + a2/2 + 3 , 40, 40);
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';

        /*****************************************************************/

        var Split = 9;

        ctx.lineWidth = 10;
        for (var i = 9; i <= 14; i++) {
          ctx.beginPath();
          ctx.strokeStyle = detector.colors.trd2;
          ctx.moveTo(cx + (detector.radius.trd2 + 10) * Math.cos(Math.PI * (i-1) / Split), cy + (detector.radius.trd2 + 10) * Math.sin(Math.PI * (i-1) / Split));
          ctx.lineTo(cx + (detector.radius.trd2 + 10) * Math.cos(Math.PI * i / Split), cy + (detector.radius.trd2 + 10) * Math.sin(Math.PI * i / Split)); 
          ctx.stroke();
          ctx.closePath();
        }

        /*****************************************************************/

        ctx.lineWidth = 1;
        ctx.strokeStyle = detector.colors.trd2Line;
        var Split = 27;
        for ( var i = 24; i < 43; i++){ 
          ctx.beginPath();
//          ctx.moveTo(cx + detector.radius.trd2 * Math.cos(Math.PI * i /Split), cy + detector.radius.trd2 * Math.cos(Math.PI * i /Split));
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + (detector.radius.trd2+14) * Math.cos(Math.PI * i / Split), cy + (detector.radius.trd2 +14) * Math.sin(Math.PI * i / Split));
          ctx.stroke();
          ctx.closePath();
        }

        /*****************************************************************/

        ctx.strokeStyle = detector.colors.tofLine;
        ctx.fillStyle = detector.colors.tof;
        ctx.beginPath();
        ctx.arc(cx, cy, detector.radius.tof, 0, Math.PI *2, true);
        ctx.stroke();
        ctx.fill();

        /*****************************************************************/

        ctx.strokeStyle = detector.colors.tofSep;
        ctx.lineWidth = 3;
        var Split = 27;
        for (var i = 0; i < 54; i++) {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + detector.radius.tof * Math.cos(Math.PI * i / Split), cx + detector.radius.tof * Math.sin(Math.PI * i / Split));
            ctx.stroke();
        }
        /*****************************************************************/

        ctx.lineWidth = 12;
        Split = 9;
        ctx.strokeStyle = detector.colors.dcalLine;
        for (var i = 3; i <= 5; i++) {
          ctx.beginPath();
          ctx.moveTo(cx + (detector.radius.trd2 + 12) * Math.cos(Math.PI * (i-1) / Split), cy + (detector.radius.trd2 + 12) * Math.sin(Math.PI * (i-1) / Split));
          ctx.lineTo(cx + (detector.radius.trd2 + 12) * Math.cos(Math.PI * i / Split), cy + (detector.radius.trd2 + 12) * Math.sin(Math.PI * i / Split)); 
          ctx.stroke();
          ctx.closePath();
        }
        /*****************************************************************/

        ctx.lineWidth = 18;
        ctx.strokeStyle = detector.colors.hmpid;
        for (var i = 16; i <= 18; i++) {
          ctx.beginPath();
          ctx.moveTo(cx + (detector.radius.trd2 + 13) * Math.cos(Math.PI * (i-1) / Split), cy + (detector.radius.trd2 + 13) * Math.sin(Math.PI * (i-1) / Split));
          ctx.lineTo(cx + (detector.radius.trd2 + 13) * Math.cos(Math.PI * i / Split), cy + (detector.radius.trd2 + 13) * Math.sin(Math.PI * i / Split)); 
          ctx.stroke();
          ctx.closePath();
        }
        /*****************************************************************/

        ctx.lineWidth = 12;
        ctx.strokeStyle = detector.colors.ecal;
        ctx.beginPath();
        ctx.arc(cx, cy, detector.radius.ecal-5, Math.PI * 8/9, Math.PI*14/9, false);
        ctx.stroke();
        
        /*****************************************************************/

        ctx.lineWidth = 1;
        for ( var i = 0; i < 6; i++){
          ctx.strokeStyle = detector.colors.trdLine;
          ctx.fillStyle = detector.colors.trd;
          ctx.beginPath();
          ctx.arc(cx, cy, detector.radius.trd - 5*i, 0, Math.PI *2, true);
          ctx.stroke();
          ctx.fill();
        }
        /*****************************************************************/
        
        Split = 9;
        ctx.strokeStyle = detector.colors.trdLine;
        for (var i = 0; i < 18; i++) {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + detector.radius.trd * Math.cos(Math.PI * i / Split), cx + detector.radius.trd * Math.sin(Math.PI * i / Split));
            ctx.stroke();
        }
        /*****************************************************************/

        ctx.beginPath();
        ctx.fillStyle = detector.colors.tpcLight;
        ctx.arc(cx, cy, detector.radius.tpcOuter, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = detector.colors.tpcLine;
        ctx.arc(cx, cy, detector.radius.tpcOuter-2, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = detector.colors.tpcDark;
        ctx.arc(cx, cy, detector.radius.tpcOuter-4, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = detector.colors.tpcLight;
        ctx.arc(cx, cy, detector.radius.tpcOuter-6, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = detector.colors.tpcDark;
        ctx.arc(cx, cy, detector.radius.tpcInner, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = detector.colors.tpcLight;
        ctx.arc(cx, cy, detector.radius.tpcInner-2, 0, Math.PI * 2, true);
        ctx.fill();


        ctx.strokeStyle = detector.colors.tpcLine;
        var Split = 9;
        for (var i = 0; i < 18; i++) {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + detector.radius.tpcOuter * Math.cos(Math.PI * i / Split), cx + detector.radius.tpcOuter * Math.sin(Math.PI * i / Split));
            ctx.stroke();
        }
        /*****************************************************************/

        ctx.beginPath();
        ctx.strokeStyle = detector.colors.itsLine;
        ctx.fillStyle = detector.colors.its;
        ctx.arc(cx, cy, detector.radius.its, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
    },

    addEvent: function()
    {
        var num = Math.max(42, Math.ceil(21 * Math.random()));

        for (var i = 0; i < num; i++) {
            var index = Math.round(Math.random() * (detector.tracks.length - 1));
            var event = new ParticleEvent(detector.tracks[index], num);
            detector.events.list.push(event);
        }
    },

    addEventExternal: function()
    {
        if (!detector.visible) {
            return;
        }

        var num = Math.min(42 * achievements.count.workers / 5, 30);

        for (var i = 0; i < num; i++) {
            var index = Math.round(Math.random() * (detector.tracks.length - 1));
            var event = new ParticleEvent(detector.tracks[index], num, true);
            detector.events.list.push(event);
        }
    },

    draw: function(duration)
    {
        detector.events.ctx.clearRect(0, 0, 400, 400);

        var del = -1;
        for (var e in detector.events.list) {
            if (detector.events.list[e].alpha > 0) {
                detector.events.list[e].draw(duration);
            } else {
                del = e;
            }
        }

        if (del > 0) {
            detector.events.list.splice(0, del);
        }
    }
};

window.requestAnimFrame = (function(){
    return window.requestAnimationFrame       || 
           window.webkitRequestAnimationFrame || 
           window.mozRequestAnimationFrame    || 
           window.oRequestAnimationFrame      || 
           window.msRequestAnimationFrame     || 
           function(/* function */ callback, /* DOMElement */ element){
               window.setTimeout(callback, 1000 / 60);
           };
})();

(function() { detector.init(); })();
