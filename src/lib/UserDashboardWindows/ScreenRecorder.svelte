<script lang="ts">
   export let RecordExist: boolean = false
   export let RecordingFileName = ""
   import { createEventDispatcher } from 'svelte';
   const dispatch = createEventDispatcher();
</script>
<div class="px-3 py-3 recordingControls">
   <input type="text" class="border-2 w-100 h-100 px-3 py-3 outline-transparent" placeholder="file name..." bind:value={RecordingFileName}/>
   <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" on:click={()=>{dispatch("ShareRecording")}}>Start Recording</button>
   <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" on:click={()=>{dispatch("downloadrecording")}} disabled={!RecordExist}>Download Recording</button>
   <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" on:click={()=>{dispatch("ResetRecording")}} disabled={!RecordExist}>Reset Recording</button>
</div>
<style>
   .recordingControls{
      display: flex;
      flex-direction: column;
      gap: 30px;
      width: 30%;
      justify-self: center;
   }
</style>