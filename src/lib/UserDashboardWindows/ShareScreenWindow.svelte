<script lang="ts">
   export let IsConnected = false
   export let ScreenOpen = false
   export let videodata:HTMLVideoElement
   import "$lib/Styles/VideoShareCSS.css"
   import CircleAlert from "@lucide/svelte/icons/circle-alert";
   import * as Alert from "$lib/components/ui/alert/index.js";
   import { createEventDispatcher } from 'svelte';
   const dispatch = createEventDispatcher();
   // Full screen video
	function fullscreenbtn() {
		if(videodata){
			videodata.requestFullscreen()
		}
	}
</script>
<div class="dark:text-white">
   <div class="px-2 py-2">
      <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md" 
      on:click={()=>{dispatch("ShareScreen")}} disabled={!IsConnected}>Share Screen</button>
      <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md" 
      on:click={fullscreenbtn} disabled={!IsConnected}>Full Screen</button>
   </div>
   {#if ScreenOpen}
   <Alert.Root variant="default">
      <CircleAlert class="size-4" />
      <Alert.Title>Info</Alert.Title>
      <Alert.Description
        >Your Screen is shared</Alert.Description
      >
    </Alert.Root>
   {/if}
   <div>
      <!-- svelte-ignore a11y_media_has_caption -->
      <!-- svelte-ignore element_invalid_self_closing_tag -->
      <video bind:this={videodata} controls id="videotag"/>
   </div>
</div>