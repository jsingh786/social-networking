# Social Networking [Tech stack Zend Framework, JSXC WEBRTC, jQuery, MSSQL 2012, Lucene, Doctrine 2]
A socail networking site sample code.

##CONFIGURATION
INSTALL WampServer Version 2.4 [attached with this project in docs folder.]
Microsoft SQL Client 2012 is required to make successfull connection with database using two dlls in docs folder.

####Required Drivers/Extensions
1.) php_pdo_sqlsrv_54_ts.dll
2.) php_sqlsrv_54_ts.dll
3.) php_apc_3114_beta_php54_win7-2008.dll [ required when APPLICATION_ENV : production ]

####Additional settings to HTTP CONFIG
KeepAlive On
MaxKeepAliveRequests 5

This setting should be �On� unless the server is getting requests from hundreds of IPs at once.
High volume and/or load balanced servers should have this setting disabled (Off) to increase connection throughput.

####Additional settings to PHP.INI
post_max_size = 100M
upload_max_filesize = 64M
max_execution_time = 3600
max_input_time = 300

[APC]
apc.shm_size = '128M'
apc.enabled=1
apc.shm_segments=1
apc.num_files_hint=0
apc.user_entries_hint=0
apc.ttl=0
apc.user_ttl=7200
apc.gc_ttl=3600
apc.stat=1
apc.enable_cli=0
apc.file_update_protection=2
apc.max_file_size=2M
apc.cache_by_default=1
apc.use_request_time=1
apc.slam_defense=0
apc.stat_ctime=0
apc.canonicalize=1
apc.write_lock=1
apc.report_autofilter=0
apc.rfc1867=0
apc.rfc1867_prefix =upload_
apc.rfc1867_name=APC_UPLOAD_PROGRESS
apc.rfc1867_freq=0
apc.rfc1867_ttl=3600
apc.lazy_classes=0
apc.lazy_functions=0

Change APPLICATION_ENV to production, defined in public/index.php and application/cronjobs/index.php

####JSXC CHAT API

Main.js:Mentioned settings are required when update credentials to connect with openfire & modify JSXC plugin:

Set up credentials in "settings" JSON where you want to connect with:
    a) URL: set up bosh url here can be found from openfire server in server settings module.
    b) Domain: defines on which domain openfire server is running.

    Other options are also there but it is up to requirements how JSXC setting will be managed.

There are some global parameters which are set up for ilook chat requirement are as follows:

    a) customized_for_ilook equals to 1 hide gui features of jsxc which need to modify according to iLook theme.
    b) customized_for_ilook_file_transfer equals to 1, calls file transfer functions in place of JSXC file transfer.
    c) hide_meta_messages equals to 1 hides specific pre defined messages set up by JSXC itself.
    d) hide_video_call_icon hide video icon.
    e) auto_start_otr equal to 0 disables otr.
    f) AES_key defines aes encryption key.This is 256 bit key used for iOS, Android & web end.
    g) AES_encryption_enabled equal to 1 enables AES encryption vice versa.

Some jar files are required on OPENFIRE server to communicate with JSXC.
a) Login with admin credentials: admin/mind@123
b) Go to Plugins module & install mentioned jar files :
    i)   REST API :-
            Enabled - REST API requests will be processed.
            HTTP basic auth - REST API authentication with Openfire admin account.

            These should be selected in "server settings" module.

    ii)  Subscription :-
            Accept - Subscription requests will be intercepted and accepted.
                Local - Only subscription requests sent by users who have an account on
                phpdemo.seasiainfotech.com will be intercepted and accepted.

                Make sure these options are selected.If not,select it first.

    iii) Monitoring Service :-
                Select checkbox corrsponding to "Conversation State Archiving".
                Select checkbox corresponding to "Archive one-to-one chats".

    iv)  Search  (default):No changes required.
    v)   DB Access

