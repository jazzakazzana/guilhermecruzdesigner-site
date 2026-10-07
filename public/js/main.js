// ícones de pixel das "conquistas"
  var PAL={g:'#5fa832',d:'#3f7a1c',b:'#9a6a35',k:'#4a2e12',w:'#f2f2f2',y:'#ffd83d',r:'#d9402b',p:'#ff9bb0',s:'#aab2ba'};
  var ICONS={
    grass:['gdggdggd','gggggdgg','dggggggd','bbbbbbbb','bkbbbkbb','bbbbkbbb','bbkbbbbb','bbbbbbkb'],
    sword:['......ss','.....sss','....sss.','s..sss..','ss.ss...','.bss....','bb.b....','bb......'],
    star:['...yy...','...yy...','yyyyyyyy','.yyyyyy.','..yyyy..','.yyyyyy.','.yy..yy.','yy....yy'],
    book:['..kkkkkk','..kwwwwk','..kwkkwk','..kwwwwk','..kwkkwk','..kwwwwk','..kkkkkk','........'],
    note:['...www..','...wwww.','...w.www','...w....','...w....','.www....','wwww....','.ww.....'],
    cat:['w.....w.','ww...ww.','wwwwwww.','wkwwwkw.','wwwpwww.','wwwwwww.','.wwwww..','........'],
    cross:['...bb...','...bb...','bbbbbbbb','bbbbbbbb','...bb...','...bb...','...bb...','...bb...']
  };
  document.querySelectorAll('canvas.px').forEach(function(c){
    var map=ICONS[c.getAttribute('data-icon')]; if(!map) return;
    var ctx=c.getContext('2d');
    for(var y=0;y<8;y++){for(var x=0;x<8;x++){
      var ch=map[y].charAt(x); if(ch!=='.' && PAL[ch]){ctx.fillStyle=PAL[ch]; ctx.fillRect(x,y,1,1);}
    }}
  });
