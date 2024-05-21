import { useRef, useState } from "react";
import env from "react-dotenv";
import io from 'socket.io-client'
import axios from 'axios';

const socket = io(process.env.REACT_APP_API_URL);
function App() {
  const [showNameField, setShowField] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userList, setUserList] = useState([]);
  const [showChatArea, setShowChatArea] = useState(false);
  const [interlocutor, setInterlocutor] = useState(null);
  const [chats, setChats] = useState([]);

  const chatAreaRef = useRef(null);
  const nameFieldRef = useRef(null);
  const chatFieldRef = useRef(null);
  const handleStartChat = ()=>{
    setShowField(true);
    console.log(process.env.REACT_APP_API_URL);
  }
  const handleStopChat = ()=>{

    socket.emit('remove-user', userName);
    setShowField(false);
    setUserName(null);
    setInterlocutor(null);
    setChats([]);
    setUserList([]);
    setShowChatArea(false);
    setShowField(false);
  }
  const handleChageName = async(e)=>{
    const user = nameFieldRef.current.value
    setUserName(nameFieldRef.current.value);
    console.log(user);
    setShowField(false);
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
    setShowChatArea(true);
    setUserList(res.data);
    // fetch users list
    // create socket
    socket.emit('new-user', user);
    
  }
  const selectInterlocutor = (user)=>{
    setInterlocutor(user);
    // setShowChatArea(true);
  }
  const handleChageMessage = ()=>{
    // send message througn api
    const message = chatFieldRef.current.value.trim();
    if(interlocutor!==null){
      setChats([...chats, {message: message, by: userName, private:true}])
      return;
    }
    setChats([...chats, {message: message, by: userName}])
    socket.emit('message', {message: message, by: userName, for: interlocutor})
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      chatFieldRef.current.value ='';
    }
  }
  socket.on('message', (message)=>{
    console.log('message.for!==null',message.for!==null)
    if(message.for!==null){
      if(message.for === userName)
        setChats([...chats, {message: message.message, by: message.by, private: true}])
      return;
    }
    else{
      setChats([...chats, {message: message.message, by: message.by}])
    }
    
  })
  socket.on('new-user', (users)=>{
    setUserList(users)
  })
  socket.on('remove-user', (user)=>{
    const newUser = userList.filter(name=>name!==user)
    setUserList(newUser);
  })
  return (
    <div className="h-full w-full">
      
      <div className="font-sans m-5 px-5 py-3 bg-gray-400 flex flex-row rounded-sm">
        <div className="text-4xl font-bold text-gray-700 w-4/6">Chat Application</div>
        <div className="w-2/6 grid justify-items-end">{ !showNameField && !userName ? <button className="text-xl text-center self-center bg-slate-600 text-white px-3 py-1 border-2 border-black rounded-lg hover:border-white hover:text-black hover:bg-zinc-300" onClick={handleStartChat}>Start Chat</button> : <button className="text-xl text-center self-center bg-slate-600 text-white px-3 py-1 border-2 border-black rounded-lg hover:border-white hover:text-black hover:bg-zinc-300" onClick={handleStopChat}>Stop Chat</button>}</div>
      </div>
      {
        showNameField &&
        <div className="flex m-5 space-x-4">
          <input ref={nameFieldRef} className="bg-gray-200 text-balck rounded-lg px-2 py-1 text-lg" placeholder="Enter your user name"/>
          <button className="text-lg text-center self-center bg-slate-600 text-white px-2 py-1 border-2 border-black rounded-lg hover:border-white hover:text-black hover:bg-zinc-300" onClick={handleChageName}>Submit</button>
        </div>
      }
      {
        userName ? <div className="text-2xl font-medium m-5">User: {userName}</div> : null
      }
      {
        interlocutor ? <div className="m-5"> <div className="text-2xl font-medium">Interlocutor: {interlocutor}</div> <button className="px-2 py-.5 bg-green-500 rounded-md" onClick={()=>{setInterlocutor(null)}}>Chat With All</button> </div>: null
      }
      {
        (userList ) ? <div className="m-6 cursor-pointer">{userList.filter(user=>user!==userName).map(user=><div onClick={()=>{selectInterlocutor(user)}}>Name: {user}</div>)}</div>:null
      }
      
      {
        showChatArea&&
        <div className="w-4/6 m-6">
          <div className="text-xl">Live chat</div>
          <div ref={chatAreaRef} className="h-96 bg-gray-300 flex flex-col rounded-md overflow-auto py-10 px-2">
            {chats? chats.map(chat=><div className={`mx-5 my-1  flex flex-col ${chat.by===userName?'self-end':'self-start'}`}><div className="text-sm font-normal self-end">{ chat.private? chat.for===userName ?"private msg by "+chat.by : chat.by===userName? "private msg to "+chat.for: chat.by : chat.by}</div><div className={`rounded-md px-2 py-.5 cursor-pointer ${chat.private? "bg-zinc-600": "bg-zinc-400"} text-lg font-bold`}>{chat.message}</div></div>): null}
          </div>
          <div className="flex">
            <textarea ref={chatFieldRef} className="text-md font-medium px-2 border-2 border-zinc-500 rounded-md w-5/6" placeholder="Enter your message here..."/>
            <button className="w-1/6 ms-5 bg-zinc-400 rounded-md text-xl border-2 border-black text-bold hover:bg-zinc-300 hover:border-zinc-700" onClick={handleChageMessage}>Send</button>
          </div>
        </div>
        
      }
    </div>
  );
}

export default App;
