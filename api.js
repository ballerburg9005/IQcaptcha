/**
 * @copyright Ballerburg9005 <https://github.com/ballerburg9005>
 * @license GNU General Public License, version 2 (GPL-3.0)
**/

const iqcaptcha_urlurl = new URL(document.currentScript.src);
const iqcaptcha_urlparms = new URLSearchParams(iqcaptcha_urlurl).search;
let iqcaptcha_url = iqcaptcha_urlurl.href.split('?')[0];
iqcaptcha_url = iqcaptcha_url.slice(0,iqcaptcha_url.lastIndexOf("/")+1);



function iq_captcha_create_classes(classes){
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


function iq_captcha_get_cookie(name) 
{
  const parts =  `; ${document.cookie}`.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  else return null;
}


function iq_captcha_urlencodedict(data)
{
	let out = [];
	for (var key in data) {
	    if (data.hasOwnProperty(key)) {
		out.push(key + '=' + encodeURIComponent(data[key]));
	    }
	}
	return out;
}


iq_captcha_create_classes([
['div.iq-captcha-element *, .iq-captcha-element *:before, .iq-captcha-element *:after' , `
box-sizing: revert;
`],
['div.iq-captcha-element *' , `margin: initial; padding: initial; letter-spacing: initial`],
['div.iq-captcha-element' , `
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
['div.iq-captcha-element-added', `display: table; height: 72px; width: 256px; position: absolute;`],
['div.iq-ldiv', `width: 158px; display: table-cell; height: 100%; vertical-align: middle`],
['div.iq-rdiv', `width: 84px; display: table-cell; height: 100%; vertical-align: middle; text-align: center`],
['div.iq-center-table' , `display: table;`],
['div.iq-center-td' , `display: table-cell; height: 100%; vertical-align: middle`],
['div.iq-reloadbox-div' , `
	display: inline-block;
	width: 36px;
	height: 36px;
	margin: auto;
	text-align: center;
	vertical-align: middle;
	line-height: 38px;
	font-size: 32pt;
	color: #888;
`],
['div.iq-checkbox-div' , `
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
['div.iq-checkbox-relative-anchor' , `position:relative; left: 0px; margin: 0; padding: 0;`],
['div.iq-logo-holder' , `display: inline-block;`],
['div.iq-logo' , `
	width: 48px;
	height: 48px;
	background: url(${iqcaptcha_url}/logo_256.png);
	background-size: 48px 48px;
	background-repeat: no-repeat;
`],
['div.iq-logo-text' , `font-size: 8pt; color: #666;`],

['div.iq-captcha-div-padding' , `
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

['div.iq-captcha-div' , `
	position: absolute;
	top: -48px;
	left: 48px;
	border: 1px solid #bbb;
	width: 400px;
	height: 500px;
	background-color: white;
	z-index: 99999;
`],
['div.iq-captcha-div-error' , `
	width: 368px;
	height: 44px;
	background-color: white;
	padding: 12px 12px;
	color: #f55;
	font-size: 12pt;
	font-face: bold;
`],

['div.iq-captcha-div-arrow' , `
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
['div.iq-captcha-div-arrow-top' , `
	left: 1px;
	border-width: 24px;
	border-color: transparent;
	border-right-color: #fff;
	z-index: 999991;
`],

['div.iq-captcha-above-footer' , `padding-left: 8px; padding-top: 4px; color: #f55; font-size: 10pt; text-align: left`],
['div.iq-captcha-footer' , `padding: 8px;`],
['div.iq-captcha-footer-left' , `float: left;`],
['div.iq-captcha-footer-right' , `float: right;`],
['button.iq-captcha-verify-button' , `
	height: 48px;
	font-size: 14pt;
	background-color: #093;
	padding: 0 12px;
	min-width: 96px;
	width: 96px;
	border: 0;
	border-radius: 3px;
	color: white !important;
	font-weight: bold;
	text-transform: initial;
	font-family: helvetica,arial,sans-serif;
`],	
['img.iq-captcha-img' , `padding-top: 6px;`],
['label.iq-captcha-answer-label' , `
  z-index: 2;
  float: right;
  position: absolute;
  width: 183px;		
  padding-right: 3px;
  padding-top: 4px;
  text-align: right;
  pointer-events: none;
  color: #999;
`],
['div.iq-captcha-answer-div' , `display: inline-block;`],
['input.iq-captcha-answer' , `
	height: 48px;
	font-size: 14px;
	background-color: #efe;
	width: 180px;
	padding-left: 6px;
	border: 1px solid #bbb;
	border-radius: 3px;
	color: black;
	font-family: helvetica,arial,sans-serif;
`],
['div.iq-lds-ring', `
  display: inline-block;
  position: relative;
  top: -8px;
  left: -8px;
  width: 48px;
  height: 48px;
`],
['div.iq-lds-ring div', `
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
['div.iq-lds-ring div:nth-child(1)', `animation-delay: -0.45s;`],
['div.iq-lds-ring div:nth-child(2)', `animation-delay: -0.3s;`],
['div.iq-lds-ring div:nth-child(3)', `animation-delay: -0.15s;`],
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
const giqcaptcha = new greCaptcha();

grecaptcha.render(null, null);

function iq_captcha_render(container, parms)
{
	if(container) 
	{
		console.dir(container);
		if(document.querySelector("#"+container))  container = document.querySelector("#"+container);
		for(x of document.querySelectorAll(".iq-captcha-element")) x.className.replace('iq-captcha-element', '');
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
		if(iq_captcha_get_cookie("iq-captcha-session"+sitekey) != null) document.querySelector(".iq-captcha-session").value = iq_captcha_get_cookie("iq-captcha-session"+sitekey);

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
	if(data.action === "validate")
		try { data['answer'] = eval(document.querySelector(".iq-captcha-answer").value); }
		catch(e) { return false; }

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

	for(x of ['data-sitekey', 'data-wrongmax', 'data-wrongtimeout', 'data-maxtime'])
	{
		data[x] = document.querySelector(".iq-captcha-element").getAttribute(x);
		if(!data[x]) data[x] = document.querySelector(".iq-captcha-element").parentElement.getAttribute(x); 		// h4xx!
		if(!data[x]) delete data[x];
	}

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

			} else iq_captcha_verify_xhr_error("server error: ", xhr.status.toString(), checkbox);

			var countdown = document.querySelector(".iq-captcha-countdown");

			var cntr = countdown && parseInt(countdown.innerHTML) > 0 ? parseInt(countdown.innerHTML) : -1;
			if(cntr > 0)
				var intervalID = setInterval(function(){
					countdown.innerHTML = cntr;
					if (--cntr === 0 || !countdown ) { window.clearInterval(intervalID); return false; }
				
				}, 1000);

            };
	    xhr.onerror = function () { 
		iq_captcha_verify_xhr_error("IQcaptcha backend unreachable", "", checkbox);
	    };
	    xhr.ontimeout = function () { 
		iq_captcha_verify_xhr_error("server timeout", "", checkbox);
	    };

	data['frontend'] = "true";
	xhr.send(iq_captcha_urlencodedict(data).join('&'));


}


function iq_captcha_verify_xhr_error(error, code, checkbox)
{
	if(code === "580") code = "Please run `composer install` in the IQcaptcha directory (same as api.js).";
	iq_captcha_verify_show_error(error+code);
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


function iq_captcha_eval_inputbox(box)
{
	let myeval = "";
	let mystring = document.querySelector(".iq-captcha-answer").value;
	for (var i = mystring.length-1; i >= 0; i--) 
		if(isNaN(+mystring[i])) mystring = mystring.slice(0, mystring.length-1);
		else break;
	
	try { myeval = eval(mystring); } 
	catch(e) { }

	if(isNaN(+myeval)) myeval = "";
	document.querySelector(".iq-captcha-answer-label").innerHTML = "="+myeval;
	
}


function iq_captcha_reload_challenge()
{
	document.querySelector(".iq-checkbox-relative-anchor").innerHTML = "";
	iq_captcha_verify({action: 'create_session'});
}


function iq_captcha_verify_populate(re)
{
	var old_viewport_height = Math.max( document.body.scrollHeight, document.body.offsetHeight, 
					document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );

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
	<img src="data:image/jpeg;charset=utf-8;base64, ${re.text}" class="iq-captcha-text" alt="a math problem formulated in text">
	</center>
	<div class="iq-captcha-above-footer"><span style="color: #666">Hint: use input field as calculator.</span> 
	</div>
	<div class="iq-captcha-footer"> 
		<div class="iq-captcha-footer-left">
			<div class="iq-captcha-answer-div">
				<label for="iq-captcha-answer" class="iq-captcha-answer-label">=0</label>
				<input type="text" class="iq-captcha-answer" id="iq-captcha-answer" onkeyup="iq_captcha_eval_inputbox(this);">
			</div>
		</div>
		<div class="iq-captcha-footer-right"> 
			<div class="iq-reloadbox-div" onclick="iq_captcha_reload_challenge();">
				<div style="position: relative"><div style="position: absolute; top: 0px; left: 0px; pointer-events: none;">&#8635;</div></div>
			</div>
			<button type="button" class="iq-captcha-verify-button" id="iq-captcha-verify-button" onclick="iq_captcha_verify({action: 'validate' }); return false;">Verify</button>
		</div>
		
	</div>
	`);
	const main_form = document.querySelector(".iq-captcha-session").form;
	if(main_form) main_form.addEventListener('submit', iq_captcha_verify_and_preventDefault);
	document.querySelector(".iq-captcha-answer").focus();

	window.onmousedown = function(e) {
		let x = e.target;
		do { if(x.id === 'iq-captcha-element-added') break; x = x.parentElement; } while(x);
		const anchor = document.querySelector(".iq-checkbox-relative-anchor"); 
		if(x && anchor) anchor.style.display = 'block'; 
		else anchor.style.display = "none";
			}; 

	/* resize stuff */
	var x = 0;
	var oldheight = -1337;
	var oldviewportheight = old_viewport_height;
	var intervalID = setInterval(function(){
		const button = document.querySelector(".iq-captcha-verify-button");

		if(++x === 5 ) { window.clearInterval(intervalID); return false; }
		if(!button) return false;

		const button_rect = button.getBoundingClientRect();
		const captcha_rect = w['iq-captcha-div'].getBoundingClientRect();
		const arrow_rect = document.querySelector(".iq-captcha-div-arrow").getBoundingClientRect();
	
		const anchor_margin = 12+(arrow_rect.bottom-arrow_rect.top);

		const new_viewport_height = Math.max( document.body.scrollHeight, document.body.offsetHeight, 
						document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );

		if(parseInt(button_rect.bottom - captcha_rect.top) != oldheight || new_viewport_height > oldviewportheight)
		{
			w['iq-captcha-div'].style.width = (12 + document.querySelector(".iq-captcha-img").naturalWidth) + "px";	
			w['iq-captcha-div'].style.height = (button_rect.bottom - captcha_rect.top + 6) + "px" ;
			w['iq-captcha-div'].style.top = (- anchor_margin - (parseInt(w['iq-captcha-div'].style.height)*0.5)) + "px";
			// if it "overflows" at the bottom
			//console.log(w['iq-captcha-div'].getBoundingClientRect().bottom, window.scrollY, new_viewport_height, old_viewport_height);
			if(w['iq-captcha-div'].getBoundingClientRect().bottom + window.scrollY > old_viewport_height) 
				w['iq-captcha-div'].style.top = (parseInt(w['iq-captcha-div'].style.top) 
								- (w['iq-captcha-div'].getBoundingClientRect().bottom + window.scrollY - old_viewport_height)) + "px";
			// if it moves above the anchor
			if(w['iq-captcha-div'].getBoundingClientRect().bottom < arrow_rect.top+anchor_margin)
				w['iq-captcha-div'].style.top = (anchor_margin - parseInt(w['iq-captcha-div'].style.height)) + "px";
			// if it moves above the beginning of page
			if(w['iq-captcha-div'].getBoundingClientRect().top + window.scrollY < 12) 
				w['iq-captcha-div'].style.top = (parseInt(w['iq-captcha-div'].style.top) 
								- (w['iq-captcha-div'].getBoundingClientRect().top + window.scrollY) + 12) + "px";
			// just for padding to the bottom of page
			w['iq-captcha-div-padding'].style.left = parseInt(w['iq-captcha-div'].style.left) + "px";
			w['iq-captcha-div-padding'].style.top = parseInt(w['iq-captcha-div'].style.top) + "px";
			w['iq-captcha-div-padding'].style.width = 1 + "px";
			w['iq-captcha-div-padding'].style.height = (parseInt(w['iq-captcha-div'].style.height) + 16) + "px";

			oldheight = parseInt(button_rect.bottom - captcha_rect.top);
			oldviewportheight = new_viewport_height;
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


