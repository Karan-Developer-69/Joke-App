let chatContainer = document.getElementById('chats')

let usermsg = '';
let botmsg = '';
let chats = [];
var crntChatID = null;
let crntChat = {}


loadChats();
function loadChats(){
    if(localStorage.getItem('chats') ) {
        chats = JSON.parse(localStorage.getItem('chats'))
        let cluster = ''
        chats.forEach((chat)=>{
            cluster += `<div onClick="loadChatData(${chat.chatId})" class="chat w-full h-[10%] text-center content-center cursor-pointer">${chat.title}</div>`
        })
        
        chatContainer.innerHTML = cluster;
    }
}

function newChat(){

    let title = prompt('Enter chat title.')
    if(title !== null){
        let chatId = Math.random() * 9999999
        let newChat = `<div onClick="loadChatData(${chatId})" class="chat w-full h-[10%] text-center content-center cursor-pointer">${title}</div>`
        crntChatID = chatId
        chatContainer.innerHTML += newChat
        let chat = {
            title:title,
            chatId:chatId,
            msgList:[],
        }
        chats.push(chat)
        loadChatData(chatId)
    }
}

function loadChatData(id){
    crntChatID = id;
    localStorage.setItem('chatId',id)
    chats.forEach((chat)=>{
        chat.chatId === id ? crntChat = chat : null
    })

    let messageContainer = document.getElementById('messages');
    messageContainer.innerHTML = ''
    crntChat.msgList.forEach((msg,index)=>{
        index % 2 === 0 ? messageContainer.innerHTML += `<div class="usermessage max-w-[70%]  p-4 bg-green-500 text-white ">${msg}</div>` : messageContainer.innerHTML += `<div class="botmessage max-w-[70%] p-4 bg-white ">${msg}</div>`
    })
    localStorage.setItem('chats',JSON.stringify(chats))
}

async function sendAndReciveMsg(id){
    let sendMsg = document.getElementById('input');
    let chatIndex = chats.indexOf(crntChat);
    chats[chatIndex].msgList.push(sendMsg.value);
    loadChatData(id)
    sendMsg.value = '';


    let reciveMsg = await generateJoke();
    chats[chatIndex].msgList.push(reciveMsg);
    loadChatData(id)
}

async function generateJoke(){

    const config = {
        headers: {
        Accept: 'application/json',
        }
    }

    const res = await fetch('https://hindi-jokes-api.onrender.com/jokes?api_key=078a738bcb9bf36766b7b1f24088', config)

    const data = await res.json()

    return data.jokeContent
}

let btn = document.getElementById('menu-btn');
let menu = document.getElementById('menu');
let toggle=false;
btn.addEventListener('click',()=>{
    toggle ? menu.classList.replace('block','hidden') : menu.classList.replace('hidden','block')
    toggle = !toggle
})

document.getElementById('input').addEventListener('keypress',(event)=>{
    if (event.key === "Enter") {
        sendAndReciveMsg(crntChatID)
    }
})