$.when( $.ready ).then(function() {
	comments = new Map;
	users = []

	$( "#get-comment-button" ).click(function() {
		// Remove previous data
		comments = new Map;
		users = []
		$( "#get-comment-button" ).prop("disabled", true);
		$("#loading").show();
		var id = $( "#id-input" ).val();
		getComments(id, 1);
	});

	$( "#raffle-button" ).click(function() {
		if (users.length > 0)
			raffle()
	});
});

function buildTable() {
	var html = "";
	var i = 1
	for (var [key, value] of comments) {
	    html += '<tr>';
        html += '<th scope="row">'+ i++ +'</td>';
        html += '<td>'+ "<img src='" + value[2] + "' style='width:20px'>" + " " + value[0] +'</td>';
        html += '<td>'+ value[1] +'</td>';
        html += '</tr>';
	}

	$(".table").DataTable().destroy();
	$("#comment-body").html(html);
	$(".table").DataTable({
		"serverSide": false,
    	"pageResize": true,
    	"columnDefs": [
    		{ "width": "50px", "targets": 0 },
    		{ "width": "150px", "targets": 1 }
  		]
    });
}

function getComments(id, i) {
	var xhr = new XMLHttpRequest();
	var cors = "https://cors-anywhere.herokuapp.com/"        
	var url = cors + "https://tgd.kr/board/comment_load/" + id + "/" + i

	xhr.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			let response = JSON.parse(this.responseText);
			let data = response["data"];

	  		if (data.length > 0) {
	  			for (key in data) {
	  				var c = data[key]
	  				if (c["parent"] == 0) {
	  					var logo = c["secret"] == true ? "https:" + c["logo"] : c["logo"]
	  					comments.set(c["user_id"],[c["nickname"], c["content"], logo]);
	  					users.push(c["nickname"])
	  				}
	  			}
	  			getComments(id, i + 1);
	  		} else {
	  			downloadDone()
	  		}

	  		// Update progress bar
	  		var total = Math.ceil(response["total_rows"] / 50);
	  		var percent = data.length > 0 ? (i / total) * 100 : "0"
	  		$(".progress-bar").css("width", percent + "%");
		}
	}
	xhr.open("GET", url);
	xhr.setRequestHeader("Accept", 'application/json');
	xhr.send(); 
}

function downloadDone() {
	$("#get-comment-button").prop("disabled", false);
	$("#loading").hide();
	$("#raffle-button").show();
	buildTable()
}

function raffle() {
	var rand = Math.floor(Math.random() * users.length);
	var html = "<li>" + (rand + 1) + " " + users[rand] + "</li>";
	$("#raffle-users").append(html);
}

