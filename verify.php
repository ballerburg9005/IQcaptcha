<?php
/**
 * @copyright Ballerburg9005 <https://github.com/ballerburg9005>
 * @license GNU General Public License, version 2 (GPL-3.0)
**/

// TODO: force users into sessions. Currently, the client can open a maximum of 50 sessions (limit via IP address) 
// 		and present any one of them as valid to the server, as long as it has been success correctly plus the 
//		server can distinguish which parameters were used. If the site provides a userid + sitekey, then each 
//		user can be limited to 1 session only.
// TODO: sessions don't seem to disappear after 2 hours? How long really?

$PRODUCTION = false;

$IP_MAXUSERS = 50;
$IP_MAXTRANSIENCE = 10*60;
$IP_TIME = time();

// ini_set('session.gc_maxlifetime', 60*24); // this affects the entire server!

if(!$PRODUCTION) error_reporting(E_ALL);

require("solutions.php");

if(file_exists(__DIR__ . '/vendor/autoload.php'))
	require_once(__DIR__ . '/vendor/autoload.php');
else
{
	error_log($_SERVER["SCRIPT_FILENAME"]. ": Please run `composer install` in the IQcaptcha directory.");
	header($_SERVER['SERVER_PROTOCOL'] . ' 580 Please run `composer install` in the IQcaptcha directory.', true, 580);
	die();
}

$response = ['error' => "Unknown Error.", 'aborted' => false ];

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

ini_set("session.use_cookies", 0);

$gcompat = ($_POST['response']??$_GET['response']??"") === "" ? "session" : "response";
session_id(substr(preg_replace('/[[:^print:]]/', '', $_POST[$gcompat]??$_GET[$gcompat]??""), 0, 1024));
session_start();

// destroy session if too old
if(isset($_SESSION['v']) && time() > $_SESSION['v']['create_time']+$_SESSION['v']['maxtime'])
	foreach ($_SESSION as $k => $v)
		unset($_SESSION[$k]);

