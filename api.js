/**
 * @copyright Ballerburg9005 <https://github.com/ballerburg9005>
 * @license GNU General Public License, version 2 (GPL-3.0)
**/


var iqcaptcha_scripts = [];
for(s of document.querySelectorAll("script")) if(s.src.length > 6) iqcaptcha_scripts.push(s);
const iqcaptcha_urlurl = new URL(iqcaptcha_scripts[iqcaptcha_scripts.length - 1].src);
const iqcaptcha_urlparms = new URLSearchParams(iqcaptcha_urlurl).search;
let iqcaptcha_url = iqcaptcha_urlurl.href.split('?')[0];
iqcaptcha_url = iqcaptcha_url.slice(0,iqcaptcha_url.lastIndexOf("/")+1);


function createClasses(classes){
	var style = document.createElement('style');
	style.type = 'text/css';
	document.querySelector('head').appendChild(style);

	for(const [name, rules] of classes)
	{
	    if(!(style.sheet||{}).insertRule) 
		(style.styleSheet || style.sheet).addRule(name, rules);
	    else
		style.sheet.insertRule(name+"{"+rules+"}",0);
	}
}


function getCookie(name) 
{
  const parts =  `; ${document.cookie}`.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  else return null;
}


function urlencodedict(data)
{
	let out = [];
	for (var key in data) {
	    if (data.hasOwnProperty(key)) {
		out.push(key + '=' + encodeURIComponent(data[key]));
	    }
	}
	return out;
}


createClasses([
['.iq-captcha-element, .iq-captcha-element :before, .iq-captcha-element :after' , `
box-sizing: unset;
`],
['.iq-captcha-element' , `
	color: black;
	width: 256px;
	height: 72px;
	margin: 4px;
	background-color: #eee;
	border: 1px solid #ddd;
	border-radius: 3px;
	font-family: helvetica,arial,sans-serif;
	font-size: 12pt;
	line-height: normal;
`],
['.iq-captcha-element-added', `display: table; height: 72px; width: 256px; position: absolute;`],
['.iq-ldiv', `width: 158px; display: table-cell; height: 100%; vertical-align: middle`],
['.iq-rdiv', `width: 84px; display: table-cell; height: 100%; vertical-align: middle; text-align: center`],
['.iq-center-table' , `display: table;`],
['.iq-center-td' , `display: table-cell; height: 100%; vertical-align: middle`],
['.iq-checkbox-div' , `
	width: 24px;
	height: 24px;
	border: 2px solid #bbb;
	background-color: #fff;
	margin: 0 12px;
	border-radius: 3px;
	text-align: center;
	vertical-align: middle;
	line-height: 24px;
`],
['.iq-checkbox-relative-anchor' , `position:relative; left: 0px; margin: 0; padding: 0;`],
['.iq-logo-holder' , `display: inline-block;`],
['.iq-logo' , `
	width: 48px;
	height: 48px;
	background: url(${iqcaptcha_url}/logo_48.png);
	background-repeat: no-repeat;
`],
['.iq-logo-text' , `font-size: 8pt; color: #666;`],

['.iq-captcha-div-padding' , `
	z-index: -1;
	pointer-events: none;
	position: absolute;
	top: -48px;
	left: 48px;
	border: 0;
	width: 2px;
	height: 500px;
	background-color: transparent;
`],

['.iq-captcha-div' , `
	position: absolute;
	top: -48px;
	left: 48px;
	border: 1px solid #bbb;
	width: 400px;
	height: 500px;
	background-color: white;
	z-index: 99999;
`],
['.iq-captcha-div-error' , `
	width: 368px;
	height: 70px;
	background-color: white;
	padding: 24px 12px;
	color: #f55;
	font-size: 12pt;
	font-face: bold;
`],

['.iq-header' , `margin-bottom: 0px; margin-left: 12px; margin-right: 12px; margin-top: 8px; color: black; font-size: 16pt; display: inline-block`],
['.iq-captcha-div-arrow' , `
	position: absolute;
	top: -38px;
	left: 0px;
	border-color: transparent;
	border-right-color: #aaa;
	border-style: solid;
	width: 0px;
	height: 0px;
	border-width: 24px;
	pointer-events: none;
	z-index: 999990;
`],
['.iq-captcha-div-arrow-top' , `
	left: 1px;
	border-width: 24px;
	border-color: transparent;
	border-right-color: #fff;
	z-index: 999991;
`],

['.iq-captcha-above-footer' , `padding-left: 8px; padding-top: 4px; color: #f55; font-size: 10pt`],
['.iq-captcha-footer' , `padding: 8px;`],
['.iq-captcha-footer-left' , `float: left;`],
['.iq-captcha-footer-right' , `float: right;`],
['button.iq-captcha-verify-button' , `
	height: 48px;
	font-size: 14pt;
	background-color: #093;
	padding: 0 12px;
	min-width: 100px;
	border: 0;
	border-radius: 3px;
	color: white !important;
	font-weight: bold;
	text-transform: initial;
	font-family: helvetica,arial,sans-serif;
`],	
['.iq-captcha-img' , `padding-top: 6px;`],
['input.iq-captcha-answer' , `
	height: 48px;
	font-size: 14px;
	background-color: #efe;
	padding: 0 12px;
	min-width: 100px;
	border: 1px solid #bbb;
	border-radius: 3px;
	color: black;
	font-family: helvetica,arial,sans-serif;
`],
['.iq-lds-ring', `
  display: inline-block;
  position: relative;
  top: -8px;
  left: -8px;
  width: 48px;
  height: 48px;
`],
['.iq-lds-ring div', `
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 40px;
  height: 40px;
  border: 8px solid #093;
  border-radius: 50%;
  animation: iq-lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #093 transparent transparent transparent;
`],
['.iq-lds-ring div:nth-child(1)', `animation-delay: -0.45s;`],
['.iq-lds-ring div:nth-child(2)', `animation-delay: -0.3s;`],
['.iq-lds-ring div:nth-child(3)', `animation-delay: -0.15s;`],
['@keyframes iq-lds-ring', `
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`],

].reverse());

