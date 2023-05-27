 // Fonction pour revenir en arrière
 function goBack() {
    $('#blog').html('</>')
    $.ajax({
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'GET',
    success: function (posts) {
      displayPosts(posts);
    }
  });
  }

  // Chargement des articles du blog
  $.ajax({
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'GET',
    success: function (posts) {
      displayPosts(posts, false);
    }
  });

  // Afficher les articles du blog
  function displayPosts(posts,hideAuthorName) {
    var blog = $('#blog');

    $.each(posts, function (index, post) {
      var postElement = $('<div class="card post"></div>');


      var title = $('<h2 class="titlePost"></h2>').text('Post '+(index + 1)+ ': '+post.title);
      var author = $('<p class="author"></p>').text('By');
       // AJAX request to retrieve the user associated with the post
       $.ajax({
        url: 'https://jsonplaceholder.typicode.com/users/' + post.userId,
        type: 'GET',
        success: function(user) {
          var listItem = $('<span> ' + user.name + '</span>');
          listItem.attr('data-post', JSON.stringify(post)); // Store the post data as an attribute

          author.append(listItem);
        },
        error: function(error) {
          console.log(error);
        }
      });
     
      var body = $('<p></p>').text(post.body);

      // Affichage des commentaires associés à l'article
      title.click(function () {
        $.ajax({
          url: 'https://jsonplaceholder.typicode.com/comments?postId=' + post.id,
          method: 'GET',
          success: function (comments) {
            displayComments(comments, post.body);
          }
        });
      });

      // Affichage des informations de l'auteur
      author.click(function () {
        $.ajax({
          url: 'https://jsonplaceholder.typicode.com/users/' + post.userId,
          method: 'GET',
          success: function (user) {
            displayAuthorInfo(user);
          }
        });
      });

      if(hideAuthorName) {
        postElement.append(title);
      }else {
        postElement.append(title, author);
      }
      
      blog.append(postElement);
    });
  }

  // Afficher les commentaires
  function displayComments(comments, body) {
    var goBack = $('<p class="back" onclick="goBack()">Home</p>')
    var postElement = $('<div class="commentsPost"></div>');
    var bodyPost = $('<p class="bodyPost"></p>').text(body);
    
    postElement.append(goBack)
    postElement.append(bodyPost)

    $.each(comments, function (index, comment) {
      var commentElement = $('<div class="comment"></div>');

      //var name = $('<p></p>').text('Name: ' + comment.name);
      //var email = $('<p></p>').text('Email: ' + comment.email);
      var body = $('<p></p>').text('Comment: ' + comment.body);

      commentElement.append( body);
      postElement.append(commentElement);
    });

    $('#blog').html(postElement);
  }

  // Afficher les informations de l'auteur
  function displayAuthorInfo(user) {
    var goBack = $('<p class="back" onclick="goBack()">Home</p>')
    var postElement = $('<div class="authorCard"></div>');
    postElement.append(goBack, postElement)

    var userIcon = $('<span class="icon glyphicon glyphicon-user"></span>')
    var emailIcon = $('<span class="icon glyphicon glyphicon-envelope"></span>')
    var linkIcon = $('<span class="icon glyphicon glyphicon-link"></span>')
    
    var name = $('<h2></h2>').text('Author: ' + user.name);
    var username = $('<p class="detail"></p>').text('Username: ' + user.username);
    var email = $('<p class="detail"></p>').text('Email: ' + user.email);
    var website = $('<p class="detail"></p>').text('Website: ' + user.website);

    // Afficher les articles de l'auteur
    //username.click(function () {
    $.ajax({
      url: 'https://jsonplaceholder.typicode.com/posts?userId=' + user.id,
      method: 'GET',
      success: function (posts) {
        displayPosts(posts,true);
      }
    });
    // });
    username.append(userIcon);
    email.append(emailIcon);
    website.append(linkIcon);
    postElement.append(name, username, email, website);
    $('#blog').html(postElement);
  }