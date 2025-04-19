<script lang="ts">
   export let RecordExist: boolean = false
   export let RecordingFileName = ""
   import { createEventDispatcher } from 'svelte';
   const dispatch = createEventDispatcher();
   import {Info} from '@lucide/svelte/icons'
   import * as Alert from "$lib/components/ui/alert/index.js";
</script>
<div class="px-3 py-3 recordingControls">
   <input type="text" class="border-2 w-100 h-100 px-3 py-3 outline-transparent" placeholder="file name..." bind:value={RecordingFileName}/>
   <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" on:click={()=>{dispatch("ShareRecording")}}>Start Recording</button>
   <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" on:click={()=>{dispatch("downloadrecording")}} disabled={!RecordExist}>Download Recording</button>
   <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" on:click={()=>{dispatch("ResetRecording")}} disabled={!RecordExist}>Reset Recording</button>
</div>
<div class="container" style="text-align: left;">
   <Alert.Root>
      <Info class="size-4" />
      <Alert.Title class="lg:text-3xl font-bold">Recording</Alert.Title><br/>
      {#if !RecordExist}
         <Alert.Description class="text-red-500 lg:text-2xl font-bold">There is no recording to download</Alert.Description><br/>
         {:else}
         <Alert.Description class="text-green-500 lg:text-2xl font-bold">There is recording to download</Alert.Description><br/>
      {/if}
    </Alert.Root>
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