class greCaptcha {
	
	render(container, parameters)
	{
		iq_captcha_render(container, parameters)
	}
}
const grecaptcha = new greCaptcha();


grecaptcha.render(null, null);

function iq_captcha_render(container, parms)
{
	if(container) 
	{
		for(x in document.querySelectorAll(".iq-captcha-element")) x.className.replace('iq-captcha-element', '');
		let element = document.createElement("div");
		element.className = "iq-captcha-element";
		container.appendChild(element);

		for(var p in parms) container.setAttribute("data-"+p, parms[p]);
		
		container.style.overflow = "auto";
	}
	let cntr = 0;
	const elements = Array.prototype.slice.call(document.querySelectorAll(".iq-captcha-element"), 0)
			.concat(Array.prototype.slice.call(document.querySelectorAll(".g-iqcaptcha"), 0))
			.concat(Array.prototype.slice.call(document.querySelectorAll(".g-recaptcha"), 0))
			;
	for(div of elements)
	{
		div.className.replace('iq-captcha-element', '');
		if(cntr > 0) { continue; } cntr++;
		div.className = div.className + ' iq-captcha-element ';

		div.insertAdjacentHTML('beforeend', `
			<div id="iq-captcha-element-added" class="iq-captcha-element-added">
				<div class="iq-ldiv">
					<div class="iq-center-table">
						<div class="iq-center-td">
							<div class="iq-checkbox-div" id="iq-checkbox-div" onclick="iq_captcha_verify({action: 'create_session'});">
							</div>
							<div class="iq-checkbox-relative-anchor" id="iq-checkbox-relative-anchor">
							</div>
						</div>
						<div class="iq-center-td">
							I'm not stupid
						</div>
					</div>
				</div>
				<div class="iq-rdiv">
					<div class="iq-logo-holder">
						<div class="iq-logo">
						</div>
						<div class="iq-logo-text">
						IQcaptcha
						</div>
					</div>
				</div>

				<input type="hidden" class="iq-captcha-session" id="iq-captcha-session" name="iq-captcha-session" value="" data-validated="false">
				<input type="hidden" class="" id="g-recaptcha-response" name="g-recaptcha-response" value="">
				<input type="hidden" class="" id="g-iqcaptcha-response" name="g-iqcaptcha-response" value="">
			</div>

		`);
		let sitekey = document.querySelector(".iq-captcha-element").getAttribute('data-sitekey'); sitekey = sitekey?"-"+sitekey:"";
		if(getCookie("iq-captcha-session"+sitekey) != null) document.querySelector(".iq-captcha-session").value = getCookie("iq-captcha-session"+sitekey);

		const main_form = document.querySelector(".iq-captcha-session").form;
		if(main_form) main_form.addEventListener('submit', function(event) { if(!iq_captcha_prevent_submit()) event.preventDefault(); });
	}
}

