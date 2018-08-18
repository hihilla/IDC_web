let timeout;
$(function(){
    getAllIdeas();
    commonGetAllProblems();
    // $('#addIdeaButton').click(OnClickAddIdeaButton);
    // $('#addProblemButton').click(OnClickAddProblemButton);
    getUserDetails();
});

function getAllIdeas() {
    fetch('/ideas', {credentials: "same-origin"})
        .then(function (response) {
            return response.json();
        })
        .then(function (ideas) {
            clearIdeasTable();
            ideas.forEach(function (idea) {
                appendIdea(idea);
            });
        });
}
function commonGetAllProblems(){
    // m_problems.forEach(function(problem){
    //     appendProblem(problem);
    // });

    fetch('/problems', {credentials: "same-origin"}) // TODO: endpoint
        .then(function(response) {
            return response.json();
        })
        .then(function(problems) {
            clearProblemsTable();
            problems.forEach(function(problem){
                appendProblem(problem);
            });
        });
}

function appendIdea(idea){
	let row= $('<tr></tr>').attr('id', 'row' + idea.id);
	row.append($('<td></td>').text(idea.id).addClass('font-weight-bold'));
	row.append($('<td></td>').attr('id','ideaText' + idea.id).text(idea.idea));
	row.append($('<td></td>').append(
		$('<a></a>').addClass('btn btn-default delete').data('id', idea.id).click(deleteIdea).append(
			$('<span></span>').addClass('glyphicon glyphicon-trash').attr('aria-hidden', 'true')
		)
	).append(
        $('<a></a>').addClass('btn btn-default edit').data('id', idea.id).click(editIdea).append(
            $('<span></span>').addClass('glyphicon glyphicon-pencil').attr('aria-hidden', 'true')
        )
    ));
    $("#ideasTableBody").append(row);
}

function appendProblem(problem){
    let row= $('<tr></tr>').attr('id', 'row' + problem.id);
    row.append($('<td></td>').text(problem.id).addClass('font-weight-bold'));
    row.append($('<td></td>').attr('id','problemText' + problem.id).text(problem.idea));
    row.append($('<td></td>').attr('id','problemText' + problem.id).text(problem.idea)); // ideas count
    row.append($('<td></td>').attr('id','problemText' + problem.id).text(problem.idea)); // date
    row.append($('<td></td>').attr('id','problemText' + problem.id).text(problem.idea)); // status
    row.append($('<td></td>').append(
        $('<a></a>').addClass('btn btn-default delete').data('id', problem.id).click(deleteProblem).append(//TODO
            $('<span></span>').addClass('glyphicon glyphicon-trash').attr('aria-hidden', 'true')
        )
    ).append(
        $('<a></a>').addClass('btn btn-default edit').data('id', problem.id).click(editProblem).append(//TODO
            $('<span></span>').addClass('glyphicon glyphicon-pencil').attr('aria-hidden', 'true')
        )
    ));
    $("#problemsTableBody").append(row);
}

function deleteIdea(){
	let ideaId = $(this).data('id');
    fetch('/idea/' + ideaId, {method: 'DELETE', credentials: "same-origin"})
        .then(function(response) {
			return response.text();
        })
		.then(function(response){
			if(response == "1"){
				$('#row' + ideaId).remove();
				alertMessage("The Idea was successfully removed!", "success")
			}
			else{
				alertMessage("An error has occurred while trying to remove Idea id=" + ideaId, 'danger');
			}
		});
}

function deleteProblem(){
    let problemId = $(this).data('id');
    fetch('/idea/' + problemId, {method: 'DELETE', credentials: "same-origin"}) //TODO: endpoint
        .then(function(response) {
            return response.text();
        })
        .then(function(response){
            if(response == "1"){
                $('#row' + problemId).remove();
                alertMessage("The Problem was successfully removed!", "success")
            }
            else{
                alertMessage("An error has occurred while trying to remove Problem id=" + problemId, 'danger');
            }
        });
}

function submitForm(){
    let ideaId = $('#ideaId').val();
    let ideaText = $('#idea').val();
    if (ideaId === "") {
        //    appendIdea({id: m_ideas.length, idea: ideaText});


        // New Idea:
        fetch('/idea', {method: 'PUT', body: ideaText, credentials: "same-origin"})
            .then(function (response) {
                console.log(response.status);
                return response.text();
            })
            .then(function (response) {
                $('#newIdeaModal').modal('hide');
                if (isNaN(response)) {
                    console.log("response is nan");
                    alertMessage("An error has occurred while trying to add a new story", 'danger');
                    return;
                }
                appendIdea({id: response, idea: ideaText});
            });
    }
	else{
		// Editing existing idea:
        fetch('/idea/' + ideaId , {method: 'POST', body: ideaText, credentials: "same-origin"})
            .then(function(response) {
                console.log(response.text());
                return response.text();
            })
            .then(function(response){
                $('#newIdeaModal').modal('hide');
                if(response === "0"){
                    alertMessage("An error has occurred while trying to edit the story", 'danger');
                    return;
                }
                $('#ideaText' + ideaId).text(ideaText);
                alertMessage("The Idea was successfully edited!", "success");
            });
	}

}

