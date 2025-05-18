<script lang="ts">
   export let UserDeafaultID = ""
   export let Windowtitle = ""
   import { enhance } from "$app/forms";
   import '$lib/Styles/SessionManagerCSS.css'
   import * as Alert from "$lib/components/ui/alert/index.js";
   let isValid:boolean = false
   function validate() {
    isValid = /^[a-zA-Z0-9]+$/.test(UserDeafaultID);
  }
</script>
<div class="dark:text-white mx-3 my-3">
   <form method="post"use:enhance>
      <div class="sessionmanagercontroler">
         <input type="text" name="UserIDDeafult" on:input={validate} placeholder="Enter Default UserID..." autocomplete="off" maxlength="4" minlength="4" class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-30 rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
         <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md" formaction="?/SetAnotherIDDefault">Save</button>
         <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md" formaction="?/RemoveanotherIDDefault">Clear</button>
         <input type="text" bind:value={Windowtitle} placeholder="Enter window header..." autocomplete="off" class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-30 rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
      </div>
   </form>
   <div class="my-3">
      <Alert.Root>
         <Alert.Description class="lg:text-2xl font-bold">Current Default User ID:-  {UserDeafaultID}</Alert.Description><br/>
       </Alert.Root>
   </div>
</div>