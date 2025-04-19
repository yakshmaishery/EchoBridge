<script lang="ts">
   import '$lib/Styles/NoticeCSS.css'
</script>

<div class="container">
    <main>
      <div class="notice">
        <h2 class="lg:text-2xl font-bold">Known Technical Limitations</h2>
        <ul class="text-left">
          <li>
            <strong>Screen Sharing on Mobile:</strong> Currently, mobile devices <strong>cannot share their screen</strong> due to browser and OS restrictions.
          </li>
          <li>
            <strong>Viewing from Mobile:</strong> Mobile users <strong>can still view</strong> the screen shared by a desktop user.
          </li>
          <li>
            <strong>Socket Connection Limitations:</strong> When Peer-to-Peer connection fails and the app falls back to Socket mode, <strong>Video Call</strong> and <strong>Screen Sharing</strong> will be unavailable.
          </li>
          <li>
            <strong>Connection Drop:</strong> If your network switches (e.g., from Wi-Fi to mobile data), the session may disconnect and need to be re-established.
          </li>
        </ul>
   
        <div class="highlight">
          ✅ We are actively working on improving mobile compatibility and full socket-based media support in future updates.
        </div>
      </div>
   
      <footer>
        &copy; 2025 EchoBridge. Thank you for your understanding and support.
      </footer>
   
    </main>
</div>
