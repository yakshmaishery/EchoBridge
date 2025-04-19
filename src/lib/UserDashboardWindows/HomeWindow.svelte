<script lang="ts">
   export let AnotherID=""
   export let UserID=""
   export let IsConnected = false
   import * as InputOTP from "$lib/components/ui/input-otp/index.js";
   import Button from "$lib/components/ui/button/button.svelte";
   import '$lib/Styles/HomeWindow.css'
   import { createEventDispatcher } from 'svelte';
   const dispatch = createEventDispatcher();
</script>
<div class="text-center">
   <h2 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      Welcome to EchoBridge
   </h2>
   <h2 class="scroll-m-20 my-5 text-4xl font-bold tracking-tight lg:text-7xl">
      ({UserID}) 
   </h2>
   <div id="inputbox">
      <p class="leading-7 [&:not(:first-child)]:mt-6">
         Enter the another ID
      </p>
      <InputOTP.Root maxlength={4} inputmode={"text"} bind:value={AnotherID} disabled={IsConnected}>
         {#snippet children({ cells })}
            <InputOTP.Group>
              {#each cells as cell (cell)}
                <InputOTP.Slot {cell} />
              {/each}
            </InputOTP.Group>
          {/snippet}
      </InputOTP.Root>
   </div>
   <div>
       <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
       on:click={()=>{dispatch("ConnectwithUserFirst")}} disabled={IsConnected}>Connect</button>
       <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
       on:click={()=>{dispatch("LeaveConnection")}} disabled={!IsConnected}>Leave</button>
   </div>
</div>