if(($_POST['frontend']??"") == "true")
{
	sleep(1);

	$response['validated'] = false;

	if(isset($_SESSION['w']) && $_SESSION['w']['wrongcounter'] > $_SESSION['v']['wrongmax'] && time() < $_SESSION['w']['lasttime'] + $_SESSION['v']['wrongtimeout'])
	{
		$response['error'] = "Too many wrong answers! Try again in <span class='iq-captcha-countdown'>"
					.($_SESSION['w']['lasttime'] + $_SESSION['v']['wrongtimeout'] - time()).'</span>s.';
		$response['aborted'] = true;
	}
	else
	{
		if(isset($_SESSION['w']) && $_SESSION['w']['lasttime'] != 0 ) 
		{
			$_SESSION['w']['lasttime'] = 0;
			$_SESSION['w']['wrongcounter'] = 1;
		}
	
		switch($_POST['action'])
		{
		case "create_session":
			if(($_SESSION['v']['success']??false))
			{
				$response['error'] = "";
				$response['validated'] = true;
			}
			else
			{
				do $pick = rand(0,count($s)-1); while(!isset($s[$pick]));
				$modified_answer = generate_polynomial($s[$pick]['a'], 'pattern');

				$imagick_ravens = generate_ravens_imagick($s, $pick);
				$imagick_text = generate_text_imagick($modified_answer['text'], 20);

				$imagick_ravens->borderImage("rgb(255,255,255)", 16,16);
				$imagick_ravens->waveImage(rand(4,8), rand(80,120));
				$imagick_ravens->cropImage($imagick_ravens->getImageWidth()-32, $imagick_ravens->getImageHeight()-32, 16, 16);

				$imagick_ravens = distort_perspective($imagick_ravens, 100,250);
//				$imagick_ravens->compositeImage(generate_noise_imagick(0.2, $imagick_ravens->getImageWidth(), $imagick_ravens->getImageHeight()), Imagick::COMPOSITE_BLEND, 0, 0);
				$imagick_ravens->compositeImage(generate_noise_imagick(0.4, $imagick_ravens->getImageWidth(), $imagick_ravens->getImageHeight()), Imagick::COMPOSITE_MULTIPLY, 0, 0);
//`				$imagick_ravens->compositeImage(generate_noise_imagick(0.4, $imagick_ravens->getImageWidth(), $imagick_ravens->getImageHeight()), Imagick::COMPOSITE_MULTIPLY, 0, 0);


				$imagick_text->compositeImage(generate_noise_imagick(0.4, $imagick_text->getImageWidth(), $imagick_text->getImageHeight()), Imagick::COMPOSITE_BLEND, 0, 0);
//				$imagick_text->compositeImage(generate_noise_imagick(0.4, $imagick_text->getImageWidth(), $imagick_text->getImageHeight()), Imagick::COMPOSITE_MULTIPLY, 0, 0);
//				$imagick_text->compositeImage(generate_noise_imagick(0.4, $imagick_text->getImageWidth(), $imagick_text->getImageHeight()), Imagick::COMPOSITE_MULTIPLY, 0, 0);

				$imagick_text->resizeImage($imagick_ravens->getImageWidth(), $imagick_text->getImageHeight(), Imagick::FILTER_LANCZOS,1);

				$imagick_text->waveImage(0.5, 10);

				$response['image'] = base64_encode($imagick_ravens->getImageBlob());
				$response['text'] = base64_encode($imagick_text->getImageBlob()); ;//." ".$modified_answer['answer'];
				$response['session'] = session_id();
				$response['error'] = "";
				$_SESSION['v'] = [ 
					'success' => false,
					'sitekey' =>  $_POST['data-sitekey']??"",
					'hostname' =>  $_POST['hostname']??"",
					'stock_parameters' => isset($_POST['data-wrongmax'], $_POST['data-wrongtimeout'], $_POST['data-maxtime']) ? false : true,
					'wrongmax' => max(3, min(10, $_POST['data-wrongmax']??0)),
					'wrongtimeout' => max(3*60, min(1000*60, $_POST['data-wrongtimeout']??0)),
					'challenge_ts' => $IP_TIME, // TODO make google alike timestamp here + docs
					'create_time' => $IP_TIME,
					'maxtime' => max(3*60, min(1440*60, $_POST['data-maxtime']??1800)),
						];
				$_SESSION['w'] = [ 
					'wrongcounter' => $_SESSION['w']['wrongcounter'] ?? 0 + 1,
					'lasttime' => 0,
					'answer' => strval($modified_answer['answer']),
						];
				$IP_ADDR = "add";
			}
		break;
		case "validate":
			if(isset($_SESSION['w']))
			{
				if($_POST['answer'] === $_SESSION['w']['answer'])
				{
					$response['error'] = "";
					$response['validated'] = true;
					$_SESSION['v']['success'] = true;
					$_SESSION['w']['wrongcounter'] = 0;
					$IP_ADDR = "remove";
					$IP_TIME = $_SESSION['v']['create_time'];
				}
				else 
				{
					$response['error'] = "Wrong solution!";
					$_SESSION['w']['wrongcounter']++;
					if($_SESSION['w']['wrongcounter'] > $_SESSION['v']['wrongmax']) 
					{
						$_SESSION['w']['lasttime'] = time();
						$response['aborted'] = true;
					}
				}
			}
			else $response = ['error' => "Attempted validation without valid challenge.", 'aborted' => true]; 
		break;	
		}
	}
}
else	// backend
{
	$response = ['error' => "No valid session provided."];	
	if(isset($_GET['response']) || isset($_GET['session'])) $VAL = $_GET; 
	else if(isset($_POST['response']) || isset($_POST['session'])) $VAL = $_POST; 

	if(isset($VAL))
	{
		if(isset($_SESSION['v'])) $response = $_SESSION['v'];
	
		if((isset($VAL['secret']) && $VAL['secret'] !== $_SESSION['v']['sitekey'])
		|| (isset($VAL['sitekey']) && $VAL['sitekey'] !== $_SESSION['v']['sitekey']))
			$response = ['error' => "Secret mismatches sitekey provided by client.",
					'success' => false,
					'challenge_ts' => $_SESSION['v']['challenge_ts'],
					'hostname' => $_SESSION['v']['hostname'],
					];
	}
}

/* anti brute force - oh, hi!; IPv6 people: get a real IP address! */
$oldsessionid = session_id();
session_write_close();
session_id("da4a6221426c1e5ee5a51f90a46ffd5b");
session_start();
if(!isset($_SESSION[$_SERVER['REMOTE_ADDR']])) $_SESSION[$_SERVER['REMOTE_ADDR']] = [];
if(($IP_ADDR??"") == "add") $_SESSION[$_SERVER['REMOTE_ADDR']] += [$IP_TIME];
if(($IP_ADDR??"") == "remove") unset($_SESSION[$_SERVER['REMOTE_ADDR']][array_search($IP_TIME, $_SESSION[$_SERVER['REMOTE_ADDR']])]);
foreach($_SESSION[$_SERVER['REMOTE_ADDR']] as $k => $v) if($v+$IP_MAXTRANSIENCE > time()) unset($_SESSION[$_SERVER['REMOTE_ADDR']][$k]);
$toomanyips = count($_SESSION[$_SERVER['REMOTE_ADDR']]) > $IP_MAXUSERS ? true : false;
session_write_close();
session_id($oldsessionid);
session_start();

