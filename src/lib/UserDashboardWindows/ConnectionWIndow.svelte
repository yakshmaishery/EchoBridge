<script lang="ts">
   export let ConnectionType = ""
   export let IsConnected = false
   import {Info} from '@lucide/svelte/icons'
  import * as Alert from "$lib/components/ui/alert/index.js";
</script>
<div class="container" style="text-align: left;">
   <Alert.Root>
      <Info class="size-4" />
      <Alert.Title class="lg:text-3xl font-bold">Connection</Alert.Title><br/>
      <Alert.Description class="lg:text-2xl font-bold">Connection Type:-  <b class="text-green-500">{ConnectionType}</b></Alert.Description><br/>
      {#if IsConnected}
         <Alert.Description class="text-green-500 lg:text-2xl font-bold">Currently you are connected with another User!</Alert.Description><br/>
         {:else}
         <Alert.Description class="text-red-500 lg:text-2xl font-bold">Currently you are not connected with another User!</Alert.Description><br/>
      {/if}
      {#if ConnectionType == "Peer"}
         <Alert.Description>Currently you connection type is <b>PEER</b> which means there will be no thirdparty server is required for communication.</Alert.Description><br/>
         {:else}
         <Alert.Description>Currently you connection type is <b>SOCKET</b> since <b>PEER</b> connection was failed to connect you with another user</Alert.Description><br/>
      {/if}
    </Alert.Root>
</div>