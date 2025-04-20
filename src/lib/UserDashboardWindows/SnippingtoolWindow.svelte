<script lang="ts">
   export let videodata:HTMLVideoElement
   export let Snippingtoolfilename = ""
   import { createEventDispatcher } from 'svelte';
   const dispatch = createEventDispatcher();
</script>
<div class="px-3 py-3">
   <input type="text" class="border-2 w-100 h-100 px-3 py-2 outline-transparent" placeholder="file name..." bind:value={Snippingtoolfilename}/>
   <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" on:click={()=>{dispatch("StartCapture")}}>Start Capture</button>
   <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" on:click={()=>{dispatch("CaptureSnip")}}>Capture Screen</button>
   <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" on:click={()=>{dispatch("ResetCapture")}}>Reset</button>
</div>
<div>
   <!-- svelte-ignore a11y_media_has_caption -->
   <!-- svelte-ignore element_invalid_self_closing_tag -->
   <video bind:this={videodata} controls id="videotag"/>
</div>