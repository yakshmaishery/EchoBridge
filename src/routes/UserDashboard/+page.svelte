<script lang="ts">
   import * as Sidebar from "$lib/components/ui/sidebar/index.js";
   import AppSidebar from "$lib/MyComponents/AppSlider.svelte";
   import ChatWindow from "$lib/UserDashboardWindows/ChatWindow.svelte";
   import ContactWindow from "$lib/UserDashboardWindows/ContactWindow.svelte";
   import HomeWindow from '$lib/UserDashboardWindows/HomeWindow.svelte'
   import NoticeWindow from "$lib/UserDashboardWindows/NoticeWindow.svelte";
   import TutorialWindow from "$lib/UserDashboardWindows/TutorialWindow.svelte";
   import VideoChatWindow from "$lib/UserDashboardWindows/VideoChatWindow.svelte";
   import {Peer} from 'peerjs'
   import {nanoid} from 'nanoid'
   import Swal from 'sweetalert2';
   import { io } from "socket.io-client";
   import { onMount } from "svelte";
    import ConnectionWIndow from "$lib/UserDashboardWindows/ConnectionWIndow.svelte";
   let Window = "Home"
   let UserID = ""
	let AnotherID = ""
	let UserMessage = ""
	let conn:any
   let VulnerableMessages = ["jhzxkdvbuyizxv","CHATLEAVECODE","SharedScreenzjhgdvzjvguyzgv","StopScreenzjhgdvzjvguyzgv","SharedCamerazjhgdvzjvguyzgv","StopCamerazjhgdvzjvguyzgv"]
   let CameraOpen = false
   let ScreenOpen = false
   let CameraStream:any = null
   let cameraSide:string = "user"
   let videodata:HTMLVideoElement
   let videodataCamera:HTMLVideoElement
   let anotheruserscreen = ""
   const CHUNK_SIZE = 64 * 1024; // 64KB chunks
   const receivedBuffers:any = {};
   const fileInfo:any = {};
   let Progressvalue = 0;
   let Progressmax = 0;
   let downloadfileList:{filename:string,base64:string,filesize:string,datetime:string}[] = []
   let ConnectionType = "Peer"
   let IsConnected:boolean = false
   let ServerAPI = "https://echobridge-server.onrender.com/"
   let socket: any;
   let ConversationLogMessages:{MessageType:string,Message:string,datetime:string,loginID:string}[] = []

   const shortdummyID = nanoid(4).toLowerCase() // Generate Random User ID
   var peer = new Peer(shortdummyID,{secure:true,config: {
      iceServers: [
         {
            urls: "turn:relay.metered.ca:443?transport=tcp",
            username: "efNzdT63A5L0vG0r6wh7G",
            credential: "hjaDGtqQvJYfKf3k"
         }
      ]
   }}) // Create Peer

   peer.on("open",(id) => { // Connect Peer if Success set the ID
      UserID = id
   })

   peer.on('error', (err) => { // IF Peer connection fails
      if(err.type == "invalid-id"){
         location.reload()
      }
      else{
         Swal.fire({icon:"error",title:"PEER CONNECTION:- "+err.type,confirmButtonColor: "green"})
      }
   });

   onMount(() => {
      socket = io(ServerAPI); // Replace with your server's URL
      // Connect to Socket
      socket.on('connect', () => {
         console.log('Connected to the server');
      });

      socket.on('Requestanother', (data:any) => {
         if(data.AnotherID == UserID){
            AnotherID = data.UserID
            IsConnected = true
            ConnectionType = "Socket"
            socket.emit("Requestanotheraccept",{msg:"Success",UserID:AnotherID,AnotherID:UserID})
            Swal.fire({icon:"success",title:`Connection has been established with ${AnotherID}`,confirmButtonColor: "green",timer:1500,showConfirmButton:false})
         }
      })
      socket.on('RequestUsercallback', (data:any) => {
         if(data.UserID == UserID){
            IsConnected = true
            ConnectionType = "Socket"
            Swal.fire({icon:"success",title:"Connected successfully",confirmButtonColor: "green",timer:1500,showConfirmButton:false})
         }
      })
      socket.on('CHATLEAVECODEAnother', (data:any) => {
         if(data.AnotherID == UserID){
            socket.disconnect()
            location.href = "/"
         }
      })
      socket.on('CHATMESSAGESAnother', (data:any) => {
         if(data.AnotherID == UserID){
            ConversationLogMessages.push({Message:data.Message,MessageType:"Reciever",datetime:data.datetime,loginID:data.loginID})
            ConversationLogMessages = ConversationLogMessages
         }
      })
   })

   // Connect with another person
   function ConnectwithUserFirst(){
      debugger
      AnotherID = AnotherID.toLowerCase()
      conn = peer.connect(AnotherID)
      conn.on("open",function(){
         IsConnected = true
         ConnectionType = "Peer"
         conn.send({type:"text",message:"jhzxkdvbuyizxv"})
         Swal.fire({icon:"success",title:"Connected successfully",confirmButtonColor: "green",timer:1500,showConfirmButton:false})
      })
      conn.on('error', (err:any) => {
         Swal.fire({icon:"error",title:err.type,confirmButtonColor: "green"})
      });
      conn.on("iceStateChanged",(state:any)=>{
         console.warn("iceStateChanged",state)
      })
      setTimeout(() => {
         if(!IsConnected){
            SocketConnectionInitiate()
         }
      }, 3000);
   }

   // Initiate Socket Connection
   function SocketConnectionInitiate(){
      socket.emit("RequestConnection",{UserID,AnotherID})
   }

   peer.on('connection', function(inconn) {
      inconn.on('data', function(data:any){
         let msgtype = data.type
         if(msgtype == "text"){
            if(data.message == "jhzxkdvbuyizxv"){
               AnotherID = inconn.peer
               conn = peer.connect(AnotherID)
               conn.on("open",function(){
                  IsConnected = true
                  Swal.fire({icon:"success",title:`Connection has been established with ${AnotherID}`,confirmButtonColor: "green",timer:1500,showConfirmButton:false})
               })
            }
            else if(data.message == "CHATLEAVECODE"){
               // If leave
               if(ConnectionType == "Peer"){
                  conn.close()
                  location.href = "/"
               }
            }
         }

         if(msgtype == "chat"){
            ConversationLogMessages.push({Message:data.chatdata.Message,MessageType:"Reciever",datetime:data.chatdata.datetime,loginID:data.chatdata.loginID})
            ConversationLogMessages = ConversationLogMessages
         }
      })
   })

   // Leave Connection
	const LeaveConnection = () => {
      if(ConnectionType == "Peer"){
         conn.send({type:"text",message:"CHATLEAVECODE"})
         conn.close()
         location.href = "/"
      }
      else{
         socket.emit("CHATLEAVECODE",{AnotherID})
         socket.disconnect()
         location.href = "/"
      }
   }

   const SendMessage = () => {
      ConversationLogMessages.push({Message:UserMessage,MessageType:"Sender",datetime:getFormattedDateTime(),loginID:UserID})
      ConversationLogMessages = ConversationLogMessages
      if(ConnectionType == "Peer"){
         conn.send({type:"chat",chatdata:{Message:UserMessage,MessageType:"Sender",datetime:getFormattedDateTime(),loginID:UserID}})
      }
      else{
         socket.emit("CHATMESSAGES",{Message:UserMessage,MessageType:"Sender",datetime:getFormattedDateTime(),loginID:UserID,AnotherID:AnotherID})
      }
      UserMessage = ""
   }
   function getFormattedDateTime() {
      const now = new Date();

      const pad = (n:any) => n.toString().padStart(2, '0');

      const day = pad(now.getDate());
      const month = pad(now.getMonth() + 1); // Months are 0-indexed
      const year = now.getFullYear();

      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());

      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
   }
 </script>
  <svelte:head>
   <title>EchoBridge</title>
 </svelte:head>
 <Sidebar.Provider>
   <AppSidebar bind:Window />
   <main style="width: 100%;">
     <Sidebar.Trigger />
     <!-- {@render children?.()} -->
      <div style={`content-visibility:${Window=="Home"?"auto":"hidden"}`}>
         <HomeWindow bind:AnotherID bind:UserID on:ConnectwithUserFirst={ConnectwithUserFirst} on:LeaveConnection={LeaveConnection}/>
      </div>
      <div style={`content-visibility:${Window=="Chat"?"auto":"hidden"}`}>
         <ChatWindow bind:ConversationLogMessages bind:IsConnected bind:UserMessage on:SendMessage={SendMessage}/>
      </div>
      <div style={`content-visibility:${Window=="videocall"?"auto":"hidden"}`}>
         <VideoChatWindow/>
      </div>
      <div style={`content-visibility:${Window=="Tutorial"?"auto":"hidden"}`}>
         <TutorialWindow/>
      </div>
      <div style={`content-visibility:${Window=="Notice"?"auto":"hidden"}`}>
         <NoticeWindow/>
      </div>
      <div style={`content-visibility:${Window=="Contact"?"auto":"hidden"}`}>
         <ContactWindow/>
      </div>
      <div style={`content-visibility:${Window=="ConnectionWindow"?"auto":"hidden"}`}>
         <ConnectionWIndow bind:ConnectionType bind:IsConnected/>
      </div>
   </main>
 </Sidebar.Provider>