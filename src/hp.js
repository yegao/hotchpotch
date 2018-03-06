var wrap = $api.byId('wrap'),head = $api.byId('head'),main = $api.byId('main');
var wrapH = $api.offset(wrap).h;
var wrapW = $api.offset(wrap).w;
Array.prototype.getKeys = function(){
var keys = [];
if( this instanceof Array){
	for( k in this ){
		keys.push(k);
	}
	return keys;
}
else{
	console.log('getKey Error : 该方法要求是数组');
	return false;
}

}
var fixHeight = function(eles,hs){
eles.forEach(function(v,k,a){
	$(v).height(hs[k]*wrapH);
});
}
var drawTable = function(id,trs,ws,tds){
trs.forEach(function(v,k,a){
	$(id).find('.tb_title').append('<div style="width:'+wrapW*ws[k]+'px"><a href="javascript:;" class="tr_c">'+trs[k]+'</a></div>');
});
tds.forEach(function(v,k,a){
	var key =
	$(id).find('.tb_content').append('<div style="width:'+wrapW*ws[k]+'px"><a href="javascript:;" class="tr_c">'+trs[k]+'</a></div>');
})
}

/**
* Created by yegao on 2016/8/23.
*/
var Yapi = {
//dom相关
byId : function(id){
	return document.getElementById(id);
},
byClass : function(cls){
	return document.getElementsByClassName(cls);
},
createEle: function(s){
	return document.createElement(s)
},
//显示数组a中的e,其他的全部隐藏
showOne:function(e,a){
	a.forEach(function(v){
		v.style.display = 'none';
	});
	e.style.display = 'block';
},
appends:function(p,cs){
	cs.forEach(function(v){
		p.appendChild(v);
	});
	return p;
},
htmls:function(p,cs){
	p.innerHTML = '';
	this.appends(p,cs);
	return p;
},
//事件相关
on:function( e, event, fn ) {
	if (e.addEventListener)
		e.addEventListener( event, fn, false );
	else if (e.attachEvent) {
		e["e"+event+fn] = fn;
		e.attachEvent( "on"+event, function() {
			e["e"+event+fn]();
		} );
	}
},
onEnter:function(fn){
	document.onkeyup = function(e){
		if(!e) e = window.event;//火狐中是 window.event
		if((e.keyCode || e.which) == 13){
			fn();
		}
	}
},
//表格相关
//画表
/**
 * @id 容器id
 * @hs 表头内容
 * @ws 各列宽度
 * @cs 单元格内容
 * @rs 每页行数
 * @fill 1默认填满 2内部窄的时候填满 内部宽的时候不填满  3 都不填满
 */
drawTable: function(id,hs,ws,cs,rs,fill){
	var self = this;
	var box = this.byId(id),boxw = box.offsetWidth,mdivh = box.offsetHeight/(rs+1.2),hdivh = mdivh*1.2;
	//解析ws如果ws里面是整数就使用px,如果有%存在就使用百分比
	ws.forEach(function(v,k){
		if(0<=(''+v).indexOf('%')){
			ws[k] = v*boxw;
		}
	});
	var mboxw = eval(ws.join("+"));
	if(fill == 1){
		ws.forEach(function(v,k){
			ws[k] = v/mboxw * boxw;
		});
		mboxw = boxw;
	}
	if(fill ==2){
		if(mboxw < boxw){
			ws.forEach(function(v,k){
				ws[k] = v/mboxw * boxw;
			});
			mboxw = boxw;
		}
	}

	var hbox = this.createEle('div'),mbox = this.createEle('div'),bdiv = this.createEle('div');
	hbox.style.width = mbox.style.width = bdiv.style.width = mboxw+'px';
	hbox.id = 'hp-hbox';
	mbox.id = 'hp-mbox';
	hbox.style.height = hdivh+'px';
	mbox.style.top = hdivh+'px';
	//hbox
	var hdivs = [],htempLeft = 0;
	hs.forEach(function(v,k){
		var hdiv = self.createEle('div');
		hdiv.className = 'hp-hdiv';
		if(0 == k){ hdiv.style.borderLeftWidth = '0px'; }
		hdiv.style.width = ws[k]+'px';
		hdiv.style.height= hdivh+'px';
		hdiv.style.left = htempLeft+'px';
		htempLeft += ws[k];
		var a = self.createEle('a');
		a.className = 'hp-ha';
		a.href = 'javascript:;';
		a.innerText = hs[k];
		a.style.lineHeight  = a.style.height = hdivh+'px';
		a.style.fontSize = Math.ceil(hdivh/3)+'px';
		a.style.paddingLeft = '8px';
		hdiv.appendChild(a);
		hdivs.push(hdiv);
	});
	this.appends(hbox,hdivs);
	//有数据的行
	var mdivs = [];
	var tempLeft = 0;
	cs.forEach(function(v,k){
		if(rs > k){
			var mdiv = self.createEle('div');
			mdiv.className = 'hp-mdiv';
			mdiv.style.height = mdivh+'px';
			mdiv.style.backgroundColor = k%2 ? '#F6F5F5' : '#FFFFFF';
			if(cs[k] instanceof Array){
				var mas = [];
				var mtempLeft = 0;
				cs[k].forEach(function(v,k){
					var ma = self.createEle('a');
					ma.innerText = ma.title = v;
					ma.href = 'javascript:;';
					ma.style.width = (ws[k]-4)+'px';
					ma.style.lineHeight = ma.style.height = mdivh+'px';
					ma.style.fontSize = Math.ceil(mdivh/3)+'px';
					ma.style.left = mtempLeft+'px';
					mtempLeft += ws[k];
					ma.className = 'hp-ma';
					if(0 == k){ ma.style.borderLeftWidth = '0px'; }
					mas.push(ma);
				});
				self.appends(mdiv,mas);
			}
			else{
				var ma = self.createEle('a');
				ma.innerText = v;
				ma.href = 'javascript:;';
				ma.style.width = (ws[0]-4)+'px';
				ma.style.left = '0px';
				ma.className = 'hp-ma';
				ma.style.borderLeftWidth = '0px';
				mdiv.appendChild(ma);
			}
			mdivs.push(mdiv);
		}
	});
	//多余的空行
	var clen = cs.length,mexdivs = [],exlen = rs-clen;
	if(0 < exlen){
		for(var i=0;i<exlen;i++){
			var mexdiv = self.createEle('div');
			mexdiv.style.height = mdivh+'px';
			mexdiv.className = 'hp-mexdiv';
			if(clen%2){
				(!(i%2)) && (mexdiv.style.backgroundColor = '#F5F5F5');
				(i%2) && (mexdiv.style.backgroundColor = '#FFFFFF');
			}
			else{
				(!(i%2)) && (mexdiv.style.backgroundColor = '#FFFFFF');
				(i%2) && (mexdiv.style.backgroundColor = '#F5F5F5');
			}
			var exmas = [];var exmtempLeft = 0;
			cs[0].forEach(function(v,k){
				var exma = self.createEle('a');
				exma.href = 'javascript:;';
				exma.style.width = (ws[k]-4)+'px';
				exma.style.lineHeight = exma.style.height = mdivh+'px';
				exma.style.fontSize = Math.ceil(mdivh/3)+'px';
				exma.style.left = exmtempLeft+'px';
				exmtempLeft += ws[k];
				exma.className = 'hp-ma';
				if(0 == k){ exma.style.borderLeftWidth = '0px'; }
				exmas.push(exma);
			});
			Yapi.appends(mexdiv,exmas);

			mexdivs.push(mexdiv);
		}
	}
	this.appends(hbox,hdivs);
	this.appends(mbox,mdivs.concat(mexdivs));
	this.appends(box,[hbox,mbox,bdiv]);
},
/**
 *
 * @param id 容器
 * @param cs 单元
 * @param w  总宽
 * @param ew 单个宽
 * @param h  单个高
 */
drawTabBox: function(id,cs,w,ew,h){
	var ec = this.byId(id),clen = cs.length,w = w,left = '0px',movew = 0,boxw = clen * (ew+4),self = this;
	//是否显示左右标签
	if(w < boxw){
		var prev = this.createEle('a'),next = this.createEle('a');
		prev.href = next.href = 'javascript:;';
		prev.innerText = '<';
		prev.className = 'hp-prev'
		prev.style.height = prev.style.lineHeight = next.style.height = next.style.lineHeight = h+'px';
		prev.style.width = next.style.width = (h>>1)+'px';
		left = (parseInt(prev.style.width)+2)+'px';
		next.innerText = '>';
		next.className = 'hp-next';
		this.appends(ec,[prev,next]);
		w -= h+4;
		movew = (ew+4) * Math.floor(w/(ew+4));
	}
	var tabBox = this.createEle('div');
	tabBox.className = 'hp-tabbox';
	tabBox.style.height = (h+4)+'px';
	tabBox.style.width = boxw +'px';
	tabBox.style.left = left;

	cs.forEach(function(v){
		var ea = self.createEle('a');
		ea.className = 'hp-tabbox-a';
		ea.innerText = v;
		ea.style.width = ea.style.height = ea.style.lineHeight = h+'px';
		tabBox.appendChild(ea);
	});

	ec.appendChild(tabBox);
	if(prev){
		this.on(prev,'click',function(){
			var curLeft = parseInt(tabBox.style.left);
			if(prev.clientWidth+2 > curLeft){//此处h闭包
				tabBox.style.left = (curLeft + movew)+'px';
			}
		});
	}
	if(next){
		this.on(next,'click',function(){
			var curLeft = parseInt(tabBox.style.left);
			if(0 < (boxw - w) + curLeft){
				tabBox.style.left = (curLeft - movew)+'px';
			}
		});
	}
},

//播放器
video:function(vd){
	var div = this.createEle('div');
	div.id = 'hp-video-tools';
	var aPlay = this.createEle('a'),aPause = this.createEle('a'),aMuted = this.createEle('a'),aVolume = this.createEle('a');
	aPlay.id = 'hp-video-play';
	aPause.id = 'hp-video-pause';
	aMuted.id = 'hp-video-muted';
	aVolume.id = 'hp-video-volume';
	this.htmls(div,[aPlay,aPause,aMuted,aVolume]);
	vd.parentNode.appendChild(div);
	this.on(aPlay,'click',function(){
		vd.play();
		aPlay.style.display = 'none';
		aPause.style.display = 'block';
		div.style.display = 'none';
	});
	this.on(aPause,'click',function(e){
		if(document.all){
			e.cancelBubble=true;
		}
		e.stopPropagation();
		vd.pause();
		aPause.style.display = 'none';
		aPlay.style.display = 'block';
	});
	this.on(aMuted,'click',function(){
		vd.muted = true;
		vd.volumg = 0.0;
	});
	this.on(aVolume,'click',function(){
		vd.muted = false;
		vd.volumg = 1.0;
	});
	this.on(div,'click',function(){
		div.style.display = 'none';
	})
	this.on(vd,'click',function(){
		div.style.display = 'block';
		var w = div.offsetWidth;
		var h = div.offsetHeight;
		aPlay.style.left = (w/2-50)+'px';
		aPause.style.left = (w/2-50)+'px';
		aPlay.style.top = (h/2-50)+'px';
		aPause.style.top = (h/2-50)+'px';
	});
},


	//警告相关
	warn:function(x){
		var warn = Yapi.createEle('div');
		warn.innerHTML = '<a class="hp-warn-a">'+x+'</a>';
		warn.className = 'hp-warn';
		setTimeout(function () {
			warn.remove();
		},2000)
		document.body.appendChild(warn);
	}


	//快捷键

}
