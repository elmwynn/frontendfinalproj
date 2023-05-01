
const createElemWithText = (userElement = "p", text= "", userClass) =>{
    newElement = document.createElement(userElement);
    newElement.innerText = text;
    if(userClass){
        newElement.className = userClass;
    }
    return document.body.appendChild(newElement);
}

const createSelectOptions = (data) =>{
    if(!data)
        return;
    else{
        const optionsArray = []
        for(let i = 0; i < data.length; i++){
            const option = document.createElement("option");
            option.textContent = data[i].name;
            option.value = data[i].id;
            optionsArray.push(option);
        }
        return optionsArray;
    }
}

const toggleCommentSection = (chosenPostID) => {
    const section = document.querySelector(`section[data-post-id="${chosenPostID}"]`);
    if(!chosenPostID)
        return;
    else if(!(section)){
        return null;
    }
    else{
        section.classList.toggle("hide")
        return section;
    }
}

const toggleCommentButton = (chosenPostID) =>{
    const button = document.querySelector(`button[data-post-id="${chosenPostID}"]`);
    console.log("from toggle function");
    console.log(chosenPostID);
    if(!chosenPostID)
        return;
    else if(!(button)){
        return null;
    }
    else{
        if(button.textContent === "Show Comments")
            button.textContent = "Hide Comments";
        else
            button.textContent = "Show Comments";
        
        return button;
    }
}

const deleteChildElements = (userElement) => {
    if(!(userElement instanceof Element))
        return;
    while(userElement.firstChild){
        userElement.removeChild(userElement.firstChild);
    }
    return userElement;
}

const addButtonListeners = () =>{
    const main = document.querySelector("main");
    const buttons = main.querySelectorAll("button");
    if(buttons){
        for(let i = 0; i < buttons.length; i++){
            postId = buttons[i].dataset.postId;
            buttons[i].addEventListener("click", (event) => {toggleComments(this.event, buttons[i].dataset.postId)});
        }
        return buttons;
    }
}

const removeButtonListeners = () =>{
    const main = document.querySelector("main");
    const buttons = main.querySelectorAll("button");
    if(buttons){
        for(let i = 0; i < buttons.length; i++){
            postId = buttons[i].dataset.postId;
            buttons[i].removeEventListener("click", (event) => {toggleComments(this.event, buttons[i].dataset.postId)});
        }
        return buttons;
    }
}

const createComments = (comment) =>{
    if(!comment)
        return;
    const fragment = document.createDocumentFragment();
    for(let i = 0; i < comment.length; i++){
        const newArticle = document.createElement("article");
        let name = document.createElement("h3");
        name.textContent = comment[i].name;
        const body = document.createElement("p");
        body.textContent = comment[i].body;
        const email = document.createElement("p");
        email.textContent = `From: ${comment[i].email}`;
        newArticle.append(name, body, email);
        fragment.append(newArticle);
    }
    return fragment;
}

const populateSelectMenu = (data) => {
    if(!data)
        return;
    const menuElement = document.getElementById("selectMenu");
    const optionArray = createSelectOptions(data);
    optionArray.forEach((option) => {
        menuElement.append(option);
    });
    return menuElement;
}


const getUsers = async() =>{
    const allUsers = await fetch("https://jsonplaceholder.typicode.com/users"); 
    const jsonUserData = await allUsers.json();
    return jsonUserData;
}


const getUserPosts = async(userID) =>{
    if(!userID || !(Number.isInteger(userID)))
        return;
    else{
        const allUserPosts = await fetch("https://jsonplaceholder.typicode.com/posts");
        const jsonUserPosts = await allUserPosts.json();
        const data = await jsonUserPosts.filter(body => {
            if(body.userId === userID)
                return body;
        });
        return data;
    }

}


const getUser = async(userID) =>{
    if(!userID || !(Number.isInteger(userID)))
        return;
    else{
        const users = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "GET",
        headers:{
            Accept: "application/json"
        }
        }); 
        const jsonUsers = await users.json();
        const data = jsonUsers.filter(user=>{
            if(user.id === userID){ 
                return user;
            }
        }); 
        return data[0];
    }
}


const getPostComments = async(postID) => {
    if(!postID || !(Number.isInteger(postID)))
        return;
    else {
        const comments = await fetch("https://jsonplaceholder.typicode.com/comments"); 
        const jsonComments = await comments.json();
        const data = await jsonComments.filter(comment =>{ 
            if(comment.postId === postID)
               return comment;
        });
        return data; 
    }
}

const displayComments = async(postID) =>{
    if(!postID)
        return;
    newSection = document.createElement("section");
    newSection.dataset.postId = postID;
    newSection.classList.add('comments', 'hide');
    comments = await getPostComments(postID);
    fragment = await createComments(comments);
    newSection.append(fragment);
    return newSection;
}

const createPosts = async(data) =>{
    if(!data)
        return;
    const fragment = document.createDocumentFragment();
    for(let i = 0; i < data.length; i++){
        const newArticle = document.createElement("article");
        const title = document.createElement("h2");
        title.textContent = data[i].title;
        const body = document.createElement("p");
        body.textContent = data[i].body;
        const postID = document.createElement("p");
        postID.textContent = `Post ID: ${data[i].id}`;
        const author = await getUser(data[i].userId);
        const authorElement =  document.createElement("p");
        authorElement.textContent = `Author: ${author.name} with ${author.company.name}`
        const companyCatchPhrase =  document.createElement("p");
        companyCatchPhrase.textContent = author.company.catchPhrase;
        const newButton = document.createElement("button");
        newButton.dataset.postId = data[i].id;
        newButton.textContent = "Show Comments";
        newArticle.append(title, body, postID, authorElement, companyCatchPhrase, newButton);
        const section = await displayComments(data[i].id);
        newArticle.append(section);
        fragment.append(newArticle);
    }
    return fragment;
}

const displayPosts = async (posts) =>{
    const main = document.querySelector("main");
    let element;
    if(posts){
        element = await createPosts(posts);
    }
   else{
        element = document.createElement("p");
        element.classList.add("default-text");
        element.textContent = "Select an Employee to display their posts.";
    }
    main.append(element);
    return element;

}

const toggleComments = (event, postID) => {
    if(!event || !postID)
        return;
    else{
        event.target.listener = true;
        return [toggleCommentSection(postID), toggleCommentButton(postID)];
    }
}

const refreshPosts = async (posts) => {
    if(!posts)
        return;
    const removeButtons = removeButtonListeners()
    const main = deleteChildElements("main");
    const fragment = await displayPosts(posts);
    const addButtons =  addButtonListeners();
    return [
        removeButtons, main, fragment, addButtons
    ];
}

const selectMenuChangeEventHandler = async (event) => {
    if(!event)
        return;
    const menuElement = document.getElementById("selectMenu")
    menuElement.disabled = true
    const userId = event.target.value || 1;
    const posts = await getUserPosts(userId);
    const refreshPostArray = await refreshPosts(posts);
    menuElement.disabled = false;
    return [userId, posts, refreshPostArray];
}

const initPage = async() => {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}

const initApp = () => {
    initPage();
    const menuElement = document.getElementById("selectMenu");
    menuElement.addEventListener("change", selectMenuChangeEventHandler, false);
    document.addEventListener("DOMContentedLoaded", initApp, false);
}