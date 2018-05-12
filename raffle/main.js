$.when( $.ready ).then(function() {
	$( "#get-comment-button" ).click(function() {
		var id = $( "#id-input" ).val();
		getComments(id)
	});
});


function getComments(id) {
    var myList = [];
    var i = 1;
    while (true) {
        $.getJSON("https://tgd.kr/board/comment_load/" + id + "/" + 1, function (data) {
            obj = data.results;
            console.log(obj);
            // $.each(obj, function (k, v) {
            //     myList.push(v.city_name);
            // });

        });
                    break;
    }
}