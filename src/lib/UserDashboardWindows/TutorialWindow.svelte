<script lang="ts">
   import '$lib/Styles/TutorialsCSS.css'
</script>
<div class="container">
    <main>
   
      <div class="section">
        <h2 class="lg:text-2xl font-bold">1. Getting Started</h2>
        <div class="step">
          <strong class="dark:text-white">Launch the App:</strong>
          Open EchoBridge on your browser.
        </div>
        <div class="step">
          <strong class="dark:text-white">Receive Your ID:</strong>
          A unique 4-character alphanumeric ID will be automatically generated for you (e.g., <code>A1B2</code>).
        </div>
        <div class="step">
          <strong class="dark:text-white">Share Your ID:</strong>
          Send your ID to the person you want to connect with.
        </div>
      </div>

      <div class="section">
         <h2 class="lg:text-2xl font-bold">2. Connection Types</h2>
         <div class="step">
           <strong class="dark:text-white">Peer Connection (Default):</strong>
           EchoBridge first tries to connect users via Peer-to-Peer (WebRTC) for fast and direct communication.
         </div>
         <div class="step">
           <strong class="dark:text-white">Socket Fallback:</strong>
           If Peer connection fails (due to network or firewall issues), the app automatically falls back to a Socket connection via server.
         </div>
         <div class="note">
           ⚠️ <strong>Note:</strong> In Socket connection mode, <strong>Video Call</strong> and <strong>Screen Sharing</strong> features are currently unavailable due to technical limitations. Chat and File Transfer will still work normally.
         </div>
       </div>
   
      <div class="section">
        <h2 class="lg:text-2xl font-bold">3. Connecting</h2>
        <div class="step">
          <strong class="dark:text-white">Enter Friend's ID:</strong>
          Type the 4-character ID you received from your friend into the "Connect" field.
        </div>
        <div class="step">
          <strong class="dark:text-white">Establish Connection:</strong>
          Once either one of the both users enter each other's ID, the connection will be established automatically.
        </div>
      </div>
   
      <div class="section">
        <h2 class="lg:text-2xl font-bold">4. Chat</h2>
        <div class="step">
          <strong class="dark:text-white">Start Chatting:</strong>
          Use the chat window to send real-time messages once connected.
        </div>
        <div class="step">
          <strong class="dark:text-white">Emoji & Formatting:</strong>
          Express yourself with emojis and formatted text (optional).
        </div>
      </div>
   
      <div class="section">
        <h2 class="lg:text-2xl font-bold">5. Video Call</h2>
        <div class="step">
          <strong class="dark:text-white">Click Start Camera:</strong>
          Press the "Start Camera" button to start a live video conversation.
        </div>
        <div class="note">
         🚫 <strong>Unavailable in Socket Mode</strong>: If Peer connection fails and Socket fallback is used, this feature won’t be available.
       </div>
      </div>
   
      <div class="section">
        <h2 class="lg:text-2xl font-bold">6. Screen Sharing</h2>
        <div class="step">
          <strong class="dark:text-white">Share Your Screen:</strong>
          Hit the "Share Screen" button and choose the screen or application window.
        </div>
        <div class="step">
          <strong class="dark:text-white">Stop Sharing:</strong>
          End screen sharing when done using the same control.
        </div>
        <div class="note">
         🚫 <strong>Unavailable in Socket Mode</strong>: If Peer connection fails and Socket fallback is used, this feature won’t be available.
       </div>
      </div>
   
      <div class="section">
        <h2 class="lg:text-2xl font-bold">7. File Transfer</h2>
        <div class="step">
          <strong class="dark:text-white">Send a File:</strong>
          Click the "Choose file" to upload and send any type of file.
        </div>
        <div class="step">
          <strong class="dark:text-white">Receive & Download:</strong>
          The other user will be prompted to download the file once received.
        </div>
      </div>
   
      <footer>
        &copy; 2025 EchoBridge. Secure. Simple. Seamless.
      </footer>
   
    </main>
</div>