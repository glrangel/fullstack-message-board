const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const postsElement = document.querySelector('.posts');
const limiterElement = document.querySelector('.limiter');
const API_URL = window.location.hostname === '127.0.0.1' ? 'http://localhost:5000/posts' : 'https://postmessage-api.now.sh/posts';

loadingElement.style.display = 'none';
limiterElement.style.display = 'none';

listAllPosts()

form.addEventListener('submit', (event)=> {
    //Gather data from form
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    // Put data in JS object
    const message = {
        name,
        content
    }
    // Display loading element
    form.style.display = 'none'
    loadingElement.style.display = '';

    // Send object to server
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
    .then(createdPost =>{
        console.log(createdPost);
        form.reset();
        limiterElement.style.display = '';
        loadingElement.style.display = '';
        setTimeout(() =>{
            form.style.display = '';
            limiterElement.style.display = 'none';
            loadingElement.style.display = 'none';
        }, 30000);
        listAllPosts();
        // loadingElement.style.display = 'none';
    })
});

function listAllPosts(){
    postsElement.innerHTML = '';
    fetch(API_URL)
    .then(response => response.json())
    .then(posts =>{
        console.log(posts);
        posts.reverse();
        posts.forEach(post =>{
            const div = document.createElement('div');
            div.className = "post";
            const header = document.createElement('h3');
            header.textContent = post.name;

            const contents = document.createElement('p');
            contents.textContent = post.content;
            contents.className = "indent"

            const dateCreated = document.createElement('small');
            dateCreated.textContent = post.created;
            dateCreated.className = "light-text"

            div.appendChild(header);
            div.appendChild(contents);
            div.appendChild(dateCreated);

            postsElement.append(div);
        }) ; 
    });
}