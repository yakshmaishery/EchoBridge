<script lang="ts">
   export let UserMessage = ""
   export let IsConnected = false
   export let ConversationLogMessages:{MessageType:string,Message:string,datetime:string,loginID:string}[] = []
   import { createEventDispatcher } from 'svelte';
   import { Send,Ellipsis,Copy,ExternalLink } from "@lucide/svelte";
   import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
   import { Textarea } from "$lib/components/ui/textarea/index.js";
   import "$lib/Styles/ChatWindowCSS.css"
   import Swal from 'sweetalert2';
   const dispatch = createEventDispatcher();
   function ClipBoardCopy(msg:string){
      navigator.clipboard.writeText(msg)
      Swal.fire({icon:"success",title:`Copied Message Successfully!`,confirmButtonColor: "green",timer:1500,showConfirmButton:false})
   }
   function isValidURL(text:string) {
   try {
      new URL(text);
      return true;
   } catch (e) {
      return false;
   }
   }
   function OpenURLanotherTab(urlstr:string){
      window.open(urlstr,"_blank")
   }
</script>
<div class="dark:text-white ChatWindow">
   <div class="chatbubblewindow" id="chatwindow">
      <div class="chat-container">
         {#each ConversationLogMessages as item}   
            {#if item.MessageType != "Sender"}
               <div class="chat-bubble chat-left">
                   <div class="dotbtn">
                  <DropdownMenu.Root>
                     <DropdownMenu.Trigger><Ellipsis/></DropdownMenu.Trigger>
                     <DropdownMenu.Content>
                       <DropdownMenu.Group>
                           <DropdownMenu.Item>
                              <button on:click={()=>{ClipBoardCopy(item.Message)}} class="copybutton">Copy Chat <Copy/></button>
                           </DropdownMenu.Item>
                           {#if isValidURL(item.Message)}
                              <DropdownMenu.Item>
                                 <button on:click={()=>{OpenURLanotherTab(item.Message)}} class="copybutton">open URL <ExternalLink/></button>
                              </DropdownMenu.Item>
                           {/if}
                        <DropdownMenu.Separator />
                         <DropdownMenu.Item>{item.datetime}</DropdownMenu.Item>
                        </DropdownMenu.Group>
                     </DropdownMenu.Content>
                   </DropdownMenu.Root>
                   </div>
                  <pre>{item.Message}</pre>
               </div>
               {:else}
               <div class="chat-bubble chat-right">
                  <div class="dotbtn">
                  <DropdownMenu.Root>
                     <DropdownMenu.Trigger class="chatcontrolbutton"><Ellipsis/></DropdownMenu.Trigger>
                     <DropdownMenu.Content>
                       <DropdownMenu.Group>
                         <DropdownMenu.Item>
                            <button on:click={()=>{ClipBoardCopy(item.Message)}} class="copybutton">Copy Chat <Copy/></button>
                           </DropdownMenu.Item>
                           {#if isValidURL(item.Message)}
                              <DropdownMenu.Item>
                                 <button on:click={()=>{OpenURLanotherTab(item.Message)}} class="copybutton">open URL <ExternalLink/></button>
                              </DropdownMenu.Item>
                           {/if}
                        <DropdownMenu.Separator />
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