<?php
    $secret_key = "{UKrMkNMg8jY7ZovzN8MIqvpXpZgRSzDn}";
   
    if(isset($_GET['data'])){

        $token = $_GET['data'];
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
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calling API GB PRIME PAY</title>
</head>
<body>
    <form action="#" method="POST"> 
    <input id="name" type="text" maxlength="250" placeholder="Holder Name" value="Card Test"><br/>
    <input id="number" type="text" maxlength="16" placeholder="Card Number" value="4535017710535741"><br/>
    <input id="expirationMonth" type="text" maxlength="2" placeholder="MM" value="05"><br/>
    <input id="expirationYear" type="text" maxlength="2" placeholder="YY (Last Two Digits)" value="28"><br/>
    <input id="securityCode" type="password" maxlength="3" autocomplete="off" placeholder="CVV" value="184"><br/>
    <input id="button" type="submit" value="Pay Now">
    </form>

    <form method="get" name="form" action="">
        <input type="text" placeholder="Enter Data" name="data">
        <input type="submit" value="Submit">
    </form>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script>
    document.getElementById("button").addEventListener("click", function(event){
        event.preventDefault();
        var publicKey = "{3QpUB0bwqOczd1ynkEdefyq7rEA72QWD}";
        var dataReq = {
        "rememberCard": false,
        "card": {
            "name": "Card Test",
            "number": "4535017710535741",
            "expirationMonth": "05",
            "expirationYear": "28",
            "securityCode": "184"
        }
        };
        $.ajax({
            type: "POST",
            url: "https://api.globalprimepay.com/v2/tokens",       // Test URL: https://api.globalprimepay.com/v2/tokens , Production URL: https://api.gbprimepay.com/v2/tokens
            data: JSON.stringify(dataReq),
            contentType: "application/json",
            dataType: "json",
            headers: {
            "Authorization": "Basic " + btoa("3QpUB0bwqOczd1ynkEdefyq7rEA72QWD" + ":")
            },
            success: function(dataResp){
            var dataStr = JSON.stringify(dataResp);
            alert(dataStr);
            console.log(dataResp);
            },
            failure: function(errMsg) {
            alert(errMsg);
            }
        });
    });
    </script>
    
</body>
</html>