function submitProblemForm(){
    let problemId = $('#problemId').val();
    let problemText = $('#problem').val();
    if (problemId == ""){
        // New problem:
        // appendProblem({id: m_problems.length, idea: problemText});

        fetch('/problem' , {method: 'PUT', body: problemText, credentials: "same-origin"}) // TODO: endpoint
            .then(function(response) {
                return response.text();
            })
            .then(function(response){
                $('#newProblemModal').modal('hide');
                if(isNaN(response)){
                    alertMessage("An error has occurred while trying to add a new story", 'danger');
                    return;
                }
                appendProblem({id: response, idea: problemText});

            });
    }
    else{
        // Editing existing problem:
        fetch('/problem/' + problemId , {method: 'POST', body: problemText, credentials: "same-origin"}) // TODO: endpoint
            .then(function(response) {
                return response.text();
            })
            .then(function(response){
                $('#newProblemModal').modal('hide');
                if(response == "0"){
                    alertMessage("An error has occurred while trying to edit the story", 'danger');
                    return;
                }
                $('#problemText' + problemId).text(problemText);
                alertMessage("The Problem was successfully edited!", "success");
            });
    }

}

function editIdea(){
	let ideaId = $(this).data('id');
    $('#ideaId').val(ideaId);
    $('#idea').val($('#ideaText' + ideaId).text());
    $('#myModalLabel').text("Edit idea:");
    $('#newIdeaModal').modal('show');
}

function editProblem(){
    let problemId = $(this).data('id');
    $('#problemId').val(problemId);
    $('#problem').val($('#problemText' + problemId).text());
    $('#myModalLabelProblem').text("Edit problem:");
    $('#newProblemModal').modal('show');
}


function OnClickAddIdeaButton(){
    $('#myModalLabel').text("Add a new idea:");
    $('form')[0].reset();
    $('#ideaId').val('');
    $('#newIdeaModal').modal('show');
}

function OnClickAddProblemButton(){
    $('#myModalLabelProblem').text("Add a new problem:");
    $('form')[0].reset();
    $('#problemId').val('');
    $('#newProblemModal').modal('show');
}

function clearIdeasTable(){
	$("#ideasTableBody").empty();
}

function clearProblemsTable(){
    $("#problemsTableBody").empty();
}

function alertMessage(message, classer){
	classer = 'alert alert-' + classer; 
	$('.userMessage').fadeIn(10).html(message).addClass(classer);
	clearTimeout(timeout);
	timeout = setTimeout(function(){
		$('.userMessage').fadeOut(1000,function(){
			$(this).html('').removeClass(classer);
		});
	}, 5000);
}

// Profile page

function OnClickSendPrivateMessageButton(){
    $('#myModalLabelMessage').text("Send a private message:");
    $('form')[0].reset();
    $('#newMessageModal').modal('show');
}

function submitMessageForm(){
    let toUsername = $('#username').val();
    let messageText = $('#message').val();
    // fetch('/message' , {method: 'PUT', body: messageText, credentials: "same-origin"}) // TODO: endpoint
    //     .then(function(response) {
    //         return response.text();
    //     })
    //     .then(function(response){
    //         $('#newProblemModal').modal('hide');
    //         if(isNaN(response)){
    //             alertMessage("An error has occurred while trying to add a new story", 'danger');
    //             return;
    //         }
    //         appendProblem({id: response, idea: messageText});
    //
    //     });
    $('#newProblemModal').modal('hide');
    alertMessage("message sent to " + toUsername + " , message: " + messageText, 'danger');
}

function getUserDetails(){
    // fetch('/userDetails', {credentials: "same-origin"}) // TODO: endpoint
    //     .then(function(response) {
    //         return response.json();
    //     })
    //     .then(function(problems) {
    //
        let name= $('<div></div>').attr('name', 'name');
        name.append($('<h4></h4>').text("Hilla The Cool").addClass('font-weight-bold')); // TODO get from response
        $("#nameBody").append(name);

        let retings= $('<div></div>').attr('reting', 'reting');
        retings.append($('<h4></h4>').text("10").addClass('font-weight-bold')); // TODO get from response
        $("#ratingBody").append(retings);
    //     });
}

function getAllBadges(){
    // fetch('/badges', {credentials: "same-origin"}) // TODO: endpoint
    //     .then(function(response) {
    //         return response.json();
    //     })
    //     .then(function(problems) {
    //         clearProblemsTable();
    //         m_problems.forEach(function(problem){
    //             appendProblem(problem);
    //         });
    //     });
}

function appendBadge(badge){
    let row= $('<tr></tr>').attr('id', 'row' + badge.id);
    row.append($('<td></td>').text(badge.id).addClass('font-weight-bold'));
    row.append($('<td></td>').attr('id','badgeText' + badge.id).text(badge.text));
    $("#badgesTableBody").append(row);
}

function getAllOpenProblems(){
    // fetch('/openProblems', {credentials: "same-origin"}) // TODO: endpoint
    //     .then(function(response) {
    //         return response.json();
    //     })
    //     .then(function(problems) {
    //         clearProblemsTable();
    //         m_problems.forEach(function(problem){
    //             appendProblem(problem);
    //         });
    //     });
}

function appendOpenProblem(problem){
    let row= $('<tr></tr>').attr('id', 'row' + problem.id);
    row.append($('<td></td>').text(problem.id).addClass('font-weight-bold'));
    row.append($('<td></td>').attr('id','problemText' + problem.id).text(problem.idea));
    row.append($('<td></td>').append(
        $('<a></a>').addClass('btn btn-default').data('id', problem.id).click(answerProblem).append(
            $('<span></span>').addClass('glyphicon glyphicon-notes-2').attr('aria-hidden', 'true')
        )
    ));
    $("#openProblemsTableBody").append(row);
}

function answerProblem() {
    // todo
}
