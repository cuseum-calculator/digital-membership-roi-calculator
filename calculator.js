// C.Yuan 2019
// calculator.js
// 
// Backend for Cuseum Digital Membership Calculator


$(document).ready(function(){


	// Calculate default results
	results_calc()
	$(".mobile_foot").removeClass("fixed_pos");

	////////////////////////////////////////
	// Narrow Window results tab handling //
	////////////////////////////////////////

	$(window).scroll(function() {   

		var scroll = $(window).scrollTop();

		if (scroll >= 400) {

			$(".mobile_foot").addClass("fixed_pos");
		}
		else{

			$(".mobile_foot").removeClass("fixed_pos");
		}
	});

	$(window).resize(function(){

		results_calc()

	});
	
	/////////////////////
	// Slider Handling //
	/////////////////////

	// Always updating slider
	var time_slider = document.getElementById("time_range");

	// Update the current slider value each time you drag the slider handle)
	time_slider.oninput = function() {

		var years = this.value

		// 1 year vs 2 years wording handling
		var output = ""
		if (years > 1)
			output += "<h5>Over " + years + " Years</h5>"
		else
			output += "<h5>Over " + years + " Year</h5>"

		$("#timeline").html(output)
		results_calc()
	}

	var rate_slider = document.getElementById("rate_range");

	// Update the current slider value each time you drag the slider handle)
	rate_slider.oninput = function() {

		var rate = this.value

		var text = "<p>With a <strong style = 'color: #4c944b;'>" + rate + "%</strong> increase due "
				 + "to our digital membership cards that's a <strong>revenue increase</strong> of</p>"

		$("#rev_text").html(text)
		results_calc()
	}


	//////////////////////////////////////////
	// Calculator Inputs & Results Handling //
	//////////////////////////////////////////


	// Does   : Updates input boxes via id from client input value
	// Params : Default value for input, html id, client input value, and min value
	// Returns: Nothing
	function live_update (default_val, input_id, input_val, min_val) {

		if (input_val <= min_val)
			$(input_id).html(default_val);
		else
			$(input_id).html(input_val);


	}


	// Does   : Calculates the total cost and time saved based on client inputs
	// Params : Nothing, variables accessed via DOM
	// Returns: Nothing
	function results_calc () {

		// Get the input values
		var years = parseFloat($("#time_range").val());
		var mem_base = parseFloat($("#mem_base_input").val());
		var price = parseFloat($("#mem_price_input").val());
		var card_prod = parseFloat($("#card_prod_input").val());
		var card_ship = parseFloat($("#card_ship_input").val());
		var labor = parseFloat($("#labor_input").val());
		var mailing = parseFloat($("#mailing_input").val());
		var churn = parseFloat($("#churn_input").val()) / 100;
		var rate = parseFloat($("#rate_range").val()) / 100;

		// calculate saved costs over given years

		// hourly wage / 6 --> 10min wage --> 10min to create a card
		labor = (labor / 6)

		// How much they currently spend
		var unit_cost = (card_prod + card_ship + labor + mailing);
		var spending = "$" + (years * mem_base * unit_cost).toLocaleString();

		var saving_rate_base = [0.50, 0.65, 0.70]
		var saving_rate_labor = [0.05, 0.12, 0.15]
		var saving_rate_post = [0.05, 0.15, 0.20]

		var cost_saved_int = 0.00

		var i
		for (i = 0; i < years; i += 0.5) {

			var j = Math.floor(i)

			var unit_savings = (saving_rate_base[j] * (card_prod + card_ship)) + 
							   (saving_rate_labor[j] * labor) +
							   (saving_rate_post[j] * mailing);

			unit_savings = unit_savings / 2
							   
			cost_saved_int += (mem_base * unit_savings)
		}

		// over 1,000,000,000,000 exceeds div space
		if (cost_saved_int >= 1000000000000)
			cost_saved_int = cost_saved_int.toExponential(); 

		// convert to string
		var cost_saved_str = "$" + (Math.floor(cost_saved_int)).toLocaleString();

		// How to calculate time?
		var time_saved = (time_convert(years * mem_base * 15));

		time_saved = time_saved.toLocaleString();

		// 21g per card, 454g in a lb
		var CO2_saved = Math.round(years * ((mem_base * 21) / 454)).toLocaleString() + " lbs CO<sub>2</sub>"

		// Revenue calculations
		var rev = "$" + (mem_base * rate * price * years).toLocaleString()

		var total_return = "<hr><h4>Total Saved Costs:</h4><p>" 
						 + cost_saved_str
						 + "</p>"





		// Update HTML
		$('#cost_saved').html(cost_saved_str);
		$('#time_saved').html(time_saved);
		$('#CO2_saved').html(CO2_saved);
		$('#rev_lost').html(rev);
		$('#cur_cost').html(spending)

		// For narrow windows, show simpler results tab and mobile styling
		var viewport = $(window).width();

		if (viewport <= 550)
		{

			$(".mobile_foot").removeClass("hide");
			$(".mobile_foot").addClass("show");
			$("#mobile_results").html(total_return);

			$(".title").removeClass("head_reg")
			$(".title").addClass("head_mob")

			$(".logo").removeClass("logo_reg");
			$(".logo").addClass("logo_mob");
		}
		else
		{
			$(".mobile_foot").removeClass("show");
			$(".mobile_foot").addClass("hide");
			$("#mobile_results").html("");

			$(".title").removeClass("head_mob");
			$(".title").addClass("head_reg");

			$(".logo").removeClass("logo_mob");
			$(".logo").addClass("logo_reg");

		}


	}

	// Does   : Returns int in time
	// Params : An int
	// Returns: A string, given int in hours and minutes
	function time_convert(num) { 

		var hours = Math.floor(num / 60);  
		var minutes = num % 60;
		return hours + " hours "; 

	}

	///////////////////////
	// The Acutal Inputs //
	///////////////////////
	
	// Does   : Watches for member base changes and recalculates results accordingly 
	$("#mem_base_input").on("change keyup paste", function(){

		var mem_base = $(this).val()

		// Update input and calculate new results
		live_update(1, "#mem_base_input", mem_base, -1);
		results_calc()

	});

	// Does   : Watches for membership price changes and recalculates results accordingly 
	$("#mem_price_input").on("change keyup paste", function(){

		var price = $(this).val()

		// Update input and calculate new results
		live_update(1, "#mem_price_input", price, -1);
		results_calc()

	});

	// Does   : Watches for card production changes and recalculates results accordingly 
	$("#card_prod_input").on("change keyup paste", function(){

		var card_prod = $(this).val()

		// Update input and calculate new results
		live_update(1.25, "#card_prod_input", card_prod, -1)
		results_calc()

	});

	// Does   : Watches for Card Shipping changes and recalculates results accordingly 
	$("#card_ship_input").on("change keyup paste", function(){

		var card_ship = $(this).val()

		// Update input and calculate new results
		live_update(0.50, "#card_ship_input", card_ship, -1)
		results_calc()

	});

	// Does   : Watches for staff labor changes and recalculates results accordingly 
	$("#labor_input").on("change keyup paste", function(){

		var labor = $(this).val()

		// Update input and calculate new results
		live_update(1, "#labor_input", labor, -1);
		results_calc()

	});

	// Does   : Watches for mailings changes and recalculates results accordingly 
	$("#mailing_input").on("change keyup paste", function(){

		var mailing = $(this).val()

		// Update input and calculate new results
		live_update(1, "#mailing_input", mailing, -1);
		results_calc()

	});

	// Does   : Watches for churn% changes and recalculates results accordingly 
	$("#churn_input").on("change keyup paste", function(){

		var churn = $(this).val()

		// Update input and calculate new results
		live_update(1, "#churn_input", churn, -1);
		results_calc()

	});

	////////////////////
	// Email Handling //
	////////////////////

	// On submit button click
	$("#submit").click(function() {


		var org = $("#org").val();

		valid = validateEmail(org)

		var email_body = ""

		if (valid) {



			setTimeout(function(){

				launch_toast()
 				
			}, 650);

			// var subscribe = $('#opt_in').is(":checked")

			// if (subscribe == true) {
			// 	console.log("subscribed!")
			// }




			// Get the input values
			var years = parseFloat($("#time_range").val());
			var mem_base = parseFloat($("#mem_base_input").val());
			var price = parseFloat($("#mem_price_input").val());
			var card_prod = parseFloat($("#card_prod_input").val());
			var card_ship = parseFloat($("#card_ship_input").val());
			var labor = parseFloat($("#labor_input").val());
			var mailing = parseFloat($("#mailing_input").val());
			var churn = parseFloat($("#churn_input").val()) / 100;
			var rate = parseFloat($("#rate_range").val()) / 100;

			// calculate saved costs over given years

			// hourly wage / 6 --> 10min wage --> 10min to create a card
			labor = (labor / 6)

			var saving_rate_base = [0.50, 0.65, 0.70]
			var saving_rate_labor = [0.05, 0.12, 0.15]
			var saving_rate_post = [0.05, 0.15, 0.20]

			var cost_saved_int = 0.00

			var i
			for (i = 0; i < years; i += 0.5) {

				var j = Math.floor(i)

				var unit_savings = (saving_rate_base[j] * (card_prod + card_ship)) + 
								   (saving_rate_labor[j] * labor) +
								   (saving_rate_post[j] * mailing);

				unit_savings = unit_savings / 2
								   
				cost_saved_int += (mem_base * unit_savings)
			}

			// convert to string
			var cost_saved_str = "$" + (Math.floor(cost_saved_int)).toLocaleString();

			// How to calculate time?
			var time_saved = (time_convert(years * mem_base * 15));

			time_saved = time_saved.toLocaleString();

			// 21g per card, 454g in a lb
			var CO2_saved = Math.round(years * ((mem_base * 21) / 454)).toLocaleString() + " lbs CO<sub>2</sub>"

			// Revenue calculations
			var rev = "$" + (mem_base * rate * price * years).toLocaleString()

			var time = ""

			if (years > 1){
				time = years + " years";
			}
			else {
				time = years + " year";
			}

			email_body  = "<h1 style = 'text-align: center; color: black'>Digital Membership ROI Calculator Results</h1><br><hr><br>"
						+ "<p>Running a membership program comes "
						+ "with a lot of responsibility and "
						+ "with traditional membership cards you may be spending "
						+ "more than you think. By offering your members digital membership "
						+ "cards you can create new <strong>outreach channels</strong>," 
						+ "offer <strong>greater convenience</strong>, "
						+ "<strong>reduce time and costs</strong>, "
						+ "<strong>increase renewals</strong>, and <strong>save "
						+ "the planet</strong>! Among the many advantages gained, here are a few "
						+ "you can expect to gain over just " + time + " :</p>"
						+ "<h3>💰 Total Saved Costs: " + cost_saved_str + "</h3>"
						+ "<h3>⏰ Total Saved Time: " + time_saved + "</h3>"
						+ "<h3>🌎 Total Carbon Footprint Reduced: " + CO2_saved + "</h3>"
						+ "<h3>💸 Total Revenue Inrease: " + rev + "</h3><br><hr><br>"
						+ "<h5>Want to learn more about our products? Schedule a free consultation "
						+ "with a Cuseum expert simply by replying to this email!</h5>"
						+ "<h5>Best,</h5><h5>The Cuseum Team</h5>";
			$.ajax({
				type: "POST",
				url: "https://mandrillapp.com/api/1.0/messages/send.json",
				data: {
					'key': "QYjR7JYAhGtIfrvh7dni2g",
					'message': {
						'from_email': 'hello@cuseum.com',
						'to': [
							{
								'email': org,
								'name': org,
								'type': 'to'
							}
						],
						'subject': "Cuseum's Digital Membership",
						'html' : email_body
					}
				}
			}).done(function(response) {
				console.log(response);
			});
		}
		else {
			alert("Sorry, looks like that is an invalid email!")
		}

	});

	// Clear modal input value on close
	$(".modal").on("hidden.bs.modal", function(){

		$('#org').val('')
	});

	function validateEmail(email) {

		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	};

	function launch_toast() {
    	var x = document.getElementById("toast")
   		x.className = "show_toast";
    	setTimeout(function(){ x.className = x.className.replace("show_toast", ""); }, 3000);
	};


});


