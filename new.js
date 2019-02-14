(function(){
  let content = document.getElementsByClassName('content')[0]
  let blog = []
  let comments = []
  allTabs = Array.from(document.getElementsByTagName('A'))
  
  let contents = {
    '/home': `<h1>Home</h1>`,
    '/': `<div style="display:none;">hi</div>`,
    '/posts': `hi`,
    '/posts/${id}': `hi`,
    '/newPost': ` <div class="formCont">
    <form id="frm1" action="">
    <div class="form-group">
    title: <input type="text" class="form-control" id="tit" placeholder="enter your post" name="title" required>
    </div><br>
    <div class="form-group">
    author: <input type="text"   class="form-control"id="auth"  placeholder="enter your name" name="author" required></div><br><br>
    <div class="form-group">
    image: <input type="text"   class="form-control" id="img"  placeholder="enter your image" name="image" required></div><br><br>
    <input type="submit" class="btn btn-primary" value="Submit">
    </form>
    </div>`,
    '404': `<h1>404 ya m3lem ktoob root mtl the 5ale2  </h1>`
  }
  
  // content render handler
  function render (content, contents, pathName, formHandler) {

    // console.log(typeof contents[pathName] !== 'undefined')
    if (pathName === '/' || pathName === '/home') {
      document.querySelector('.yaser').classList.remove('hiden')
    } else {
      document.querySelector('.yaser').classList.add('hiden')
    }
    
    if (/^\/posts\/\d+$/.test(pathName)) {
      handlePost()
    } else if (contents[pathName]) {
      content.innerHTML = contents[pathName]
      if (pathName === '/posts') {
        fetch('http://localhost:3000/posts')
        .then(function (response) {
          return response.json()
        })
        .then(function (data) {
          blog = data
          console.log(blog)
          let sss = ''
          
          data.forEach(x => {
            let temp = `<div class="post-preview jumbotron jumbotron-fluid">
            <div class="container">
            <a href="/posts/${x.id}">
            <h2 class="post-title display-4">
            ${x.title}
            </h2>
            <div class="post-img" style=" border: 1px solid;border-radius:5px; width:400px; height:400px; margin: 20px 20px 20px 0px;">
            <img src="${x.image}" style="width:100%; height:100%" />
            </div>
            
            </a>
            <p class="post-meta lead">Posted by
            <a href="#" class="btn btn-primary btn-lg" >${x.author}</a>
            </p>
            </div>
            </div>`
            sss += temp
          })
          
          content.innerHTML = sss
          let allPosts = Array.from(document.querySelectorAll('.content a'))
          allPosts.forEach(post => {
            post.addEventListener('click', handlePost)
          })
        })
      } else if (pathName === '/newPost') {
        document.querySelector('#frm1').addEventListener('submit', formHandler)
      }
    } else {
      //   console.log(contents['404'], 'Maher is here ')
      content.innerHTML = contents['404']
    }
  }
  
  window.onload = function () {
    
    render(content, contents, window.location.pathname, formHandler)
    // handle the history state and render the previous page or the next depens the actions
    window.onpopstate = function (e) {
      e.preventDefault()
      render(content, contents, window.location.pathname, formHandler)
    }
    
    // add eventlistner to the tabs
    allTabs.forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        e.preventDefault()
        window.history.pushState(null, null, e.target.pathname)
        
        let pathName = e.target.pathname
        render(content, contents, pathName, formHandler)
      })
    })
  }

  
  //  handle rendrening the single post with form for comment
  function handlePost (e) {
    e.preventDefault()
    let pathName = e.path[1].pathname
    
    window.history.pushState(null, null, pathName)

    // retrieve the post id using regex
    let post_id = /\/posts\/(\d+)/g.exec(pathName)
    
    fetch(`http://localhost:3000/posts/${post_id[1]}`)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      let postTemp = `<div class="post-preview" id= "${data.id}">
      
      <h2 class="post-title" style="margin: 20px 20px 20px 20px;">
      ${data.title}
      </h2>
      <p class="post-meta" style="margin: 20px 20px 20px 20px;">Posted by
      <a href="#">${data.author}</a>
      </p>
      <div class="post-meta" style="border: 1px solid;border-radius:5px;width:200px; height:200px;margin: 20px 20px 20px 20px;">
      <img src="${data.image}" style="width:100%; height:100% "/>
      </div>
      </div>
      <div class="comment-list" style="margin: 20px 20px 20px 20px;"> </div>
      <div style="margin: 20px 20px 20px 20px;">
      <form id="frm2" action="">
      <div  class="form-group">
      comment: <input type="text" id="com" class="form-control" placeholder="enter your comment" name="comment" ><br>
      </div>
      <input type="submit" class="btn btn-primary" value="Submit">
      
      </form></div>
      `
      var filterdCom = []
      fetch(`http://localhost:3000/comments`)
      .then(function (response) {
        return response.json()
      })
      .then(function (allCom) {
        comments = allCom
        // console.log(comments, 'this is all comments ')
        filterdCom = comments.filter(comment => {
          //   console.log(comment.id, 'comments id')
          //   console.log(groups[1], 'post id')
          if (comment.postId + '' === groups[1]) {
            return true
          }
        })
        
        content.innerHTML = postTemp
        innerCom = document.querySelector('.comment-list')
        console.log(innerCom)
        filterdCom.forEach(singleFCom => {
          innerCom.innerHTML += `<div
                class="comment-item"
                style="transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;">
                ${ singleFCom.body }
              </div>`
        })
        document
        .querySelector('#frm2')
        .addEventListener('submit', commentsHandler)
      })
    })
  }
  // handle posting comments to the db
  function commentsHandler (e) {
    e.preventDefault()
    let commentPath = window.location.pathname
    let groups = /\/posts\/(\d+)/g.exec(commentPath)
    let comment = document.querySelector('#com').value
    document.querySelector('.comment-list').innerHTML += `<div style="display: block;
    width: 100%;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem .75rem;
    margin-bottom:10px;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;">${comment}</div>`
    let dataBlog = {
      body: comment,
      postId: groups[1]
    }
    fetch('http://localhost:3000/comments', {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(dataBlog), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(response => console.log('Success:', JSON.stringify(response)))
  .catch(error => console.error('Error:', error))
  document.querySelector('#com').value = ''
}

// form handler & post the input to the json file
function formHandler (e) {
  e.preventDefault()
  let title = document.querySelector('#tit').value
  let author = document.querySelector('#auth').value
  let image = document.querySelector('#img').value
  let dataBlog = {
    title: title,
    author: author,
    image: image
  }
  fetch('http://localhost:3000/posts', {
  method: 'POST', // or 'PUT'
  body: JSON.stringify(dataBlog), // data can be `string` or {object}!
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(response => console.log('Success:', JSON.stringify(response)))
.catch(error => console.error('Error:', error))
document.querySelector('#tit').value = ''
document.querySelector('#auth').value = ''
document.querySelector('#img').value = ''
}
}())