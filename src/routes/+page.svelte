<script lang="ts">
   import '$lib/Styles/LandingPage.css'
   import {onMount} from 'svelte'
   import {ClientURLdashboard} from '$lib/Stores'
   onMount(()=>{
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if(menuToggle){
      menuToggle.addEventListener('click', () => {
        if(navMenu){
          navMenu.classList.toggle('show');
        }
      });
    }

    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      if(header){
        header.classList.add('scrolled');
      }
    } else {
      if(header){
        header.classList.remove('scrolled');
      }
    }
  });
   })
</script>
<svelte:head>
  <title>EchoBridge</title>
</svelte:head>
<header class="header">
  <div class="container">
    <h1 class="logo">EchoBridge</h1>
    <button class="menu-toggle" id="menuToggle">&#9776;</button>
    <nav class="nav" id="navMenu">
      <a href="#features">Features</a>
      <a href="#tech">Technology</a>
      <a href="#about">About</a>
      <a href="#get-started">Get Started</a>
    </nav>
  </div>
</header>

<section class="hero">
  <div class="container">
    <h2>Real-Time Communication. Simplified.</h2>
    <p>EchoBridge brings you seamless one-on-one video calling, chat, screen sharing, and file transfers — all in one place.</p>
    <a href="/UserDashboard" data-sveltekit-reload class="btn">Start Connecting</a>
  </div>
</section>

<section id="features" class="features">
  <div class="container">
    <h2 class="lg:text-5xl font-bold">Core Features</h2>
    <div class="grid">
      <div class="card">
        <h3 class="lg:text-2xl font-bold">💬 Chat</h3>
        <p>Instant text messaging with real-time updates powered by Socket.IO.</p>
      </div>
      <div class="card">
        <h3 class="lg:text-2xl font-bold">📹 Video Call</h3>
        <p>Crystal-clear video calls using WebRTC via PeerJS for direct peer-to-peer connections.</p>
      </div>
      <div class="card">
        <h3 class="lg:text-2xl font-bold">🖥️ Screen Share</h3>
        <p>Share your screen with one click—ideal for presentations, troubleshooting, or teaching.</p>
      </div>
      <div class="card">
        <h3 class="lg:text-2xl font-bold">📁 File Transfer</h3>
        <p>Securely share files with no size limits, directly between users.</p>
      </div>
    </div>
  </div>
</section>

<section id="tech" class="tech">
  <div class="container">
    <h2 class="lg:text-5xl font-bold">Powered by Modern Tech</h2>
    <div class="grid">
      <div>
        <h3 class="lg:text-2xl font-bold">PeerJS</h3>
        <p>PeerJS simplifies WebRTC by handling peer discovery and connection setup, enabling smooth video, audio, and data transfer without complex signaling code.</p>
      </div>
      <div>
        <h3 class="lg:text-2xl font-bold">Socket.IO</h3>
        <p>Socket.IO enables fast, real-time communication for text chat and signaling, making it the backbone for initiating peer connections and data syncing.</p>
      </div>
    </div>
  </div>
</section>

<section id="about" class="about">
  <div class="container">
    <h2 class="lg:text-5xl font-bold">About EchoBridge</h2>
    <div class="grid">
      <div class="card-link">
        <h3 class="lg:text-2xl font-bold">📘 Tutorial</h3>
        <p>Step-by-step guides to help you start video calls, chat, and more.</p>
        <a href={ClientURLdashboard+"?redirect=Tutorial"} target="_self">View Tutorial</a>
      </div>
      <div class="card-link">
        <h3 class="lg:text-2xl font-bold">📞 Contact</h3>
        <p>Need help or have feedback? Reach out to our support team.</p>
        <a href={ClientURLdashboard+"?redirect=Contact"} target="_self">Contact Us</a>
      </div>
      <div class="card-link">
        <h3 class="lg:text-2xl font-bold">📢 Notice</h3>
        <p>Stay updated with the latest announcements and updates.</p>
        <a href={ClientURLdashboard+"?redirect=Notice"} target="_self">View Notices</a>
      </div>
    </div>
  </div>
</section>


<section id="get-started" class="cta">
  <div class="container">
    <h2 class="lg:text-5xl font-bold">Ready to Connect?</h2>
    <p>Start using EchoBridge today and experience fast, reliable one-on-one communication.</p>
    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="#" class="btn">Launch App</a>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <p>&copy; 2025 EchoBridge. Built with ❤️ using PeerJS & Socket.IO</p>
  </div>
</footer>