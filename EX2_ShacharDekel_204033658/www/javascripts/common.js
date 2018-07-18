let timeout;
$(function(){
    getAllIdeas();
    $('#addIdeaButton').click(OnClickAddIdeaButton);
});

function getAllIdeas(){
    fetch('/ideas', {credentials: "same-origin"})
        .then(function(response) {
            return response.json();
        })
        .then(function(ideas) {
            clearIdeasTable();
            ideas.forEach(function(idea){
                appendIdea(idea);
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

function submitForm(){
	let ideaId = $('#ideaId').val();
	let ideaText = $('#idea').val();
	if (ideaId == ""){
		// New Idea:
        fetch('/idea' , {method: 'PUT', body: ideaText, credentials: "same-origin"})
            .then(function(response) {
                return response.text();
            })
            .then(function(response){
                $('#newIdeaModal').modal('hide');
            	if(isNaN(response)){
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
                return response.text();
            })
            .then(function(response){
                $('#newIdeaModal').modal('hide');
                if(response == "0"){
                    alertMessage("An error has occurred while trying to edit the story", 'danger');
                    return;
                }
                $('#ideaText' + ideaId).text(ideaText);
                alertMessage("The Idea was successfully edited!", "success");
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


function OnClickAddIdeaButton(){
    $('#myModalLabel').text("Add a new idea:");
    $('form')[0].reset();
    $('#ideaId').val('');
    $('#newIdeaModal').modal('show');
}

function clearIdeasTable(){
	$("#ideasTableBody").empty();
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

