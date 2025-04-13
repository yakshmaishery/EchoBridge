<script lang="ts">
   export let ConnectionType = ""
   export let IsConnected = false
   import Terminal from "@lucide/svelte/icons/terminal";
  import * as Alert from "$lib/components/ui/alert/index.js";
</script>
<div class="container">
   <Alert.Root>
      <Terminal class="size-4" />
      <Alert.Title>Connection</Alert.Title>
      <Alert.Description>Connection Type:-  <b>{ConnectionType}</b></Alert.Description>
      {#if IsConnected}
         <Alert.Description>Currently you are connected with another User!</Alert.Description>
         {:else}
         <Alert.Description>Currently you are not connected with another User!</Alert.Description>
      {/if}
      {#if ConnectionType == "Peer"}
         <Alert.Description>Currently you connection type is <b>PEER</b> which means there will be no thirdparty server is required for communication.</Alert.Description>
         {:else}
         <Alert.Description>Currently you connection type is <b>SOCKET</b> since <b>PEER</b> connection was failed to connect you with another user</Alert.Description>
      {/if}
    </Alert.Root>
</div>