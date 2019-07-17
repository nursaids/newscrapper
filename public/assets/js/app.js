"use strict";


(function(){
    $(document).ready(function(){

        function deleteComment(commentId, acrticleId){
            $.ajax(`/api/article/${articleId}/comments/${commentId}`,{
                type: 'DELETE'
            }).then(
                response => {
                    getComments(articleId);
                }
            ).catch(
                err => console.log(err)
            );
        };
        function displayComment(articleId, previousCommentsDiv, commentObj){
            let cardDivEl = $("<div>").addClass("card article-comment");
            let cardHeaderDivEl = $("<div>").addClass("card-header");
            let nameEl = $("<p>").addClass("comment-name").text(commentObj.name);
            let deleteButtonEl =$("<button>").addClass("btn btn-light delete-btn").attr("comment-id", commentObj._id).text("Delete");
            deleteButtonEl.on("click", () => deleteComment(commentObj._id, articleId));
            cardHeaderDivEl.append(nameEl);
            cardHeaderDivEl.append(deleteButtonEl);
            cardDivEl.append(cardHeaderDivEl);
            let cardBodyDivEl = $("div").addClass("card-body");

            let cardTextEl = $("<p>").adClass("card-text").text(commentObj.comment);

            cardBodyDivEl.append(cardTextEl);
            cardDivEl.append(cardBodyDivEl);

            previousCommentsDiv.append(cardDivEl);
        }

        function getComments(articleId){

            $.get(`/api/articles/${articleId}`, response => {
                let previousCommentsDiv = $(`#${articleId}`).find(".previous-comments");
                previousCommentsDiv.empty();

                response.comments.forEach(comment => {
                    displayComment(articleId, previousCommentsDiv, comment);
                });
            });
        }

        $(".comment-btn").on("click", function () {
            
            let state = $(this).attr("state");

            let articleId = $(this).attr("article-id")

            
            switch (state) {
                
                case "hidden":
                    // Get all comments
                    getComments(articleId)
                    // Change state to visible
                    $(this).attr("state", "visible");
                    // Change text
                    $(this).text("Hide Comments");
                    // Show this article's comment section
                    $(this).parent().next().show();
                    break;
                // If the button state is visible
                case "visible":
                    // Change state to hidden
                    $(this).attr("state", "hidden");
                    // Change text
                    $(this).text("View Comments");
                    // Hide this article's comment section
                    $(this).parent().next().hide();
                    break;
                default:
                    // Error: Should never happen; just in case
                    alert("Whoops, we made an error! Please try again later.")
            }
        });

        // When a submit button is clicked
        $(".submit-btn").on("click", function () {
            event.preventDefault();

            let articleId = $(this).attr("article-id");

            // Get comment name input and clear comment field
            let inputComment = $(this).prev().find("textarea").val();
            $(this).prev().find("textarea").val("");

            // Get name input and clear input field
            let inputName = $(this).prev().prev().find("input").val();
            $(this).prev().prev().find("input").val("");

            


           
            $.ajax(`/api/articles/${articleId}`, {
                type: "POST",
                data: {
                    name: inputName,
                    comment: inputComment
                }
            }).then(
                response => getComments(articleId)
            ).catch(
                err => console.log(err)
            );
        });
    });
})();