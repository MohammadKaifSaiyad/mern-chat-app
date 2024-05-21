import { useRef, useState } from "react";
import env from "react-dotenv";

function App() {
  const [showNameField, setShowField] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userList, setUserList] = useState(null);
  const [showChatArea, setShowChatArea] = useState(false);
  const [interlocutor, setInterlocutor] = useState(null);
  const [chats, setChats] = useState([{message:'Hello', by:'self'},{message:'Hello!', by:'other'},{message:'Do I know you?', by:'other'},{message:'Hello', by:'self'},{message:'Hello!', by:'other'},{message:'Do I know you?', by:'other'},{message:'Hello', by:'self'},{message:'Hello!', by:'other'},{message:'Do I know you?', by:'other'},{message:'Hello', by:'self'},{message:'Hello!', by:'other'},{message:'Do I know you?', by:'other'},{message:'Hello', by:'self'},{message:'Hello!', by:'other'},{message:'Do I know you?', by:'other'},{message:'Hello', by:'self'},{message:'Hello!', by:'other'},{message:'Do I know you?', by:'other'}]);

  const chatAreaRef = useRef(null);
  const nameFieldRef = useRef(null);
  const chatFieldRef = useRef(null);
  const handleStartChat = ()=>{
    setShowField(true);
    console.log(process.env.REACT_APP_API_URL);
  }
  const handleStopChat = ()=>{
    setShowField(false);
    setUserName(null);
    setInterlocutor(null);
    setChats([]);
    setUserList(null);
    setShowChatArea(false);
    setShowField(false);
  }
  const handleChageName = (e)=>{
    setUserName(nameFieldRef.current.value);
    console.log(nameFieldRef.current.value);
    setShowField(false);
    // fetch users list
    setUserList([{name:'kaif',_id:83939939393},{name:'kamil',_id:83939939394},{name:'atiyyah',_id:83939939392}]);
  }
  const selectInterlocutor = (user)=>{
    setInterlocutor(user.name);
    setShowChatArea(true);
  }
  const handleChageMessage = ()=>{
    // send message througn api
    setChats([...chats, {message: chatFieldRef.current.value, by: 'self'}])
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      chatFieldRef.current.value ='';
    }
  }
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
        userList && !interlocutor ?<div className="m-6 cursor-pointer">{userList.filter(user=>user.name!==userName).map(user=><div onClick={()=>{selectInterlocutor(user)}}>Name: {user.name}</div>)}</div>:null
      }
      {
        interlocutor ? <div className="text-2xl font-medium m-5">Interlocutor: {interlocutor}</div> : null
      }
      {
        showChatArea&&
        <div className="w-4/6 m-6">
          <div className="text-xl">Live chat</div>
          <div ref={chatAreaRef} className="h-96 bg-gray-300 flex flex-col rounded-md overflow-auto py-10 px-2">
            {chats? chats.map(chat=><div className={`mx-5 my-0.5 rounded-md px-2 py-.5 cursor-pointer bg-zinc-400 text-lg font-bold ${chat.by=='self'?'self-end':'self-start'}`}>{chat.message}</div>): null}
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
