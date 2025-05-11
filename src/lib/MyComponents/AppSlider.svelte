<script lang="ts">
   export let Window = ""
   export let IsConnected = false
   export let ConnectionType = ""

   import {Home,MessageSquareMore,Video,CloudUpload,Sun,Moon,Landmark,Contact,Bell,Cable,Monitor,Cctv,Image,ImageUpscale} from '@lucide/svelte/icons'
   import * as Sidebar from "$lib/components/ui/sidebar/index.js";
   import { toggleMode } from "mode-watcher";
   import { Button } from "$lib/components/ui/button/index.js";
   import '$lib/Styles/AppSliderCSS.css'
    import Swal from 'sweetalert2';
    function isMobileDevice() {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      return isTouchDevice && isMobileUA;
    }

    let itemsDisableMobile = ["ShareScreen"]
    let items2DisableMobile = ["ScreenRecord","Snippingtool","Canvas"]

   
   // Menu items.
   const items = [
    {
      title:"Home",
      window:"Home",
      icon:Home
    }
    ,{
      title:"Chat",
      window:"Chat",
      icon:MessageSquareMore
    }
    ,{
      title:"Video call",
      window:"videocall",
      icon:Video
    }
    ,{
      title:"File Transfer",
      window:"FileTransfer",
      icon:CloudUpload
    }
    ,{
      title:"Share Screen",
      window:"ShareScreen",
      icon:Monitor
    }
   ];
   // Menu items.
   const items2 = [
    {
      title:"Screen Recorder",
      window:"ScreenRecord",
      icon:Cctv
    }
    ,{
      title:"Snipping",
      window:"Snippingtool",
      icon:Image
    }
    ,{
      title:"Image Canvas",
      window:"Canvas",
      icon:ImageUpscale
    }
   ]
   // Menu items.
   const items1 = [
    {
      title:"Tutorial",
      window:"Tutorial",
      icon:Landmark
    },
    {
      title:"Contact",
      window:"Contact",
      icon:Contact
    },
    {
      title:"Notice",
      window:"Notice",
      icon:Bell
    },
    {
      title:"Connection",
      window:"ConnectionWindow",
      icon:Cable
    }
   ];

   function ChangeWindow(win:string){
      document.title = `EchoBridge - ${win}`
      Window = win
   }
  </script>
  <Sidebar.Root>
    <Sidebar.Header>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <a href="/" data-sveltekit-reload>
          <div style="display: flex;align-items: center;gap: 20px;font-weight:bold;font-size:larger;cursor:pointer">
            <img src="/Images/favicon.png" alt="App Logo" class="logo" width="30%" />EchoBridge
          </div>
          </a>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Header>
   <Sidebar.Content>
   <!-- Dashboard Starts here -->
    <Sidebar.Group>
     <Sidebar.GroupLabel>Dashboard</Sidebar.GroupLabel>
     <Sidebar.GroupContent>
      <Sidebar.Menu>
       {#each items as item (item.title)}
        <Sidebar.MenuItem>
          {#if !isMobileDevice() || (!itemsDisableMobile.includes(item.window))} <!-- Check if mobile hide some menus -->
            <Sidebar.MenuButton class={item.window == Window?"menuitemsselect":"menuitems"}>
            {#snippet child({ props })}
              <a {...props} style="cursor: pointer;" on:click={()=>{
                if(IsConnected){
                  if(ConnectionType == "Peer"){
                    ChangeWindow(item.window)
                  }
                  else if(item.window != "ShareScreen" && item.window != "videocall"){
                    ChangeWindow(item.window)
                  }
                  else{
                    Swal.fire({icon:"error",title:`Current Connection type is not allowed for this feature to access.`,confirmButtonColor: "green",timer:3000,showConfirmButton:false})
                  }
                }
                else if(item.window == "Home" || item.window == "ScreenRecord"){
                  ChangeWindow(item.window)
                }
                else{
                  Swal.fire({icon:"error",title:`You need to create connection first with another person! to access ${item.title}`,confirmButtonColor: "green",timer:3000,showConfirmButton:false})
                }
              }}>
              <item.icon />
              <span>{item.title}</span>
              </a>
            {/snippet}
            </Sidebar.MenuButton>
          {/if}
        </Sidebar.MenuItem>
       {/each}
      </Sidebar.Menu>
     </Sidebar.GroupContent>
    </Sidebar.Group>
    <!-- Dashboard Ends here -->
    <!-- Settings Starts here -->
    <Sidebar.Group>
     <Sidebar.GroupLabel>Settings</Sidebar.GroupLabel>
     <Sidebar.GroupContent>
      <Sidebar.Menu>
       <!-- {#each items as item (item.title)} -->
        <Sidebar.MenuItem>
         <div style="display: flex;align-items: center;gap: 10px;">
            <Button onclick={toggleMode} variant="outline" size="icon">
               <Sun
                 class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
               />
               <Moon
                 class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
               />
               <span class="sr-only">Toggle theme</span>
             </Button>
             Dark Mode
         </div>
        </Sidebar.MenuItem>
       <!-- {/each} -->
      </Sidebar.Menu>
     </Sidebar.GroupContent>
    </Sidebar.Group>
    <!-- Settings Ends here -->
    <!-- Other tools Starts here -->
    <Sidebar.Group>
     <Sidebar.GroupLabel>Other tools</Sidebar.GroupLabel>
     <Sidebar.GroupContent>
      <Sidebar.Menu>
         {#each items2 as item (item.title)}
         <Sidebar.MenuItem>
          {#if !isMobileDevice() || (!items2DisableMobile.includes(item.window))} <!-- Check if mobile hide some menus -->
          <Sidebar.MenuButton class={item.window == Window?"menuitemsselect":"menuitems"}>
           {#snippet child({ props })}
            <a {...props} style="cursor: pointer;" on:click={()=>{ChangeWindow(item.window)}}>
             <item.icon />
             <span>{item.title}</span>
            </a>
           {/snippet}
          </Sidebar.MenuButton>
          {/if}
         </Sidebar.MenuItem>
        {/each}
      </Sidebar.Menu>
     </Sidebar.GroupContent>
    </Sidebar.Group>
    <!-- Other tools Ends here -->
    <!-- About Starts here -->
    <Sidebar.Group>
     <Sidebar.GroupLabel>About</Sidebar.GroupLabel>
     <Sidebar.GroupContent>
      <Sidebar.Menu>
         {#each items1 as item (item.title)}
         <Sidebar.MenuItem>
          <Sidebar.MenuButton class={item.window == Window?"menuitemsselect":"menuitems"}>
           {#snippet child({ props })}
            <a {...props} style="cursor: pointer;" on:click={()=>{ChangeWindow(item.window)}}>
             <item.icon />
             <span>{item.title}</span>
            </a>
           {/snippet}
          </Sidebar.MenuButton>
         </Sidebar.MenuItem>
        {/each}
      </Sidebar.Menu>
     </Sidebar.GroupContent>
    </Sidebar.Group>
    <!-- About Ends here -->
   </Sidebar.Content>
  </Sidebar.Root>