var zendesk = require('node-zendesk');
var Gecko = require('geckoboard-push');
var madisonBoard = new Gecko({api_key: '6ee922819c4cd7f8611908e6499a7016'});


var _und = require('./underscore-min');

var client = zendesk.createClient({
  username:  'shollinger@zendesk.com',
  token:     'dj3uN4m0bFeAHfAASUeZJS5dRJc9hpa63WDKz4Rq',
  remoteUri: 'https://z3nfoobar.zendesk.com/api/v2'
});

//TODO Make module with various conditional matches
var zenCondition = {
	isUnassigned : function(ticket) {
		return _und.isEmpty(ticket.assignee_id);
	}
};

/**
	Count all tickets that match each business group
*/
var doCounts = function(tickets) {

	var t1GroupIds = [25848278];
	var t1Matches = [];

	t1Matches = _und.filter(tickets, function(ticket) {
		return zenCondition.isUnassigned(ticket) &&
			   _und.contains(t1GroupIds, ticket.group_id);
	});

	return {
		t1 : t1Matches.length
	};
};

var pushToGecko = function(counts) {
	var pushUrl = 'https://push.geckoboard.com/v1/send/';
	var payload = [
   				{
      				value: counts.t1,
      				text: "Unassigned: T1"
    			}
  			];

	var t1UnassignedWidget = madisonBoard.number('59503-7aa96fbe-9b70-42f0-942b-17f30fd7c7d8');

	t1UnassignedWidget.send(payload, true, 'standard', function(err, response) {
		if(err) {
			console.log(err);
		} else {
			console.log(response);
		}
		console.log(payload);
		console.log('----- Ended -----');
	});
};

console.log('----- Starting -----');

client.tickets.list(function (err, req, result) {
  if (err) {
    console.log(err);
    return;
  }
  
  var counts = doCounts(result);
  pushToGecko(counts);

});
