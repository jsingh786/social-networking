function saveContactToRoster()
{
    var rosterRequest =$("#content2").val();
    var username2 =$("#username2").val();
    var encodedString = btoa('admin:admin');
    $.ajax({
        type: 'POST',
        url: 'http://phpdemo.seasiainfotech.com:9090/plugins/restapi/v1/users/'+username2+'/roster',
        data: rosterRequest,
        dataType: 'xml',
        contentType: "application/xml",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + encodedString);
        },
        success: function (asp) {

            console.log(asp);
        }
    });
}

function saveUserToOpenfireServer()
{
    var encodedString = btoa('admin:admin');
    $.ajax({
        type: 'POST',
        url: 'http://phpdemo.seasiainfotech.com:9090/plugins/restapi/v1/users',
        data: rosterRequest,
        dataType: 'xml',
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + encodedString);
        },
        success: function (asp) {

            console.log(asp);
        }
    });
}