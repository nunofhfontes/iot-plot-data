import React, { useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis } from 'recharts';

// model for data storage
interface Message {
  id: number
  timestamp: string
  temperature: number
  data: number
}

// model for data presentation
interface CombinedMessage {
  id?: number
  time: string
  temperature1?: number
  data1?: number
  temperature2?: number
  data2?: number
}

const App = () => {
  const [toggleConnection, setToggleConnection] = useState(false)
  const [connected, setConnected] = useState(false)
  const [messages1, setMessages1] = useState<Message[]>([]);
  const [messages2, setMessages2] = useState<Message[]>([]);
  const [combinedData, setCombinedData] = useState<CombinedMessage[]>([]);

  // used useRef to get the same socket 
  const socket = useRef<WebSocket>();
 
  useEffect(() => {

    // function that checks socket state periodically, and triggers the useEffect hook
    // when we're dealing with error on socket connection
    // tries to reconnect the socket every 10 seconds if no connection was sucessfull
    const checkSocketConnection = () => {
      setTimeout(() => {
        if(socket.current?.CLOSED) {
          setConnected(false)
          setToggleConnection(!toggleConnection)
        }
      }, 10000);
    }

    // socket adderess should be an env variable set on .env file
    socket.current = new WebSocket('ws://localhost:8999')

    // when socket connection is OPEN, presents toast and sets state connectiont to true
    socket.current.onopen = (e) => {
      setConnected(true);
      toast.dismiss();
      toast.success("Connected to socket!", {
        autoClose: 3000,
        hideProgressBar: false,
      });
    }

    socket.current.onmessage = (event) => {

      let parsedMessages: Message[] = JSON.parse(event.data);

      //Add messages to state
      let newMessage1: Message[] = parsedMessages.filter(message => message.id === 1 && message.data < 100 );
      setMessages1((previousMessages1) => {
        return previousMessages1?.concat(newMessage1)
      });
      let newMessage2: Message[] = parsedMessages.filter(message => message.id === 2 && message.data < 100 );
      setMessages2((previousMessages2) => {
        return previousMessages2?.concat(newMessage2)
      });

      let timestamp = parsedMessages[0].timestamp;
      let date = new Date(timestamp);
      let formatedDate = date.getUTCHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();

      let combinedMessagesData: CombinedMessage = {
        time: formatedDate,
        temperature1: 0,
        temperature2: 0
      };

      if(newMessage1.length === 1) {
        combinedMessagesData.data1 = newMessage1[0].data;
        combinedMessagesData.temperature1 = newMessage1[0].temperature;
      }
      if(newMessage2.length === 1) {
        combinedMessagesData.data2 = newMessage2[0].data;
        combinedMessagesData.temperature2 = newMessage2[0].temperature;
      }

      setCombinedData((previousData) => {
        return previousData?.concat(combinedMessagesData)
      });
    }

    // when we get errors on socket connection, the checkSocketConnection function is run 
    // for reconnection
    // toast is presented accordingly
    socket.current.onerror = (e) => {
      console.log(e);
      toast.dismiss();
      toast.error("Error connecting to socket!");
      checkSocketConnection();
      setConnected(false);
    }

    // Toast is presented when socket connection is CLOSED
    socket.current.onclose = (ev: CloseEvent) => {
      toast.warn("Socket Connection is Closed!");
    }

    return () => {
      console.log("Closing Socket!");
      socket.current?.close();
    }
   
    // this variable toggleConnection is strictly used to trigger the use useEffect hook
    // when we're getting an error when connection to the server
  }, [toggleConnection])

  return (
    <div className="app">
      <div className="appHeader">
        <div className="title title--primmary ">Wiliot</div>
        <div className="title title--secondary">Test</div>
      </div>
      <hr></hr>
      {
        connected && 
        <>
          <LineChart className='chart--center'
            width={1100}
            height={600}
            data={combinedData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="data1" stroke="#8884d8" activeDot={{ r: 8 }} yAxisId={0} />
            <Line type="monotone" dataKey="data2"stroke="#82ca9d" yAxisId={1} />
          </LineChart>
        </>
      }

      <ToastContainer position="top-right" autoClose={2000}/>
    </div>
  );
}

export default App;
