<?php

$credentials = "admin:mind@123";
header("Content-Type: text/xml; charset=utf-8");
header("Authorization: Basic " . base64_encode($credentials));


$url = 'http://phpdemo.seasiainfotech.com:9090/plugins/restapi/v1/users/'.$_REQUEST['loggedUserName'].'/roster';


$xml =  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
        '<rosterItem>' .
        '<jid>'.$_REQUEST['jid'].'</jid>' .
        '<nickname>'.$_REQUEST['nickname'].'</nickname>' .
        '<subscriptionType>3</subscriptionType>' .
        '</rosterItem>';
echo $xml;

die;