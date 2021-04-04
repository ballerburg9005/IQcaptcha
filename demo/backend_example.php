<?php
$mywrongmax = 6;
$mywrongtimeout = 360;
$mysitekey = "b35074286103ba87e759d081640433b4";

$data = [ 'session' => $_GET['iq-captcha-session'], // this would be _POST in most cases
          'sitekey' => $mysitekey,
        ];

$response = json_decode(iqcaptcha_verify($data), true);

if($response['success'] && $response['sitekey'] == $mysitekey && $response['wrongmax'] == $mywrongmax && $response['wrongtimeout'] == $mywrongtimeout)
{
    echo "verified";
    // grant access
}
else echo "not verified!";

function iqcaptcha_verify($data)
{
    // assemble URL relative to calling script
    $url = filter_input(INPUT_SERVER, "REQUEST_SCHEME")."://" 
			. (strlen(filter_input(INPUT_SERVER, 'PHP_AUTH_USER')) > 0 
				? filter_input(INPUT_SERVER, 'PHP_AUTH_USER') . ":" . filter_input(INPUT_SERVER, 'PHP_AUTH_PW') . "@"
				: "")
			. filter_input(INPUT_SERVER, 'HTTP_HOST')
			. ":" .  filter_input(INPUT_SERVER, "SERVER_PORT")
		        . "/" . substr(__DIR__, strlen(filter_input(INPUT_SERVER, 'DOCUMENT_ROOT'))) 
		        . "/../verify.php";
        
    $options = array(
            'http' => array(
                'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                'method' => 'POST',
                'content' => http_build_query($data, '', '&'),
            ),
         );
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    // please use your own url not iqcaptcha.us.to

    if ($response !== false) {
       return $response;
    }

    return '{"success": false }';
}
