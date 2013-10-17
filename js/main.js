$(function() {
	
	function view() {
		var row = $("#row")[0].selectedIndex + 1,
			col = $("#col")[0].selectedIndex + 1,
			total = row * col;
		$("#chart").text("");
		for (var i = 0, s = t = 1; i < total; i++, t++) {
			if(t == col + 1) {
				t = 1; s++;
			}
			$("#chart").append("<button class='pos' id='b"+i+"'>"+s+"排<br>"+t+"列</button>");
		};
		$("#chart").css("width", col * 50 + "px");
		$("#chart").css("height", row * 50 + "px");
		$("#tabs").tabs("refresh");
	}
	function loop (id, num, total) {
		for (var i = 0; i < total; i++) {
			$("#" + id + i).css({
				"background-color": "#aaa",
				"color": "black"
			});
		};
		if(num > total - 2)	{
			alert("总人数太少，或者选择人数太多！");
			$("#stop_"+id).click();
		}
		var rand = Array(num);
		var css = {"background-color": "red", "color": "yellow"};
		for (var i = 0; i < rand.length; i++) {
			rand[i] = Math.floor(Math.random() * total);
			for (var j = 0; j < i; j++) {
				if(rand[i] == rand[j]) rand[i] = Math.floor(Math.random() * total);
			};
			$("#" + id + rand[i]).css(css);
		};
	}

	function random_b() {
		var row = $("#row")[0].selectedIndex + 1,
			col = $("#col")[0].selectedIndex + 1,
			num = $("#people_b").spinner("value"),
			total = row * col;
		loop("b", num, total);
	}
	function random_a() {
		var num = $("#people_a").spinner("value"),
			total = $(".student").length;
		loop("a", num, total);
	}

	var _interval = Array();
	
	var select_row = $("#row"),
		select_col = $("#col");
	var slider_row = $("<div class='slider'></div>").insertAfter(select_row).slider({
		min: 1,
		max: 10,
		range: "min",
		value: select_row[0].selectedIndex + 1,
		slide: function(event, ui) {
			select_row[0].selectedIndex = ui.value - 1;
			view();
		}
	});
	
	var slider_col = $("<div class='slider'></div>").insertAfter(select_col).slider({
		min: 1,
		max: 10,
		range: "min",
		value: select_col[0].selectedIndex + 1,
		slide: function(event, ui) {
			select_col[0].selectedIndex = ui.value - 1;
			view();
		}
	});


	$("#tabs").tabs();
	$("#row").change(function() {
		slider_row.slider("value", this.selectedIndex + 1);
		view();
	});
	$("#col").change(function() {
		slider_col.slider("value", this.selectedIndex + 1);
		view();
	});
	$(".people").spinner({
		min: 1,
		max: 5
	});

	$(".speed").slider({
		value: 50,
		min: 5,
		max: 150,
		step: 5,
		slide: function(event, ui) {
			var id = $(this).attr('data-id');
			$("#label_"+id).text("速度："+ui.value+"ms");
		}
	});
	
	$(".start").button({
		disabled: false,
		icons: {
			primary: "ui-icon-play"}
		}).click(function() {
			var id = $(this).attr('data-id');
			var speed = $("#speed_"+id).slider("value");
			if(id=="a") {
				if($("#links").text() == "") return false;
				_interval['a'] = setInterval(random_a, speed);
			} else if(id=="b") _interval['b'] = setInterval(random_b, speed);
			$("#speed_"+id).slider("disable");
			$("#start_"+id).button("disable");
			$("#stop_"+id).button("enable");
	});

	$(".stop").button({
		disabled: true,
		icons: {
			primary: "ui-icon-stop"}
		}).click(function() {
			var id = $(this).attr('data-id');
			clearInterval(_interval[id]);
			$("#speed_"+id).slider("enable");
			$("#start_"+id).button("enable");
			$("#stop_"+id).button("disable");
	});


	$("#dialog-form").dialog({
		autoOpen: false,
		height: 400,
		width: 350,
		modal: true,
		buttons: {
			OK: function() {
				var all = $("#all").val();
				var each = all.split("\n");
				$("#links").text("");
				for (var i = 0, j = 0; i < each.length; i++) {
					if($.trim(each[i]) != "") {
						$("#links").append("<button class='student' id='a"+j+"'>"+each[i]+"</button>");
						j++;
					}
				};
				$(this).dialog("close");
				$("#tabs").tabs("refresh");
			},
			Reset: function() {
				$("#all").val("");
			}
	}});
	
	$("#name").button({
		icons: {
			primary: "ui-icon-document"}
		}).click(function() {
			$("#dialog-form").dialog("open");
	});

	view();
});