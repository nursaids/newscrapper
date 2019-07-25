
"use strict";


(function () {
    
    $(document).ready(function () {
        
        function deleteComment(commentId, articleId) {
        
            $.ajax(`/api/articles/${articleId}/comments/${commentId}`, {
                type: 'DELETE'
            }).then(
                // FIXME:
                response => {
                    getComments(articleId);
                }
            ).catch(
                err => console.log(err)
            );
        };

        
        function displayComment(articleId, previousCommentsDiv, commentObj) {
            

           
            let cardDivEl = $("<div>").addClass("card article-comment");

           
            let cardHeaderDivEl = $("<div>").addClass("card-header");
            
            let nameEl = $("<p>").addClass("comment-name").text(commentObj.name);
           
            let deleteButtonEl = $("<button>").addClass("btn btn-light delete-btn").attr("comment-id", commentObj._id).text("Delete");
            
            deleteButtonEl.on("click", () => deleteComment(commentObj._id, articleId));
            
            cardHeaderDivEl.append(nameEl);
            cardHeaderDivEl.append(deleteButtonEl);
           
            cardDivEl.append(cardHeaderDivEl);

            
            let cardBodyDivEl = $("<div>").addClass("card-body");
           
            let cardTextEl = $("<p>").addClass("card-text").text(commentObj.comment);
            
            cardBodyDivEl.append(cardTextEl);
            
            cardDivEl.append(cardBodyDivEl);

            
            previousCommentsDiv.append(cardDivEl);
        }

       
        function getComments(articleId) {
   
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
                    
                    getComments(articleId)
                   
                    $(this).attr("state", "visible");
                    
                    $(this).text("Hide Comments");
                    
                    $(this).parent().next().show();
                    break;
                
                case "visible":
                   
                    $(this).attr("state", "hidden");
                    
                    $(this).text("View Comments");
                    
                    $(this).parent().next().hide();
                    break;
                default:
                    
                    alert("Error! Please try again.")
            }
        });

        
        $(".submit-btn").on("click", function () {
            event.preventDefault();

            let articleId = $(this).attr("article-id");

            
            let inputComment = $(this).prev().find("textarea").val();
            $(this).prev().find("textarea").val("");

            
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