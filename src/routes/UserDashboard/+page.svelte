<script lang="ts">
   export let data
   import * as Sidebar from "$lib/components/ui/sidebar/index.js";
   import AppSidebar from "$lib/MyComponents/AppSlider.svelte";
   import ChatWindow from "$lib/UserDashboardWindows/ChatWindow.svelte";
   import ContactWindow from "$lib/UserDashboardWindows/ContactWindow.svelte";
   import HomeWindow from '$lib/UserDashboardWindows/HomeWindow.svelte'
   import NoticeWindow from "$lib/UserDashboardWindows/NoticeWindow.svelte";
   import TutorialWindow from "$lib/UserDashboardWindows/TutorialWindow.svelte";
   import VideoChatWindow from "$lib/UserDashboardWindows/VideoChatWindow.svelte";
   import {Peer} from 'peerjs'
   import {nanoid,customAlphabet} from 'nanoid'
   import Swal from 'sweetalert2';
   import { io } from "socket.io-client";
   import { onMount } from "svelte";
   import ConnectionWIndow from "$lib/UserDashboardWindows/ConnectionWIndow.svelte";
   import ShareScreenWindow from "$lib/UserDashboardWindows/ShareScreenWindow.svelte";
   import { Progress } from "$lib/components/ui/progress/index.js";
   import * as Table from "$lib/components/ui/table/index.js";
   import { Download } from "@lucide/svelte";
   import {SocketURL} from '$lib/Stores'
   import fixWebmDuration from 'webm-duration-fix';
   import ScreenRecorder from "$lib/UserDashboardWindows/ScreenRecorder.svelte";
   import SnippingtoolWindow from "$lib/UserDashboardWindows/SnippingtoolWindow.svelte";
   import { page } from '$app/stores';
   import { Separator } from "$lib/components/ui/separator/index.js";
   import CanvasWindow from "$lib/UserDashboardWindows/CanvasWindow.svelte";
   import SessionManagement from "$lib/UserDashboardWindows/SessionManagement.svelte";
    import FormatterWindow from "$lib/UserDashboardWindows/FormatterWindow.svelte";
   let Window = "Home" // Current Window
   let UserID = "" // Current UserID 4 digit
	let AnotherID = ""// Another UserID 4 digit
	let UserMessage = ""// Chat Message variable
	let conn:any// Peer JS Connection
   let CameraOpen = false// Camera connection open or close
   let ScreenOpen = false// Screen share connection open or close
   let CameraStream:any = null// Camera stream
   let cameraSide:string = "user"// Camera front/back side
   let videodata:HTMLVideoElement// Screen share video tag
   let videodataCamera:HTMLVideoElement// Camera video tag
   let SnippingToolVideo:HTMLVideoElement// Snipping tool window
   let anotheruserscreen = ""// change another person window according to share screen or camera
   const CHUNK_SIZE = 64 * 1024; // 64KB chunks
   const receivedBuffers:any = {};// file transfer temp array
   const fileInfo:any = {};// file transfer list
   let Progressvalue = 0;
   let Progressmax = 0;
   let downloadfileList:{filename:string,base64:string,filesize:string,datetime:string,filesendtype:string}[] = []
   let ConnectionType = "Peer"// Connection Type Peer/Socket
   let IsConnected:boolean = false// Connection is connected or not.
   let ServerAPI = SocketURL// Socket IO Server URL
   let socket: any;// Socket Connection
   let ConversationLogMessages:{MessageType:string,Message:string,datetime:string,loginID:string}[] = []// Chat window messages log
   let recordedData: BlobPart[] = []
   let RecordExist:boolean = false
   let RecordingFileName = ""
   let Snippingtoolfilename = ""
   const numbersOnlyNanoid = customAlphabet('0123456789', 4); // 4 digits
   let PageloadsidebarOpen = true
   let CallbackofFiledownloaded = false
   let Windowtitle = ""
   // let CurrentIP:string = data.ip
   let CurrentIP:string = ""

   if($page.url.searchParams.size){
      let redirectWin:any = $page.url.searchParams.get("redirect")
      if(redirectWin != ""){
         Window = redirectWin
         PageloadsidebarOpen = false
      }
   }

   // const shortdummyID = nanoid(4).toLowerCase() // Generate Random User ID
   let shortdummyID = numbersOnlyNanoid() // Generate Random User ID
   if(data.UserIDDeafult){
      console.warn("data.UserIDDeafult",data.UserIDDeafult)
      shortdummyID = data.UserIDDeafult
   }
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
         setTimeout(() => {
            if(ConnectionType == "Peer"){
               if(IsConnected){
                  location.href = "/"
               }
            }
         }, 300);
         Swal.fire({icon:"error",title:"PEER CONNECTION:- "+err.type,confirmButtonColor: "green"})
      }
   });

   peer.on("disconnected",()=>{
      if(ConnectionType == "Peer"){
         if(IsConnected){
            location.href = "/"
         }
      }
   })

   onMount(() => {
      socket = io(ServerAPI); // Replace with your server's URL
      // Connect to Socket
      socket.on('connect', () => {
         console.warn(SocketURL)
         console.warn('Connected to the server');
      });

      socket.on("disconnect",()=>{
         if(ConnectionType == "Socket"){
            location.href = "/"
         }
      })
      
      socket.on("connect_error",()=>{
         if(ConnectionType == "Socket"){
            location.href = "/"
         }
      })

      socket.on('Requestanother', (data:any) => {
         if(data.AnotherID == UserID){
            AnotherID = data.UserID
            IsConnected = true
            ConnectionType = "Socket"
            socket.emit("Requestanotheraccept",{msg:"Success",UserID:AnotherID,AnotherID:UserID})
            Swal.fire({icon:"success",html:`<strong>Connection has been established with <b>${AnotherID}</b> under SOCKET Connection</strong>`,confirmButtonColor: "green",timer:3000,showConfirmButton:false})
            Windowtitle = AnotherID
         }
      })
      socket.on('RequestUsercallback', (data:any) => {
         if(data.UserID == UserID){
            IsConnected = true
            ConnectionType = "Socket"
            Swal.close()
            Swal.fire({icon:"success",title:"Connected successfully",confirmButtonColor: "green",timer:3000,showConfirmButton:false})
            Windowtitle = AnotherID
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
            if(Window != "Chat"){
               Swal.fire({icon:"info",title:`You got a message!`,confirmButtonColor: "green",timer:3000,showConfirmButton:false})
            }
            scrolldownmessages()
         }
      })
      socket.on('startFileTransferAnother', (data:any) => {
         if(data.AnotherID == UserID){
            fileInfo[data.name] = { size: data.size, received: 0 };
            receivedBuffers[data.name] = [];
            Progressvalue=0
         }
      })
      socket.on('chunkFileTransferAnother', (data:any) => {
         if(data.AnotherID == UserID){
            receivedBuffers[data.name].push(data.data);
            fileInfo[data.name].received += data.data.byteLength;
            Progressvalue=fileInfo[data.name].received
            Progressmax = fileInfo[data.name].size
            // console.log(`Received ${fileInfo[data.name].received} of ${fileInfo[data.name].size}`);
         }
      })
      socket.on('endFileTransferAnother', (data:any) => {
         if(data.AnotherID == UserID){
            const received = new Blob(receivedBuffers[data.name]);
            downloadfileList.push({filename:data.name,base64:URL.createObjectURL(received),filesize:bytesToKB(Progressmax.toString()),datetime:new Date().toString(),filesendtype:"Received"})
            downloadfileList = downloadfileList
            Progressmax = 0
            Progressvalue = 0
            delete receivedBuffers[data.name];
            delete fileInfo[data.name];
            if(Window!="File Transfer"){
               Swal.fire({icon:"success",title:"You have received an file go to File Transfer!",confirmButtonColor: "green",showConfirmButton:false,timer:3000})
               socket.emit("endFileTransferAnotherCALLBACK",{msg:"Success",UserID:AnotherID,AnotherID:UserID})
            }
         }
      })
      socket.on('endFileTransferUserCALLBACK', (data:any) => {
         if(data.UserID == UserID){
            CallbackofFiledownloaded = false
         }
      })
      getIP()
   })

   // Connect with another person
   function ConnectwithUserFirst(){
      debugger
      if(AnotherID){
         if(AnotherID.length==4){
            Swal.fire({
            title: 'Loading...',
            html: 'Please wait while we process your request.',
            allowOutsideClick: false,
            didOpen: () => {
               Swal.showLoading()
            }
            });

            AnotherID = AnotherID.toLowerCase()
            conn = peer.connect(AnotherID)
            conn.on("open",function(){
               Swal.close()
               IsConnected = true
               ConnectionType = "Peer"
               conn.send({type:"text",message:"jhzxkdvbuyizxv"})
               Swal.fire({icon:"success",title:"Connected successfully",confirmButtonColor: "green",timer:3000,showConfirmButton:false})
               Windowtitle = AnotherID
            })
            conn.on('error', (err:any) => {
               Swal.fire({icon:"error",title:err.type,confirmButtonColor: "green"})
            });
            conn.on("iceStateChanged",(state:any)=>{
               console.warn("iceStateChanged",state)
               if(state == "disconnected"){
                  if(ConnectionType == "Peer"){
                     if(IsConnected){
                        location.href = "/"
                     }
                  }
               }
            })
            setTimeout(() => {
               if(!IsConnected){
                  SocketConnectionInitiate()
               }
            }, 3000);
         }
         else{
            Swal.fire({icon:"error",title:"another ID should be of 4 digit code",confirmButtonColor: "green",timer:3000,showConfirmButton:false})   
         }
      }
      else{
         Swal.fire({icon:"error",title:"another ID is mandatory!",confirmButtonColor: "green",timer:3000,showConfirmButton:false})
      }
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
                  Swal.fire({icon:"success",html:`<strong>Connection has been established with <b>${AnotherID}</b> under PEER Connection</strong>`,confirmButtonColor: "green",timer:3000,showConfirmButton:false})
                  Windowtitle = AnotherID
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
            if(Window != "Chat"){
               Swal.fire({icon:"info",title:`You got a message!`,confirmButtonColor: "green",timer:3000,showConfirmButton:false})
            }
            scrolldownmessages()
         }
         if(msgtype == "ShareScreen"){
            anotheruserscreen = "Share Screen"
            Window="ShareScreen"
         }
         if(msgtype == "ShareScreenStop"){
            anotheruserscreen = ""
            videodata.srcObject=null
            try{
               if(document.fullscreenElement){
                  document.exitFullscreen()
               }
            }
            catch{}
         }
         if(msgtype == "VideoCamera"){
            anotheruserscreen = "Video Camera"
            Window="videocall"
         }
         if(msgtype == "VideoCameraStop"){
            anotheruserscreen = ""
            videodataCamera.srcObject=null
            try{
               if(document.fullscreenElement){
                  document.exitFullscreen()
               }
            }
            catch{}
         }
         if (msgtype === 'startFileTransfer') {
            fileInfo[data.name] = { size: data.size, received: 0 };
            receivedBuffers[data.name] = [];
            Progressvalue=0
         } 
         else if (msgtype === 'chunkFileTransfer') {
            receivedBuffers[data.name].push(data.data);
            fileInfo[data.name].received += data.data.byteLength;
            Progressvalue=fileInfo[data.name].received
            Progressmax = fileInfo[data.name].size
            // console.log(`Received ${fileInfo[data.name].received} of ${fileInfo[data.name].size}`);
         } 
         else if (msgtype === 'endFileTransfer') {
            const received = new Blob(receivedBuffers[data.name]);
            downloadfileList.push({filename:data.name,base64:URL.createObjectURL(received),filesize:bytesToKB(Progressmax.toString()),datetime:new Date().toString(),filesendtype:"Received"})
            downloadfileList = downloadfileList
            Progressmax = 0
            Progressvalue = 0
            delete receivedBuffers[data.name];
            delete fileInfo[data.name];
            if(Window!="File Transfer"){
               Swal.fire({icon:"success",title:"You have received an file go to File Transfer!",confirmButtonColor: "green",showConfirmButton:false,timer:3000})
               conn.send({type:"endFileTransferAnotherCALLBACK"})
            }
         }
         else if(msgtype == "endFileTransferAnotherCALLBACK"){
            CallbackofFiledownloaded = false
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
      if(UserMessage){
         ConversationLogMessages.push({Message:UserMessage,MessageType:"Sender",datetime:getFormattedDateTime(),loginID:UserID})
         ConversationLogMessages = ConversationLogMessages
         if(ConnectionType == "Peer"){
            conn.send({type:"chat",chatdata:{Message:UserMessage,MessageType:"Sender",datetime:getFormattedDateTime(),loginID:UserID}})
         }
         else{
            socket.emit("CHATMESSAGES",{Message:UserMessage,MessageType:"Sender",datetime:getFormattedDateTime(),loginID:UserID,AnotherID:AnotherID})
         }
         UserMessage = ""
         scrolldownmessages()
      }
      else{
         Swal.fire({icon:"error",title:"please enter message!",confirmButtonColor: "green",timer:3000,showConfirmButton:false})
      }
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

   // Start Share Screen
   async function ShareScreen() {
      try{
         let screenStream = await navigator.mediaDevices.getDisplayMedia({
         audio: true,
         video:{
                width:{ideal:4096},
                height:{ideal:2160}
         }
         }).catch((e) => {
            if(e.name == "NotAllowedError"){
              Swal.fire({icon:"warning",title:"Recording was cancelled",confirmButtonColor: "green"})
            }
            else{
               Swal.fire({icon:"error",title:"Something went wrong!",html:`${e}`,confirmButtonColor: "green"})
            }
         })
         if(screenStream){
            // @ts-ignore
            if(ConnectionType == "Peer"){
               // videodata.srcObject = screenStream
               // videodata.play()
               peer.call(AnotherID,screenStream)
               conn.send({type:"ShareScreen"})
               ScreenOpen =true
               const mediarecorder = new MediaRecorder(screenStream)
               mediarecorder.start()
               mediarecorder.addEventListener("stop",()=>{
                  // LeaveConnection()
                  conn.send({type:"ShareScreenStop"})
                  ScreenOpen = false
               })
            }
            else{
               Swal.fire({icon:"error",title:"Share Screen is not supported in this connection type!",confirmButtonColor: "green"})
            }
         }
      }
      catch(e){
         Swal.fire({icon:"error",title:"Something went wrong!",html:`${e}`,confirmButtonColor: "green"})
      }
   }

   // Fetch the Stream of video
   peer.on('call', function(call) {
      call.answer()
      call.on("stream",function(remoteStream:any) {
         if(anotheruserscreen == "Share Screen"){
            videodata.srcObject = remoteStream
            videodata.play()
         }
         else{
            videodataCamera.srcObject = remoteStream
            videodataCamera.play()
         }
      })
   })

   function fileToBase64(file:any) {
      return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.readAsDataURL(file);  // This will give you a base64 encoded string
         reader.onload = () => resolve(reader.result);
         reader.onerror = error => reject(error);
      });
   }

   function sendFile(file:any) {
      const fileReader = new FileReader();
      let offset = 0;

      fileReader.onload = (e:any) => {
         if(ConnectionType == "Peer"){
            conn.send({
               type: 'chunkFileTransfer',
               name: file.name,
               size: file.size,
               data: e.target.result,
               offset,
            });
         }
         else{
            socket.emit("chunkFileTransfer",{
               type: 'chunkFileTransfer',
               name: file.name,
               size: file.size,
               data: e.target.result,
               offset,
               AnotherID
            })
         }
         offset += e.target.result.byteLength;
         Progressvalue=offset
         Progressmax = file.size
         if (offset < file.size) {
            readSlice(offset);
         } else {
            Progressmax = 0
            Progressvalue = 0
            if(ConnectionType == "Peer"){
               conn.send({ type: 'endFileTransfer', name: file.name });
            }
            else{
               socket.emit("endFileTransfer",{ type: 'endFileTransfer', name: file.name,AnotherID })
            }
            Swal.fire({icon:"success",title:"File transfer complete",confirmButtonColor: "green"})
            // console.log('File transfer complete');
         }
      };

      function readSlice(o:any) {
         const slice = file.slice(o, o + CHUNK_SIZE);
         fileReader.readAsArrayBuffer(slice);
      }
      if(ConnectionType == "Peer"){
         conn.send({ type: 'startFileTransfer', name: file.name, size: file.size });
      }
      else{
         socket.emit("startFileTransfer",{ type: 'startFileTransfer', name: file.name, size: file.size,AnotherID })
      }
      readSlice(0);
   }

   const filechange = async (e:any) =>{
      console.warn(e.target.files)
      if(e){
         if(e.target){
            if(e.target.files){
               if(e.target.files.length>0){
                  CallbackofFiledownloaded = true
                  sendFile(e.target.files[0])
                  try {
                  let base64String:any = await fileToBase64(e.target.files[0]);
                  downloadfileList.push({filename:e.target.files[0].name,base64:base64String,filesize:bytesToKB(e.target.files[0].size),datetime:new Date().toString(),filesendtype:"Send"})
                  downloadfileList = downloadfileList
               } catch (err) {
                  console.error('Error converting file:', err);
               }
               }
            }
         }
      }
   }

   const downloadfile = (filename:string,base64:string) =>{
      const a = document.createElement('a');
      a.href = base64;
      a.download = filename;
      a.click();
   }

   // Auto Scroll down
	const scrolldownmessages = () => {
      setTimeout(() => {
         const div = document.getElementById("chatwindow");
         if(div){
            div.scrollTo({
               top: div.scrollHeight+2000,
               behavior: "smooth"
            });
         }
      }, 500);
   }

   // Start Share Screen
   async function CameraScreen() {
      try{
         const constraints = { video: { facingMode: cameraSide } ,Audio:true}; // Use "environment" for back camera
         CameraStream = await navigator.mediaDevices.getUserMedia(constraints).catch((e) => {
                if(e.name == "NotAllowedError"){
                       Swal.fire({icon:"warning",title:"Recording was cancelled",confirmButtonColor: "green"})
                }
                else{
                  Swal.fire({icon:"error",title:"Something went wrong!",html:`${e}`,confirmButtonColor: "green"})
                }
         })
         if(CameraStream){
            CameraOpen = true
            // @ts-ignore
            peer.call(AnotherID,CameraStream)
            // videodataCamera.srcObject = CameraStream
            // videodataCamera.play()
            conn.send({type:"VideoCamera"})
            const mediarecorder = new MediaRecorder(CameraStream)
            mediarecorder.start()
            mediarecorder.addEventListener("stop",()=>{
               // LeaveConnection()
               conn.send({type:"VideoCameraStop"})
            })
         }
      }
      catch(e){
         Swal.fire({icon:"error",title:"Something went wrong!",html:`${e}`,confirmButtonColor: "green"})
      }
   }

   function StopCamera(){
      CameraOpen = false
      if (CameraStream) {
         CameraStream.getTracks().forEach((track:any) => track.stop()); // Stop all tracks
      }
   }

   // Start Share Screen
   async function ShareRecording() {
      try{
         recordedData = []
         RecordExist = false
         let screenStream = await navigator.mediaDevices.getDisplayMedia({
         audio: true,
         video:{
                width:{ideal:4096},
                height:{ideal:2160}
         }
         }).catch((e) => {
            if(e.name == "NotAllowedError"){
              Swal.fire({icon:"warning",title:"Recording was cancelled",confirmButtonColor: "green"})
            }
            else{
               Swal.fire({icon:"error",title:"Something went wrong!",html:`${e}`,confirmButtonColor: "green"})
            }
         })
         if(screenStream){
            // @ts-ignore
               const mediarecorder = new MediaRecorder(screenStream)
               mediarecorder.start()
               mediarecorder.addEventListener("stop",()=>{
                  // LeaveConnection()
               })
               mediarecorder.addEventListener("dataavailable", async (e) => {
                  debugger
                  if(e.data.size > 0){
                     recordedData.push(e.data)
                     RecordExist = true
                     //let data = await fixWebmDuration(new Blob([...recordedData], { type: downloadtypeMimetype }));
                     // videodata.src = URL.createObjectURL(e.data)
                  }
               })
         }
      }
      catch(e){
         Swal.fire({icon:"error",title:"Something went wrong!",html:`${e}`,confirmButtonColor: "green"})
      }
   }

   // download Recording
   const downloadrecording = async () => {
      let downloadtypeExtension = ".mp4"
      let downloadtypeMimetype = "video/mp4"
      if(recordedData){
         if(recordedData.length > 0){
            let url;
            try{
               // Try to have Duration in video
               const fixBlob = await fixWebmDuration(new Blob([...recordedData], { type: downloadtypeMimetype }));
               url = URL.createObjectURL(fixBlob);
            }
            catch{
               let blobParts: BlobPart[] = recordedData;
               const blob = new Blob(blobParts, {
                      type: downloadtypeMimetype,
               });
               url = URL.createObjectURL(blob);
            }
            const a = document.createElement("a");
            a.href = url;
            let dates = new Date()
            if(RecordingFileName == ""){
               a.download = `EchoBridge_${dates.toLocaleString()}${downloadtypeExtension}`;
            }
            else{
               a.download = `${RecordingFileName}${downloadtypeExtension}`;
            }
            a.click();
            window.URL.revokeObjectURL(url);
            recordedData=[]
            RecordExist = false
            RecordingFileName = ""
            Swal.fire({
            position: "top-end",
            title: "File downloaded successfully!",
            showConfirmButton: false,
            timer: 500,
            confirmButtonColor: "green"
            });
         }
      }
   }

   const ResetRecording = () => {
      recordedData=[]
      RecordExist = false
      RecordingFileName = ""
   }

   // Start Snipping tool
   async function StartCapture() {
      try{
         recordedData = []
         RecordExist = false
         let screenStream = await navigator.mediaDevices.getDisplayMedia({
         audio: true,
         video:{
                width:{ideal:4096},
                height:{ideal:2160}
         }
         }).catch((e) => {
            if(e.name == "NotAllowedError"){
              Swal.fire({icon:"warning",title:"Recording was cancelled",confirmButtonColor: "green"})
            }
            else{
               Swal.fire({icon:"error",title:"Something went wrong!",html:`${e}`,confirmButtonColor: "green"})
            }
         })
         if(screenStream){
            // @ts-ignore
            const mediarecorder = new MediaRecorder(screenStream)
            mediarecorder.start()
            mediarecorder.addEventListener("stop",()=>{
               // LeaveConnection()
            })
            mediarecorder.addEventListener("dataavailable", async (e) => {
               debugger
               if(e.data.size > 0){
                  let downloadtypeMimetype = "video/mp4"
                  let data = await fixWebmDuration(new Blob([e.data], { type: downloadtypeMimetype }));
                  SnippingToolVideo.src = URL.createObjectURL(data)
                  SnippingToolVideo.play()
               }
            })
         }
      }
      catch(e){
         Swal.fire({icon:"error",title:"Something went wrong!",html:`${e}`,confirmButtonColor: "green"})
      }
   }
   // Reset Snipping tool
   function ResetCapture(){
      Snippingtoolfilename = ""
      if(SnippingToolVideo){
         SnippingToolVideo.src = ''
         let videouploader:any = document.getElementById("videouploader")
         if(videouploader){
            videouploader.src = ""
            videouploader.value = ""
         }
      }
   }
   // Capture Snipping tool
   function CaptureSnip(){
      if(SnippingToolVideo){
         if(SnippingToolVideo.src != ''){
            const video = SnippingToolVideo;
            const canvas = document.createElement("canvas");
            const context = canvas.getContext('2d');
            // Set the canvas dimensions to match the video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            // Draw the current frame of the video onto the canvas
            if(context){
                  context.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
            // Convert the canvas to a data URL
            const dataURL = canvas.toDataURL('image/jpg');
            const link = document.createElement('a');
            link.href = dataURL;
            // link.download = 'image.png'; // Specify the filename
            let dates = new Date()
            if(Snippingtoolfilename == ""){
                  link.download = `EchoBridge_FRAME_${dates.toLocaleString()}.jpg`;
            }
            else{
                  link.download = `${Snippingtoolfilename}.jpg`;
            }
            // Trigger the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
         }
      }
   }
   function bytesToKB(bytes:any) {
      return (bytes / 1024).toFixed(2);
   }
   async function getIP(){
      const res = await fetch("https://api64.ipify.org/?format=json")
      const ip = await res.json()
      CurrentIP = ip.ip
   }
 </script>
  <svelte:head>
   <title>EchoBridge</title>
 </svelte:head>
 <Sidebar.Provider open={PageloadsidebarOpen} onOpenChange={(e)=>{PageloadsidebarOpen = e}}>
   <AppSidebar bind:Window bind:IsConnected bind:ConnectionType />
   <main style="width: 100%;">
      <div style="display: flex;align-items: center;">
         <Sidebar.Trigger />
         <h3 class="lg:text-2xl font-bold">{Windowtitle}</h3>
      </div>
     <Separator class="" />
     <!-- Home Window -->
      <div style={`content-visibility:${Window=="Home"?"auto":"hidden"}`}>
         <HomeWindow bind:AnotherID bind:UserID on:ConnectwithUserFirst={ConnectwithUserFirst} on:LeaveConnection={LeaveConnection} bind:IsConnected/>
      </div>
      <!-- Chat Window -->
      <div style={`content-visibility:${Window=="Chat"?"auto":"hidden"}`}>
         <ChatWindow bind:ConversationLogMessages bind:IsConnected bind:UserMessage on:SendMessage={SendMessage}/>
      </div>
      <!-- Video call Window -->
      <div style={`content-visibility:${Window=="videocall"?"auto":"hidden"}`}>
         <VideoChatWindow bind:IsConnected bind:CameraOpen bind:cameraSide bind:videodata={videodataCamera} on:CameraScreen={CameraScreen} on:StopCamera={StopCamera}/>
      </div>
      <!-- Share Screen Window -->
      <div style={`content-visibility:${Window=="ShareScreen"?"auto":"hidden"}`}>
         <ShareScreenWindow bind:IsConnected bind:ScreenOpen bind:videodata on:ShareScreen={ShareScreen}/>
      </div>
      <!-- Tutorial Window -->
      <div style={`content-visibility:${Window=="Tutorial"?"auto":"hidden"}`}>
         <TutorialWindow/>
      </div>
      <!-- Notice Window -->
      <div style={`content-visibility:${Window=="Notice"?"auto":"hidden"}`}>
         <NoticeWindow/>
      </div>
      <!-- Contact Window -->
      <div style={`content-visibility:${Window=="Contact"?"auto":"hidden"}`}>
         <ContactWindow/>
      </div>
      <!-- Connection Window -->
      <div style={`content-visibility:${Window=="ConnectionWindow"?"auto":"hidden"}`}>
         <ConnectionWIndow bind:ConnectionType bind:IsConnected bind:CurrentIP/>
      </div>
      <!-- File Transfer Window -->
      <div style={`content-visibility:${Window=="FileTransfer"?"auto":"hidden"}`}>
         <div class="px-10 py-3">
            <input type="file" class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" on:change={(e)=>{filechange(e)}} disabled={CallbackofFiledownloaded} />
            {#if CallbackofFiledownloaded}
               <b>File is still not downloaded in another side</b>
            {/if}
         </div>
         {#if Progressmax != 0}
            <Progress value={Progressvalue} max={Progressmax} class="w-[95%] mx-3" />
         {/if}
         <div class="px-10">
            <Table.Root>
               <Table.Caption></Table.Caption>
               <Table.Header>
                 <Table.Row>
                   <Table.Head class="w-[100px]">Received/Send</Table.Head>
                   <Table.Head class="w-[100px]">File name</Table.Head>
                   <Table.Head class="w-[100px]">File Size</Table.Head>
                   <Table.Head class="">timestamp</Table.Head>
                   <Table.Head class="text-right">download</Table.Head>
                 </Table.Row>
               </Table.Header>
               <Table.Body>
                 {#each downloadfileList as item}
                  <Table.Row>
                     <Table.Cell class="font-medium">{item.filesendtype}</Table.Cell>
                     <Table.Cell class="font-medium">{item.filename}</Table.Cell>
                     <Table.Cell class="font-medium">{item.filesize} KB</Table.Cell>
                     <Table.Cell class="font-medium">{item.datetime}</Table.Cell>
                     <Table.Cell class="text-right">
                     <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" 
                     disabled={!IsConnected} on:click={()=>{downloadfile(item.filename,item.base64)}}><Download/></button>
                     </Table.Cell>
                  </Table.Row>
                 {/each}
               </Table.Body>
             </Table.Root>
         </div>
      </div>
      <!-- Screen Recorder Window -->
      <div style={`content-visibility:${Window=="ScreenRecord"?"auto":"hidden"}`}>
         <ScreenRecorder bind:RecordingFileName bind:RecordExist on:ShareRecording={ShareRecording} on:downloadrecording={downloadrecording} on:ResetRecording={ResetRecording}/>
      </div>
      <!-- Screen Recorder Window -->
      <div style={`content-visibility:${Window=="Snippingtool"?"auto":"hidden"}`}>
         <SnippingtoolWindow bind:videodata={SnippingToolVideo} bind:Snippingtoolfilename on:StartCapture={StartCapture} on:ResetCapture={ResetCapture} on:CaptureSnip={CaptureSnip}/>
      </div>
      <!-- Canvas Window -->
      <div style={`content-visibility:${Window=="Canvas"?"auto":"hidden"}`}>
         <CanvasWindow bind:PageloadsidebarOpen/>
      </div>
      <!-- Session Manager -->
      <div style={`content-visibility:${Window=="SessionManager"?"auto":"hidden"}`}>
         <SessionManagement bind:UserDeafaultID={data.UserIDDeafult} bind:Windowtitle/>
      </div>
      <!-- FORMATTER Window -->
      <div style={`content-visibility:${Window=="FORMATTER"?"auto":"hidden"}`}>
         <FormatterWindow/>
      </div>
   </main>
 </Sidebar.Provider>