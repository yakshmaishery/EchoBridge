<script lang="ts">
   export let UserMessage = ""
   export let IsConnected = false
   export let ConversationLogMessages:{MessageType:string,Message:string,datetime:string,loginID:string}[] = []
   import { createEventDispatcher } from 'svelte';
   import { Send,Ellipsis } from "@lucide/svelte";
   import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
   import { Textarea } from "$lib/components/ui/textarea/index.js";
   import "$lib/Styles/ChatWindowCSS.css"
   import Swal from 'sweetalert2';
   const dispatch = createEventDispatcher();
   function ClipBoardCopy(msg:string){
      navigator.clipboard.writeText(msg)
      Swal.fire({icon:"success",title:`Copied Message Successfully!`,confirmButtonColor: "green",timer:1500,showConfirmButton:false})
   }
</script>
<div class="dark:text-white ChatWindow">
   <div class="chatbubblewindow" id="chatwindow">
      <div class="chat-container">
         {#each ConversationLogMessages as item}   
            {#if item.MessageType != "Sender"}
               <div class="chat-bubble chat-left">
                  <!-- <button on:click={()=>{navigator.clipboard.writeText(item.message)}}>📋</button> -->
                   <div class="dotbtn">
                  <DropdownMenu.Root>
                     <DropdownMenu.Trigger><Ellipsis/></DropdownMenu.Trigger>
                     <DropdownMenu.Content>
                       <DropdownMenu.Group>
                         <!-- <DropdownMenu.GroupHeading>My Account</DropdownMenu.GroupHeading>
                         <DropdownMenu.Separator />
                         <DropdownMenu.Item>Billing</DropdownMenu.Item>
                         <DropdownMenu.Item>Team</DropdownMenu.Item>
                         <DropdownMenu.Item>Subscription</DropdownMenu.Item> -->
                         <button on:click={()=>{ClipBoardCopy(item.Message)}} class="mx-3 my-3">Copy</button>
                         <DropdownMenu.Item>{item.datetime}</DropdownMenu.Item>
                        </DropdownMenu.Group>
                     </DropdownMenu.Content>
                   </DropdownMenu.Root>
                   </div>
                  <pre>{item.Message}</pre>
               </div>
               {:else}
               <div class="chat-bubble chat-right">
                  <!-- <button on:click={()=>{navigator.clipboard.writeText(item.message)}}>📋</button> -->
                  <div class="dotbtn">
                  <DropdownMenu.Root>
                     <DropdownMenu.Trigger class="chatcontrolbutton"><Ellipsis/></DropdownMenu.Trigger>
                     <DropdownMenu.Content>
                       <DropdownMenu.Group>
                         <!-- <DropdownMenu.GroupHeading>My Account</DropdownMenu.GroupHeading>
                         <DropdownMenu.Separator />
                         <DropdownMenu.Item>Billing</DropdownMenu.Item>
                         <DropdownMenu.Item>Team</DropdownMenu.Item>
                         <DropdownMenu.Item>Subscription</DropdownMenu.Item> -->
                         <button on:click={()=>{ClipBoardCopy(item.Message)}} class="mx-3 my-3">Copy</button>
                         <DropdownMenu.Item>{item.datetime}</DropdownMenu.Item>
                       </DropdownMenu.Group>
                     </DropdownMenu.Content>
                   </DropdownMenu.Root>
                   </div>
                  <pre>{item.Message}</pre>
               </div>
            {/if}
         {/each}
      </div>
   </div>
   <div class="Textdiv">
      <Textarea style="min-height:auto" rows={1} bind:value={UserMessage} disabled={!IsConnected} />
      <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md" 
      on:click={()=>{dispatch("SendMessage")}} disabled={!IsConnected}><Send/></button>
   </div>
</div>