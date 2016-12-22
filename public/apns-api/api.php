<?php
		$ROOT_PATH =   realpath(dirname(__FILE__)); 
		ini_set('max_execution_time',115200);
		$deviceToken =  '6ba74f378e47bfd12233f1f7dcbbbe3c9fa3a1a11323306e0ca020d900027241';
		
        $message =  "Test by PHP Team ";        
		$badge = 1;
		
		
		$passphrase='123456';
        
		$badge = (int) $badge;
        
        
        // Construct the notification payload
        $body = array();
        $body['aps'] = array('alert' => $message);
        
        if ($badge)
            $body['aps']['badge'] = $badge;


  
        
        /* End of Configurable Items */
         $ctx = stream_context_create();
        stream_context_set_option($ctx, 'ssl', 'local_cert', $ROOT_PATH.'\ilook_dev_apns.pem');
		stream_context_set_option($ctx, 'ssl','passphrase',$passphrase);
        
        // assume the private key passphase was removed.
        
      	$fp = stream_socket_client('ssl://gateway.sandbox.push.apple.com:2195', $err, $errstr, 60, STREAM_CLIENT_CONNECT, $ctx); //for local server development level
       //$fp = stream_socket_client('ssl://gateway.push.apple.com:2195', $err, $errstr, 60, STREAM_CLIENT_CONNECT, $ctx);    //for live server production level
        
        if (!$fp) {
          $result = array("Status"=>302, "message"=>"Server connection failed");
          return;
        } else {
          $result = array("Status"=>302, "message"=>"connection ok");
         }
     
	  
	    $payload = json_encode($body);
        $msg = chr(0) . pack("n", 32) . pack('H*', str_replace(' ', '', $deviceToken)) . pack("n", strlen($payload)) . $payload;
        print "sending message :" . $payload . "n";
        fwrite($fp, $msg);
        fclose($fp);

?>