<h1 align="center">
  <a href="http://iqcaptcha.us.to/">
    <img src="demo/logo_489_text.png" alt="IQcaptcha">
  </a>
</h1>

<p align=center>
  <strong><a href="http://iqcaptcha.us.to/">Website</a></strong>
  | <strong><a href="http://iqcaptcha.us.to/repo/demo/demo.html">Demo</a></strong>
  | <strong><a href="http://iqcaptcha.us.to/forum">Forum</a></strong>
</p>

<p align="center">
IQcaptcha tests against IQ with Raven's progressive matrices and high school calculus. It is written to be fairly compatible with Google's reCAPTCHA v2, so that already existing plugins and implementations of reCAPTCHA can easily be switched to IQcaptcha.
</p>

[![demo1](demo/demo1_2.jpg)](#)
<p>&nbsp;</p>
<p align="center">
    <img src="demo/demo3.jpg" alt="screenshot" />
  </a>
</p>
<p>&nbsp;</p>


Installation
----------------------------------------------------------------
Put files onto webserver.
Run composer install.

Principle of Operation
----------------------------------------------------------------
To validate on the client side, api.js queries verify.php via XHR. Verify.php creates a PHP session and stores the state of verification in it. To validate on the backend, the server has to query verify.php with the session ID via http request. 

Although IQcaptcha accepts public and secret API keys, those **API keys are not required** and only named such for compatibility reasons. Instead they can be used as a site/application specific token (e.g. test.com-myforum-VZCck432random5jk372).

Verify.php will only validate wheter or not the client sitekey matches the backend parameter "secret" if provided, and if the session is valid. Please check in your backend if all the data-... parameters (wrongmax, sitekey, userid, etc.) you provided do actually match your client-side provided parameters.

Anyone is free to create arbitrary sessions with arbitrary parameters and also to read any sessions if the session key is known. This is not a potential security issue, no sensitive data is stored. But it does allow attackers to create a surplus of requests, until IP-based limits are reached. 

To solve this problem, you can provide "userid". (not implemented yet)

Usage
----------------------------------------------------------------


## License

    Copyright (C) 2021 Ballerburg9005

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
