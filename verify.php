<?php
// TODO: force users into sessions. Currently, the client can open a maximum of 50 sessions (limit via IP address) 
// 		and present any one of them as valid to the server, as long as it has been solved correctly plus the 
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
require_once __DIR__ . '/vendor/autoload.php';

$response = ['error' => "Unknown Error.", 'aborted' => false ];

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

ini_set("session.use_cookies", 0);

session_id(substr(preg_replace('/[[:^print:]]/', '', $_POST['session']??$_GET['session']??""), 0, 1024));
session_start();

if($_POST['frontend']??"" == "true")
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
			if($_SESSION['v']['solved']??false)
			{
				$response['error'] = "";
				$response['validated'] = true;
			}
			else
			{
				do $pick = rand(0,count($s)-1); while(!isset($s[$pick]));
				$modified_answer = generate_polynomial($s[$pick]['a'], 'pattern');

				$imagick = new \Imagick(realpath($s[$pick]['u']));
				$imagick->resizeImage($imagick->getImageWidth()+rand(0,50), $imagick->getImageHeight()+rand(0,50), Imagick::FILTER_LANCZOS,1);
				$imagick->addNoiseImage(\Imagick::NOISE_LAPLACIAN);
				$imagick->addNoiseImage(\Imagick::NOISE_IMPULSE);
				$imagick->addNoiseImage(\Imagick::NOISE_IMPULSE);
				$imagick->setImageFormat("jpg");

				$response['image'] = base64_encode($imagick->getImageBlob());
				$response['text'] = $modified_answer['text'];//." ".$modified_answer['answer'];
				$response['session'] = session_id();
				$response['error'] = "";
				$_SESSION['v'] = [ 
					'solved' => false,
					'sitekey' =>  $_POST['data-sitekey']??"",
					'stock_parameters' => isset($_POST['data-wrongmax'], $_POST['data-wrongtimeout']) ? false : true,
					'wrongmax' => max(3, min(10, $_POST['data-wrongmax']??0)),
					'wrongtimeout' => 60 * max(3, min(1000, $_POST['data-wrongtimeout']??0)),
						];
				$_SESSION['w'] = [ 
					'wrongcounter' => $_SESSION['w']['wrongcounter'] ?? 1,
					'lasttime' => 0,
					'iptime' => $IP_TIME,
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
					$_SESSION['v']['solved'] = true;
					$_SESSION['w']['wrongcounter'] = 0;
					$IP_ADDR = "remove";
					$IP_TIME = $_SESSION['w']['iptime'];
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
else
{
	$response = ['error' => "No valid session provided."];	
	if(isset($_GET['session'])) $VAL = $_GET; 
	else if(isset($_POST['session'])) $VAL = $_POST; 

	if(isset($VAL))
	{
		if(isset($_SESSION['v'])) $response = $_SESSION['v'];
	}
}

/* anti brute force - oh, hi!; IPv6 people: get a real IP address! */
$oldsessionid = session_id();
session_write_close();
session_id("da4a6221426c1e5ee5a51f90a46ffd5b");
session_start();
if(!isset($_SESSION[$_SERVER['REMOTE_ADDR']])) $_SESSION[$_SERVER['REMOTE_ADDR']] = [];
if($IP_ADDR??"" == "add") $_SESSION[$_SERVER['REMOTE_ADDR']] += [$IP_TIME];
if($IP_ADDR??"" == "remove") unset($_SESSION[$_SERVER['REMOTE_ADDR']][array_search($IP_TIME, $_SESSION[$_SERVER['REMOTE_ADDR']])]);
foreach($_SESSION[$_SERVER['REMOTE_ADDR']] as $k => $v) if($v+$IP_MAXTRANSIENCE > time()) unset($_SESSION[$_SERVER['REMOTE_ADDR']][$k]);
$toomanyips = count($_SESSION[$_SERVER['REMOTE_ADDR']]) > $IP_MAXUSERS ? true : false;
session_write_close();
session_id($oldsessionid);
session_start();

if($toomanyips)
{ 
	$response = ['error' => "Too many requests per IP address!", 'aborted' => true]; 
	if(isset($_SESSION['v']['solved'])) $_SESSION['v']['solved'] = false;
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
	
	$text = "let x be the correct ".$thingy."<br>"
		."and f(x) = ".$polynomial."<br>"
		."what number is f".str_repeat("'", $p)."(x) + x ?";
	return(['answer' => $q[$p]($x)+$x, 'text' => $text]);

}
?>