if($toomanyips)
{ 
	$response = ['error' => "Too many requests per IP address!", 'aborted' => true]; 
	if(isset($_SESSION['v']['success'])) $_SESSION['v']['success'] = false;
}
/* END anti brute force */

echo json_encode($response);


function generate_polynomial($x, $thingy)
{
	$coefficients = [];
	for($i = 0 ; $i < rand(3,4); $i++) $coefficients[$i] = rand(0,20); 
	$polynomial = new MathPHP\Functions\Polynomial($coefficients);

	$derivative = $polynomial->differentiate();

	$p = rand(1,3);
	$q = [$polynomial, $polynomial->differentiate(), $polynomial->differentiate()->differentiate(), $polynomial->differentiate()->differentiate()->differentiate()];
	
	$text = "let x be the correct ".$thingy."\n"
		."and f(x) = ".$polynomial."\n"
		."what number is f".str_repeat("'", $p)."(x) + x ?";
	return(['answer' => $q[$p]($x)+$x, 'text' => $text]);

}

function generate_text_imagick($text, $fontsize)
{
	$draw = new \ImagickDraw();
	$draw->setStrokeColor("rgb(0, 0, 0)");
	$draw->setFillColor("rgb(0, 0, 0)");
	$draw->setStrokeWidth(1);
	$draw->setFontSize($fontsize);
	$draw->setTextAlignment(\Imagick::ALIGN_CENTER);
	$draw->annotation(180, $fontsize, $text);

	$imagick = new \Imagick();
	$imagick->newImage(360, $fontsize*(substr_count($text, "\n")+1) + $fontsize*0.5, "rgb(255, 255, 255)");
	$imagick->setImageFormat("jpg");

	$imagick->drawImage($draw);

	return($imagick);
}

function generate_ravens_imagick($s, $pick)
{
	$imagick = new \Imagick(realpath($s[$pick]['u']));
	$imagick->resizeImage(370-rand(5,25), (400/$imagick->getImageWidth())*$imagick->getImageHeight()-rand(5,25), Imagick::FILTER_LANCZOS,1);
	$imagick->setImageFormat("jpg");


	return($imagick);
}

function generate_noise_imagick($alpha, $x, $y)
{
	$randstuff = ""; for($i=0; $i < 20; $i++) $randstuff .= generateRandomString(60)."\n";
	$draw = new \ImagickDraw();
	$draw->setFontSize(10);
	$draw->annotation(0, 10, $randstuff );

	$imagick = new \Imagick();
	$imagick->newImage(rand($x*0.25,$x*0.5), rand($y*0.25,$y*0.5), "rgba(255,255,255,255)");
	$imagick->setImageFormat("png");
	$imagick->addNoiseImage(\Imagick::NOISE_LAPLACIAN);
	$imagick->addNoiseImage(\Imagick::NOISE_IMPULSE);
	$imagick->addNoiseImage(\Imagick::NOISE_IMPULSE);
	$imagick->drawImage($draw);
	$imagick->resizeImage($x, $y, Imagick::FILTER_LANCZOS,1);
	if(method_exists("Imagick", "setImageOpacity"))
		$imagick->setImageOpacity($alpha);
	else if(method_exists("Imagick", "setImageAlpha"))
		$imagick->setImageAlpha($alpha);
	else // doh!
		$imagick->resizeImage(1, 1, Imagick::FILTER_LANCZOS,1);

	return($imagick);

}
function distort_perspective($im, $a, $b)
{
	$size = [$im->getImageWidth(), $im->getImageHeight()];
	/* Fill new visible areas with transparent */
	$im->setImageVirtualPixelMethod(Imagick::VIRTUALPIXELMETHOD_WHITE);

	/* Activate matte */
	$im->setImageMatte(true);

	/* Control points for the distortion */
	$controlPoints = array( 0, 0, 
				-rand($a, $b), -rand($a, $b),

				0, $im->getImageHeight(),
				-rand($a, $b), $im->getImageHeight()+rand($a, $b),

				$im->getImageWidth(), 0,
				$im->getImageWidth() + rand($a, $b), -rand($a, $b),

				$im->getImageWidth(), $im->getImageHeight(),
				$im->getImageWidth() + rand($a, $b), $im->getImageHeight() + rand($a, $b));

	/* Perform the distortion */                       
	$im->distortImage(Imagick::DISTORTION_PERSPECTIVE, $controlPoints, true);

	$im->resizeImage($size[0], $size[1], Imagick::FILTER_LANCZOS,1);

	return($im);
}
function generateRandomString($length = 10) 
{
    return substr(str_shuffle(str_repeat($x='         0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length/strlen($x)) )),1,$length);
}
?>
