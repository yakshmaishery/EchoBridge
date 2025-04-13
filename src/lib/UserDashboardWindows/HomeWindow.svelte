<script lang="ts">
   export let AnotherID=""
   export let UserID=""
   import * as InputOTP from "$lib/components/ui/input-otp/index.js";
   import Button from "$lib/components/ui/button/button.svelte";
   import '$lib/Styles/HomeWindow.css'
   import { createEventDispatcher } from 'svelte';
   const dispatch = createEventDispatcher();
</script>
<div class="text-center">
   <h2 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      Welcome to personal chat
   </h2>
   <h2 class="scroll-m-20 my-5 text-4xl font-extrabold tracking-tight lg:text-2xl">
      Your ID ({UserID}) 
   </h2>
   <div id="inputbox">
      <p class="leading-7 [&:not(:first-child)]:mt-6">
         Enter the another ID
      </p>
      <InputOTP.Root maxlength={4} bind:value={AnotherID}>
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
       on:click={()=>{dispatch("ConnectwithUserFirst")}}>Connect</button>
       <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
       on:click={()=>{dispatch("LeaveConnection")}}>Leave</button>
   </div>
</div>