function iq_captcha_verify_and_preventDefault(event) 
{ 
	iq_captcha_verify({action: 'validate'}); 
	event.preventDefault(); 
}


function iq_captcha_verify(data)
{
	const verify_button = document.querySelector(".iq-captcha-verify-button");
	if(verify_button) 
		if(verify_button.disabled) return false;
		else verify_button.disabled = true;

/*	if(document.querySelector(".iq-checkbox-div").style["background-color"] === "rgb("+0xCC+", "+0xCC+", "+0xCC+")") 
	{
		document.querySelector(".iq-checkbox-div").style["background-color"] = "#fff";
		const anchor = document.querySelector(".iq-checkbox-relative-anchor");
		while (anchor.firstChild) 
		{
			anchor.removeChild(anchor.firstChild);
		}
		return false;
	}
*/
	data.session = document.querySelector(".iq-captcha-session").value;

	for(x of ['#g-recaptcha-response', '#g-iqcaptcha-response']) document.querySelector(x).value = data.session;

	for(x of ['data-sitekey', 'data-wrongmax', 'data-wrongtimeout'])
	{
		data[x] = document.querySelector(".iq-captcha-element").getAttribute(x);
		if(!data[x]) delete data[x];
	}

	if(data.action === "validate")
		data['answer'] = document.querySelector(".iq-captcha-answer").value;

	const checkbox = document.querySelector(".iq-checkbox-div");

	checkbox.style["background-color"] = "#ccc";
	checkbox.innerHTML = `<div class="iq-lds-ring"><div></div><div></div><div></div><div></div></div>`;
	

	checkbox.style["color"] = "#999";
	checkbox.style["pointer-events"] = "none";

	let xhr = new XMLHttpRequest();
	xhr.timeout = 12000;
	xhr.open("POST", `${iqcaptcha_url}/verify.php`, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function () {
                if (xhr.readyState === 4)
			if(xhr.status === 200) 
			{
				checkbox.innerHTML = "";
				const re = JSON.parse(xhr.responseText);

				if(re.validated) data.action = "validate";
				switch(data.action)
				{
					case "create_session":
						if(!re.aborted)
						{
							let sitekey = document.querySelector(".iq-captcha-element").getAttribute('data-sitekey'); 
							sitekey = sitekey?"-"+sitekey:"";
							iq_captcha_verify_populate(re);
							if(re.session) document.cookie = `iq-captcha-session${sitekey}=${re.session}`;
							document.querySelector(".iq-captcha-session").value = re.session;
						}
						else 
						{
							iq_captcha_verify_show_error(re.error);
							checkbox.style["pointer-events"] = "auto";
						}
					break;
					case "validate":
						iq_captcha_verify_validate(re);
						
					break;
				}

			const verify_button = document.querySelector(".iq-captcha-verify-button");
			if(verify_button) verify_button.disabled = false;

			} else iq_captcha_verify_xhr_error("server error: "+xhr.status, checkbox);

			var countdown = document.querySelector(".iq-captcha-countdown");

			var cntr = countdown && parseInt(countdown.innerHTML) > 0 ? parseInt(countdown.innerHTML) : -1;
			if(cntr > 0)
				var intervalID = setInterval(function(){
					countdown.innerHTML = cntr;
					if (--cntr === 0 || !countdown ) { window.clearInterval(intervalID); return false; }
				
				}, 1000);

            };
	    xhr.onerror = function () { 
		iq_captcha_verify_xhr_error("IQcaptcha backend unreachable", checkbox);
	    };
	    xhr.ontimeout = function () { 
		iq_captcha_verify_xhr_error("server timeout", checkbox);
	    };

	data['frontend'] = "true";
	xhr.send(urlencodedict(data).join('&'));


}


function iq_captcha_verify_xhr_error(error, checkbox)
{
	iq_captcha_verify_show_error(error);
	checkbox.innerHTML = "E";
	checkbox.style["background-color"] = "#fcc";
	checkbox.style["pointer-events"] = "auto";

	const verify_button = document.querySelector(".iq-captcha-verify-button");
	if(verify_button) verify_button.disabled = false;

}


function iq_captcha_verify_validate(re) 
{
	if(re.validated)
	{
		const checkbox = document.querySelector(".iq-checkbox-div");
		checkbox.style["background-color"] = "#fff";
		checkbox.style["font-size"] = "64pt";
		checkbox.style["color"] = "#093";
		checkbox.innerHTML = `<div style="position: relative"><div style="position: absolute; top: -4px; left: -12px;">&#10003;</div></div>`;

		const anchor = document.querySelector(".iq-checkbox-relative-anchor");
		while (anchor.firstChild) 
		{
			anchor.removeChild(anchor.firstChild);
		}

		const main_form = document.querySelector(".iq-captcha-session").form;
		if(main_form) main_form.removeEventListener('submit', iq_captcha_verify_and_preventDefault);
		document.querySelector(".iq-captcha-session").setAttribute('data-validated', 'true');
		
	}
	else 
	{
		document.querySelector(".iq-captcha-answer").style['background-color'] = "#fcc";
		document.querySelector(".iq-captcha-above-footer").innerHTML = re.error;
	}
}

/* it blinks!*/
function iq_captcha_prevent_submit()
{
	if(document.querySelector(".iq-captcha-verify-button")) return false;
	else try 
	{
		if(document.querySelector(".iq-captcha-session").getAttribute('data-validated') === "true") return true;
		else 
		{
			const checkbox = document.querySelector(".iq-checkbox-div");
			let x = 0;
			const oldcolor = checkbox.style["background-color"];
			if(oldcolor != "rgb("+0xFF+", "+0xCC+", "+0xCC+")") 
				var intervalID = setInterval(function(){
					if (++x === 7 || !checkbox ) { window.clearInterval(intervalID); checkbox.style["background-color"] = oldcolor; return false; }
					if(oldcolor === checkbox.style["background-color"]) checkbox.style["background-color"] = "#fcc";
					else checkbox.style["background-color"] = oldcolor;
					// TODO bug: stays red because interval is called too much
					
				}, 200);
		}
	} catch(e) { console.log(e);}
	return false;
}

function iq_captcha_verify_show_error(error)
{
	let w = {};
	for(x of ['iq-captcha-div-padding', 'iq-captcha-div-arrow', 'iq-captcha-div', 'iq-captcha-div-arrow-top'])
	{
		w[x] = document.createElement("div");
		w[x].className = x;
		document.querySelector(".iq-checkbox-relative-anchor").appendChild(w[x]);
	}	
	w['iq-captcha-div'].insertAdjacentHTML( 'beforeend' , `
		${error}
	`);
	w['iq-captcha-div'].className = 'iq-captcha-div iq-captcha-div-error';
}

function iq_captcha_verify_populate(re)
{
	let w = {};
	for(x of ['iq-captcha-div-padding', 'iq-captcha-div-arrow', 'iq-captcha-div', 'iq-captcha-div-arrow-top'])
	{
		w[x] = document.createElement("div");
		w[x].className = x;
		document.querySelector(".iq-checkbox-relative-anchor").appendChild(w[x]);
	}

	w['iq-captcha-div-arrow-top'].className = 'iq-captcha-div-arrow-top iq-captcha-div-arrow';

	w['iq-captcha-div'].insertAdjacentHTML( 'beforeend' , `
	<center>
	<img src="data:image/jpeg;charset=utf-8;base64, ${re.image}" class="iq-captcha-img" alt="a captcha image showing patterns or values to solve">
	<div class="iq-header">${re.text}</span>
	</center>
	<div class="iq-captcha-above-footer"> &nbsp; 
	</div>
	<div class="iq-captcha-footer"> 
		<div class="iq-captcha-footer-left">
		<input type="text" class="iq-captcha-answer" id="iq-captcha-answer">
		</div>
		<div class="iq-captcha-footer-right"> 
			<button type="button" class="iq-captcha-verify-button" id="iq-captcha-verify-button" onclick="iq_captcha_verify({action: 'validate' }); return false;">Verify</button>
		</div>
		
	</div>
	`);
	const main_form = document.querySelector(".iq-captcha-session").form;
	if(main_form) main_form.addEventListener('submit', iq_captcha_verify_and_preventDefault);
	document.querySelector(".iq-captcha-answer").focus();

	window.onmouseup = function(e) {
		let x = e.target;
		do { if(x.id === 'iq-captcha-element-added') break; x = x.parentElement; } while(x);
		const anchor = document.querySelector(".iq-checkbox-relative-anchor"); 
		if(x && anchor) anchor.style.display = 'block'; 
		else anchor.style.display = "none";
			}; 
	/* resize stuff */

	var x = 0;
	var oldheight = -1337;
	var intervalID = setInterval(function(){
		const button = document.querySelector(".iq-captcha-verify-button");

		if (++x === 5 || !button ) { window.clearInterval(intervalID); return false; }

		var rectb = button.getBoundingClientRect();
		var rectc = w['iq-captcha-div'].getBoundingClientRect();
		var recto = document.querySelector(".iq-checkbox-div").getBoundingClientRect();

		if(parseInt(rectb.bottom - rectc.top) != oldheight)
		{
			oldheight = parseInt(rectb.bottom - rectc.top);
			w['iq-captcha-div'].style.width = (12 + document.querySelector(".iq-captcha-img").naturalWidth) + "px";	
			w['iq-captcha-div'].style.height = (rectb.bottom - rectc.top + 6) + "px" ;
			w['iq-captcha-div'].style.top = (-parseInt(w['iq-captcha-div'].style.height)*0.5) + "px";

			// if it "overflows" at the bottom
			const viewport_height = Math.max(w['iq-captcha-div'].clientHeight || 0, window.innerHeight || 0);
			if(w['iq-captcha-div'].getBoundingClientRect().bottom + window.scrollY > viewport_height) 
				w['iq-captcha-div'].style.top = (parseInt(w['iq-captcha-div'].style.top) - (w['iq-captcha-div'].getBoundingClientRect().bottom - viewport_height + 32)) + "px";

			console.log("w: "+w['iq-captcha-div'].style.width + ", h: "+w['iq-captcha-div'].style.height);
			console.log("viewport_height: "+ viewport_height + ", scrollY: "+window.scrollY);
			console.log("bottom: "+ w['iq-captcha-div'].getBoundingClientRect().bottom + ", top: "+w['iq-captcha-div'].getBoundingClientRect().top);

			// if it moves above the anchor
			if(w['iq-captcha-div'].getBoundingClientRect().bottom < w['iq-captcha-div-arrow'].getBoundingClientRect().top)
				w['iq-captcha-div'].style.top = (20 -parseInt(w['iq-captcha-div'].style.height)) + "px";

			// if it moves above the beginning of page
			if(w['iq-captcha-div'].getBoundingClientRect().top + window.scrollY < 12) 
				w['iq-captcha-div'].style.top = (parseInt(w['iq-captcha-div'].style.top) - (w['iq-captcha-div'].getBoundingClientRect().top + window.scrollY) + 12) + "px";

			// just for padding to the bottom of page
			w['iq-captcha-div-padding'].style.left = parseInt(w['iq-captcha-div'].style.left) + "px";
			w['iq-captcha-div-padding'].style.top = parseInt(w['iq-captcha-div'].style.top) + "px";
			w['iq-captcha-div-padding'].style.width = 1 + "px";
			w['iq-captcha-div-padding'].style.height = (parseInt(w['iq-captcha-div'].style.height) + 16) + "px";
		}
	}, 50);
}

/*	const ldiv = document.createElement("div");
	ldiv.className = "ldiv";
	div.appendChild(ldiv);
	
		

	const rdiv = document.createElement("div");
	rdiv.className = "rdiv";
	div.appendChild(rdiv);
.*/


