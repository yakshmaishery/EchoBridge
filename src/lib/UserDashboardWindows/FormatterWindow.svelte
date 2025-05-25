<script lang="ts">
   import * as Select from "$lib/components/ui/select/index.js";
   import { onMount } from "svelte";
   import Swal from 'sweetalert2';
   import { Textarea } from "$lib/components/ui/textarea/index.js";
   let triggerContent = 'none';
   let UserText = ""
   let ResultText = ""
   const OnSubmit = () => {
      try{
         if(triggerContent == "JSON Object"){
            ResultText = JSON.parse(UserText)
         }
         else if(triggerContent == "JSON Stringify"){
            ResultText = JSON.stringify(UserText)
         }
         else if(triggerContent == "XML"){
            // Step 1: Parse the XML string
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(UserText, "application/xml");

            // Step 2: Serialize it back to a string
            const serializer = new XMLSerializer();
            ResultText = serializer.serializeToString(xmlDoc);
            ResultText = formatXml(ResultText)
         }
      }
      catch(e){
         Swal.fire({icon:"error",title:"Something went wrong!",html:`${e}`,confirmButtonColor: "green"})
         ResultText = ""
      }
   }
   function formatXml(xmlString:string) {
   const PADDING = '  '; // 2 spaces
   const reg = /(>)(<)(\/*)/g;
   let xml = xmlString.replace(reg, '$1\r\n$2$3'); // split tags

   let formatted = '';
   let pad = 0;

   xml.split('\r\n').forEach((node) => {
      if (node.match(/^<\/\w/)) {
         pad -= 1;
      }

      formatted += PADDING.repeat(pad) + node.trim() + '\n';

      if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
         pad += 1;
      }
   });

   return formatted.trim();
   }


</script>
<div class="mx-3 my-3" style="display: flex;gap:10px">
   <Select.Root type="single" name="favoriteFruit" bind:value={triggerContent} disabled={UserText==""}>
      <Select.Trigger class="w-[180px]">
        {triggerContent}
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.GroupHeading>Format</Select.GroupHeading>
            <Select.Item value={"none"}>None</Select.Item>
            <Select.Item value={"JSON Object"}>JSON Object</Select.Item>
            <Select.Item value={"JSON Stringify"}>JSON Stringify</Select.Item>
            <Select.Item value={"XML"}>XML</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
    <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md" 
    disabled={UserText==""} on:click={OnSubmit}>Submit</button>
</div>
<div class="mx-3 my-3">
   <Textarea style="min-height:auto" rows={5} bind:value={UserText} placeholder="Please enter the text here..." />
   <Textarea style="min-height:auto" rows={5} bind:value={ResultText} placeholder="Output..." class="my-3" />
    <!-- <pre>{ResultText}</pre> -->
</div>