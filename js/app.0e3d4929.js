(function(t){function e(e){for(var i,a,o=e[0],c=e[1],l=e[2],d=0,h=[];d<o.length;d++)a=o[d],Object.prototype.hasOwnProperty.call(r,a)&&r[a]&&h.push(r[a][0]),r[a]=0;for(i in c)Object.prototype.hasOwnProperty.call(c,i)&&(t[i]=c[i]);u&&u(e);while(h.length)h.shift()();return s.push.apply(s,l||[]),n()}function n(){for(var t,e=0;e<s.length;e++){for(var n=s[e],i=!0,o=1;o<n.length;o++){var c=n[o];0!==r[c]&&(i=!1)}i&&(s.splice(e--,1),t=a(a.s=n[0]))}return t}var i={},r={app:0},s=[];function a(e){if(i[e])return i[e].exports;var n=i[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=t,a.c=i,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)a.d(n,i,function(e){return t[e]}.bind(null,i));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="/harpejjitabs/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],c=o.push.bind(o);o.push=e,o=o.slice();for(var l=0;l<o.length;l++)e(o[l]);var u=c;s.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"01fa":function(t,e,n){},"034f":function(t,e,n){"use strict";var i=n("85ec"),r=n.n(i);r.a},"1a8b":function(t,e,n){"use strict";var i=n("da7b"),r=n.n(i);r.a},5523:function(t,e,n){"use strict";var i=n("a5b3"),r=n.n(i);r.a},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var i=n("2b0e"),r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("Toolsbar",[t._v("yo")]),n("div",{attrs:{id:"main"}},[n("Tablature",{staticClass:"tablature"})],1)],1)},s=[],a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("svg",{attrs:{width:"100%",height:t.svgHeight,id:"tablature"}},[n("rect",{staticStyle:{fill:"white"},attrs:{width:"100%",height:"100%"}}),n("g",{attrs:{transform:"translate("+t.xOffset+", 0), scale("+t.scale+")",id:"workzone"}},[t._l(t.number_frets,(function(e,i){return n("line",{key:"frets"+e,staticStyle:{fill:"black","stroke-width":"1px",stroke:"black"},attrs:{x1:"0",y1:i*t.frets_spacing+t.frets_spacing/2,x2:t.frets_size,y2:i*t.frets_spacing+t.frets_spacing/2}})})),t._l(t.number_string,(function(e,i){return n("line",{key:"strings"+e,staticStyle:{fill:"black","stroke-width":"1px",stroke:"#CCC"},attrs:{x1:i*t.string_spacing+t.string_spacing,y1:"0",x2:i*t.string_spacing+t.string_spacing,y2:t.string_size}})})),t._l(t.number_frets,(function(e,i){return n("g",{key:e},t._l(t.number_string,(function(r,s){return n("g",{key:r+";"+e},[n("Key",{attrs:{"pos-x":s*t.string_spacing+t.string_spacing,"pos-y":i*t.frets_spacing+t.frets_spacing/2,x:s,y:i}})],1)})),0)})),t.editingZone?n("Resizer"):t._e(),n("Title")],2)])])},o=[],c=n("5530"),l=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("g",{attrs:{transform:"translate("+t.posX+", "+t.posY+")"},on:{click:function(e){t.isVisible=!t.isVisible}}},[n("rect",{style:{stroke:"#666",strokeWidth:"1px",fill:t.keyColor},attrs:{width:"15",height:"25",transform:"translate(-7.5, 0)"}}),t.isDo?n("rect",{staticStyle:{fill:"transparent",stroke:"black"},attrs:{width:"10",height:"5",transform:"translate(-5, 10)"}}):t._e(),n("Finger",{attrs:{isVisible:t.isVisible},on:{deleteFinger:function(e){t.isVisible=!1}}})],1)},u=[],d=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("transition",{attrs:{name:"fade"}},[t.isVisible?n("g",[n("circle",{attrs:{r:"12",cy:"20"}}),n("text",{staticStyle:{fill:"white","font-size":"16px"},attrs:{y:"22","alignment-baseline":"middle","text-anchor":"middle"},on:{click:function(e){return e.stopPropagation(),t.startEdit(e)}}},[t._v(t._s(t.value))]),n("transition",{attrs:{name:"fade"}},[t.editing?n("foreignObject",{attrs:{height:"24",width:"24",x:"-12",y:8},on:{click:function(t){t.stopPropagation()}}},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.value,expression:"value"}],ref:"textEdit",attrs:{type:"text"},domProps:{value:t.value},on:{blur:function(e){return e.preventDefault(),e.stopPropagation(),t.doneEdit(e)},keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.doneEdit(e)},keydown:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"delete",[8,46],e.key,["Backspace","Delete","Del"])?null:t.deleteDown(e)},input:function(e){e.target.composing||(t.value=e.target.value)}}})]):t._e()],1)],1):t._e()])},h=[],g={name:"Finger",props:["isVisible"],data:function(){return{value:"1",editing:!1}},methods:{startEdit:function(){var t=this;this.editing=!0;var e=document.createElement("input");e.type="text",e.style.opacity="0",document.body.appendChild(e),e.focus(),setTimeout((function(){var n=t.$refs.textEdit;n.focus(),n.select(),n.setSelectionRange(0,9999),document.body.removeChild(e)}),0)},doneEdit:function(){this.editing=!1},deleteDown:function(){""===this.value&&(this.editing=!1,this.$emit("deleteFinger"))}},watch:{isVisible:function(t){t&&this.startEdit()}}},f=g,p=(n("eab3"),n("2877")),m=Object(p["a"])(f,d,h,!1,null,"672b3ca5",null),y=m.exports,b={name:"Key",components:{Finger:y},props:["posX","posY","x","y"],data:function(){return{isVisible:!1}},methods:{},computed:{isBlack:function(){return this.y%2?v(Math.floor((this.x-1-(this.y-1)/2)/3),2):v(this.x-1-this.y/2,6)<=1},keyColor:function(){return this.isBlack?"#999":"#FFF"},isDo:function(){return this.y%2&&0===v(this.x-1-(this.y-1)/2,6)}}};function v(t,e){return(t%e+e)%e}var _=b,w=Object(p["a"])(_,l,u,!1,null,"f1448286",null),x=w.exports,k=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("g",[n("rect",{staticStyle:{fill:"rgba(46, 213, 115, 0.1)"},attrs:{x:t.x1*t.string_spacing,y:t.y1*t.frets_spacing+t.frets_spacing/2,width:(t.x2-t.x1)*t.string_spacing,height:(t.y2-t.y1)*t.frets_spacing}}),n("polygon",{directives:[{name:"show",rawName:"v-show",value:!0,expression:"true"}],staticClass:"resize tl",attrs:{transform:"translate("+t.x1*t.string_spacing+", "+(t.y1*t.frets_spacing+t.frets_spacing/2)+")",points:"0,0 10,0 10,4, 4,4 4,10, 0,10",fill:"green",x:"x1",y:"y1"},on:{mousedown:t.startDrag}}),n("polygon",{directives:[{name:"show",rawName:"v-show",value:!0,expression:"true"}],staticClass:"resize tr",attrs:{transform:"translate("+(t.x2*t.string_spacing-10)+", "+(t.y1*t.frets_spacing+t.frets_spacing/2)+")",points:"0,0 10,0 10,10, 6,10 6,4 0,4",fill:"green",x:"x2",y:"y1"},on:{mousedown:t.startDrag}}),n("polygon",{directives:[{name:"show",rawName:"v-show",value:!0,expression:"true"}],staticClass:"resize bl",attrs:{transform:"translate("+t.x1*t.string_spacing+", "+(t.y2*t.frets_spacing+t.frets_spacing/2-10)+")",points:"0,0 4,0 4,6 10,6 10,10 0,10",fill:"green",x:"x1",y:"y2"},on:{mousedown:t.startDrag}}),n("polygon",{directives:[{name:"show",rawName:"v-show",value:!0,expression:"true"}],staticClass:"resize br",attrs:{transform:"translate("+(t.x2*t.string_spacing-10)+", "+(t.y2*t.frets_spacing+t.frets_spacing/2-10)+")",points:"6,0 10,0 10,10 0,10 0,6 6,6",fill:"green",x:"x2",y:"y2"},on:{mousedown:t.startDrag}})])},z=[],E=n("2f62"),C={name:"Resizer",data:function(){return{x1:0,y1:0,x2:0,y2:0,dragged:null,pt:null}},methods:{startDrag:function(t){this.dragged=t.target,this.workzone.addEventListener("mousemove",this.onMove,!1),this.workzone.addEventListener("mouseup",this.stopDrag,!1)},onMove:function(t){var e=this.cursorPoint(t);this[this.dragged.getAttribute("x")]=Math.floor(e.x/this.string_spacing),this[this.dragged.getAttribute("y")]=Math.floor((e.y-this.frets_spacing/2)/this.frets_spacing)},stopDrag:function(t){this.workzone.removeEventListener("mousemove",this.onMove,!1),this.workzone.removeEventListener("mouseup",this.stopDrag,!1),this.$store.dispatch("changeZone",{x1:this.x1,x2:this.x2,y1:this.y1,y2:this.y2})},cursorPoint:function(t){return this.pt.x=t.clientX,this.pt.y=t.clientY,this.pt.matrixTransform(this.workzone.getScreenCTM().inverse())}},mounted:function(){this.pt=document.getElementById("tablature").createSVGPoint(),this.x1=this.$store.state.zone.x1,this.y1=this.$store.state.zone.y1,this.x2=this.$store.state.zone.x2,this.y2=this.$store.state.zone.y2},computed:Object(c["a"])(Object(c["a"])({},Object(E["b"])(["frets_spacing","string_spacing","padding","marker_width","marker_height","text_height","number_string","number_frets"])),{},{workzone:function(){return document.getElementById("workzone")}})},O=C,j=(n("1a8b"),Object(p["a"])(O,k,z,!1,null,"39c20c70",null)),T=j.exports,$=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("g",{attrs:{transform:"translate(0, 230)"}},[n("rect",{staticStyle:{fill:"transparent"},attrs:{width:this.$parent.frets_size,height:"30"},on:{click:function(e){return e.stopPropagation(),t.editTitle(e)}}}),n("transition",{attrs:{name:"fade"}},[t.editing?t._e():n("text",{attrs:{x:this.$parent.frets_size/2,y:"17","alignment-baseline":"middle","text-anchor":"middle"},on:{click:function(e){return e.stopPropagation(),t.editTitle(e)}}},[t._v(t._s(t.title))])]),n("transition",{attrs:{name:"fade"}},[t.editing?n("foreignObject",{attrs:{height:"30",width:this.$parent.frets_size},on:{click:function(t){t.stopPropagation()}}},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.title,expression:"title"}],ref:"textEdit",attrs:{type:"text",id:"title",width:this.$parent.frets_size},domProps:{value:t.title},on:{blur:function(e){return e.preventDefault(),e.stopPropagation(),t.doneEdit(e)},keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.doneEdit(e)},input:function(e){e.target.composing||(t.title=e.target.value)}}})]):t._e()],1)],1)},S=[],P={name:"Title",data:function(){return{title:"",editing:!1}},methods:{editTitle:function(){var t=this;this.editing=!0;var e=document.createElement("input");e.type="text",e.style.opacity="0",document.body.appendChild(e),e.focus(),setTimeout((function(){var n=t.$refs.textEdit;n.focus(),n.select(),n.setSelectionRange(0,9999),document.body.removeChild(e)}),0)},doneEdit:function(){this.editing=!1,this.$store.dispatch("changeTitle",this.title)}},mounted:function(){this.title=this.$store.state.title}},D=P,B=(n("668a"),Object(p["a"])(D,$,S,!1,null,"d2ea020e",null)),A=B.exports,M={name:"Tablature",components:{Key:x,Resizer:T,Title:A},data:function(){return{editingZone:!1,scale:3,svgHeight:800,xOffset:0}},methods:{startDrag:function(){},calculateSize:function(){var t=document.getElementById("workzone"),e=t.getBoundingClientRect().width/this.scale,n=t.getBoundingClientRect().height/this.scale,i=n/e,r=document.getElementById("main"),s=r.clientWidth,a=Math.min(window.innerHeight-80,650),o=a/s;this.scale=i<o?s/e:a/n,this.svgHeight=n*this.scale,this.xOffset=Math.round((s-e*this.scale)/2)}},computed:Object(c["a"])({number_frets:function(){return this.editingZone?this.number_frets_default:this.$store.state.zone.y2-this.$store.state.zone.y1},number_string:function(){return this.editingZone?this.number_string_default:this.$store.state.zone.x2-this.$store.state.zone.x1},string_size:function(){return this.frets_spacing*(this.number_frets+.5)},frets_size:function(){return this.string_spacing*(this.number_string+1)}},Object(E["b"])(["frets_spacing","string_spacing","padding","marker_width","marker_height","text_height","number_string_default","number_frets_default"])),mounted:function(){window.addEventListener("resize",this.calculateSize),this.calculateSize()},beforeDestroy:function(){window.removeEventListener("resize",this.calculateSize)}},R=M,V=(n("5523"),Object(p["a"])(R,a,o,!1,null,"02dcc4fd",null)),L=V.exports,I=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("header",[n("div",[t._v("Harpejji Tabs")]),n("div",{staticClass:"tools"},[n("ul",[n("li",[n("span",{staticClass:"icon download",attrs:{role:"button",title:"Download SVG"},on:{click:t.downloadSVG}})]),n("li",[n("span",{staticClass:"icon download",attrs:{role:"button",title:"Download PNG"},on:{click:t.downloadPNG}})]),n("li",[t._v("btn2")]),n("li",[t._v("btn3")])])])])},N=[],F=(n("d3b7"),n("3ca3"),n("ddb0"),n("2b3d"),{name:"Toolsbar",methods:{downloadSVG:function(){var t=this.$store.state.title,e=document.getElementById("workzone"),n=document.getElementById("tablature");e.style.transform="scale(1)";var i={width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height},r={width:n.getAttribute("width"),height:n.getAttribute("height")};n.setAttribute("width",i.width),n.setAttribute("height",i.height),G(document.getElementById("tablature"),"tablature_"+t+".svg"),e.style.transform="",n.setAttribute("width",r.width),n.setAttribute("height",r.height)},downloadPNG:function(){var t=document.getElementById("workzone"),e=document.getElementById("tablature");t.style.transform="scale(1)";var n={width:t.getBoundingClientRect().width,height:t.getBoundingClientRect().height},i={width:e.getAttribute("width"),height:e.getAttribute("height")};e.setAttribute("width",n.width),e.setAttribute("height",n.height),H(e,n,(function(t){var e=document.createElement("img");document.body.appendChild(e),e.style.width=n.width+"px",e.style.height=n.height+"px",e.src=t})),t.style.transform="",e.setAttribute("width",i.width),e.setAttribute("height",i.height)}}});function Z(t){t.setAttribute("xmlns","http://www.w3.org/2000/svg");var e=t.outerHTML,n='<?xml version="1.0" standalone="no"?>\r\n',i=new Blob([n,e],{type:"image/svg+xml;charset=utf-8"}),r=URL.createObjectURL(i);return console.log(r),r}function G(t,e){var n=Z(t),i=document.createElement("a");i.href=n,i.innerHTML="Download",document.body.appendChild(i)}function H(t,e,n){var i=Z(t);K(i,e,(function(t){n(t)}))}function K(t,e,n){var i=document.createElement("img");document.body.appendChild(i),i.onload=function(){var t=document.createElement("canvas"),r=window.devicePixelRatio||1;t.width=e.width*r,t.height=e.height*r,t.style.width=e.width+"px",t.style.height=e.height+"px",console.log(e);var s=t.getContext("2d");s.setTransform(r,0,0,r,0,0),s.imageSmoothingEnabled=!1,document.body.appendChild(t),s.drawImage(i,0,0,1*e.width,1*e.height);var a=t.toDataURL("image/png");n(a)},i.src=t}var U=F,X=(n("f0f3"),Object(p["a"])(U,I,N,!1,null,"8e6316e6",null)),Y=X.exports,J={name:"App",components:{Tablature:L,Toolsbar:Y}},W=J,q=(n("034f"),Object(p["a"])(W,r,s,!1,null,null,null)),Q=q.exports;i["a"].use(E["a"]);var tt=new E["a"].Store({state:{frets_spacing:60,string_spacing:30,padding:20,marker_width:15,marker_height:25,text_height:20,number_string_default:24,number_frets_default:15,zone:{x1:0,y1:0,x2:5,y2:3},title:"Am7b5"},getters:{},mutations:{changeZone:function(t,e){t.zone.x1=e.x1,t.zone.x2=e.x2,t.zone.y1=e.y1,t.zone.y2=e.y2},changeTitle:function(t,e){t.title=e}},actions:{changeZone:function(t,e){t.commit("changeZone",e)},changeTitle:function(t,e){t.commit("changeTitle",e)}}});i["a"].config.productionTip=!1,new i["a"]({store:tt,render:function(t){return t(Q)}}).$mount("#app")},"668a":function(t,e,n){"use strict";var i=n("f044"),r=n.n(i);r.a},"85ec":function(t,e,n){},a5b3:function(t,e,n){},da7b:function(t,e,n){},e0b1:function(t,e,n){},eab3:function(t,e,n){"use strict";var i=n("01fa"),r=n.n(i);r.a},f044:function(t,e,n){},f0f3:function(t,e,n){"use strict";var i=n("e0b1"),r=n.n(i);r.a}});
//# sourceMappingURL=app.0e3d4929.js.map