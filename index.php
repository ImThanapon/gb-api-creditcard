<?php
$secret_key = "{UKrMkNMg8jY7ZovzN8MIqvpXpZgRSzDn}";



if(isset($_GET['gbToken'])){

  $token = $_GET['gbToken'];
  $data = array(
    'amount' => 1,
    'referenceNo' => '20171128001',
    'detail' => 't-shirt',
    'customerName' => 'John',
    'customerEmail' => 'example@gbprimepay.com',
    'merchantDefined1' => 'Promotion',
    'card' => array(
      'token' => $token,
    ),
    'otp' => 'N'
  );

  $payload = json_encode($data);

  $ch = curl_init('https://api.globalprimepay.com/v2/tokens/charge');
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_USERPWD, $secret_key . ':');
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true );
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

  curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($payload))
  );

  $result = curl_exec($ch);

  curl_close($ch);

  $chargeResp = json_decode($result, true);
  echo '<pre>';
  echo $result;
  echo '</pre>';

}


?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>GB</title>
</head>
<body>
  <form id="checkout-form" action="/">
    <div id="gb-form" style="height: 600px;">
    
    </div>
  </form>
  <script src="script/GBPrimePay.js"></script>
  <script>
    new GBPrimePay({
      publicKey: '3QpUB0bwqOczd1ynkEdefyq7rEA72QWD',
      gbForm: '#gb-form',
      merchantForm: '#checkout-form',
      amount: 1,
      customStyle: {
        backgroundColor: '#eaeaea'
      },
      env: 'test' // default prd | optional: test, prd
    });
  </script>
  <?php
    if(isset($_GET['gbToken'])){
      echo "gbToken : ".$_GET['gbToken']."<br>";
      echo "gbRememberCard : ".$_GET['gbRememberCard'];
    }
    
    // header('location : Full-Payment-3D.php?token='.$_GET['gbToken'])
  ?>
  
</body>
</html>