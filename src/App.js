import { useState,useEffect } from "react";

const App = () =>
{ 
  const [value,setValue] = useState(null); //input message
  const[message, setMessage] = useState(null); // output message
  const[previousChat, setPreviousChat] = useState([]);
  const[currentTitle, setCurrentTitle] = useState(null);
  const handleClick = (uniqueTitle) => 
  {
    setCurrentTitle(uniqueTitle);
    setValue("");
    setMessage(null);
  }
  const clearChat = ()=>
  {
    setCurrentTitle(null);
    setValue("");
    setMessage(null);
  }
  const getMessages = async () =>
  {
    const options = {
      method : "POST",
      body : JSON.stringify(
        {
          message: value
        }
      ),
      headers : {
        "Content-Type": 'application/json'
      }
    }
      try
      {
          const response = await fetch('http://localhost:8000/completions',options);
          const data = await response.json();
          setMessage(data.choices[0].message);
      } catch (error) {
          console.error(error);
      }

  }


  useEffect(()=>{
    console.log(currentTitle,value,message);
    if(!currentTitle && value && message)
    {
      setCurrentTitle(value);
    }
    if(currentTitle && value && message)
    {
      setPreviousChat(prevChats => 
        (
          [...prevChats,
          {
            title: currentTitle,
            role: 'User',
            content: value 
          },
        { 
            title: currentTitle,
            role: message.role,
            content: message.content
        }]
        ))
    }
  },[message,currentTitle])

    console.log(previousChat);  

    const currentChat = previousChat.filter(previousChat => previousChat.title === currentTitle);
    const uniqueTitles = Array.from(new Set (previousChat.map(previousChat => previousChat.title)))
    console.log(uniqueTitles)

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={clearChat}>+ New Chat</button>
        <ul className="history">
            {uniqueTitles?.map((uniqueTitle , index) => <li key={index} onClick={()=>handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Subhayan</p>
        </nav>
      </section>
      <section className="main">
         {!currentTitle && <h1>ConvoCraft v.1.0</h1>}
        <ul className="feed"> 
          {currentChat?.map((chatMessage, index) => <li key={index}>
              <p className="role">{chatMessage.role === 'User'?'You: ':'ConvoCraft: '}</p>
              <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e)=>setValue(e.target.value)} onKeyDown={(e)=>{
              if(e.key === "Enter")
                getMessages();
            }}/>
            <div id="submit" onClick={getMessages}>➤</div>
          </div>
          <p className="info">
          ConvoCraft version 1.0, based on the GPT-3.5 architecture, 
          is a conversational AI developed by OpenAI for 
          generating human-like text responses.
          </p>
        </div>
      </section>
    </div>
  )
}

export default App