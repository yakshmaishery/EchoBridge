<script>
   import '$lib/Styles/LandingPage.css'
</script>
<svelte:head>
  <title>EchoBridge</title>
</svelte:head>
<div class="container">
   <!-- Logo -->
   <img src="/Images/favicon.png" alt="App Logo" class="logo" width="30%" />

   <h1>Connect Instantly with <b style="color: yellow;">EchoBridge</b></h1>
   <p>Welcome to your all-in-one Private Conversations platform. Start a secure video call, chat in real-time, send files, or share your screen — all in one place.</p>

   <div class="features">
     🔹 <span class="highlight">Video Calls</span> – High-quality peer-to-peer video with no lags.<br/>
     🔹 <span class="highlight">Text Chat</span> – Real-time messaging with emoji support.<br/>
     🔹 <span class="highlight">File Transfer</span> – Share documents, images, and more securely.<br/>
     🔹 <span class="highlight">Screen Sharing</span> – Present your screen for collaboration or help.
   </div>

   <a class="start-button" href="/UserDashboard" data-sveltekit-reload>Start a Session</a>

   <div class="why-choose">
     <h2>Why Choose Us?</h2>
     <ul>
       <li>No sign-ups or downloads – connect instantly from your browser</li>
       <li>Encrypted peer-to-peer communication</li>
       <li>Simple and elegant user interface</li>
       <li>Optimized for desktop and mobile</li>
       <li>Built with modern WebRTC technology</li>
     </ul>
   </div>
 </div>