<script lang="ts">
   export let PageloadsidebarOpen = false
   import '$lib/Styles/CanvasCSS.css'
   import * as Select from "$lib/components/ui/select/index.js";
   import { onMount } from "svelte";
   import Swal from 'sweetalert2';

   let triggerContent = 'line';
   $:if(PageloadsidebarOpen){
      triggerContent = 'none'
   }
   onMount(()=>{
      const canvas:any = document.getElementById('canvas');
      const ctx:any = canvas.getContext('2d');
      // const toolSelect:any = document.getElementById('tool');
      const captionInput:any = document.getElementById('captionText');
      const colorInput:any = document.getElementById('color');
      const widthInput:any = document.getElementById('width');
      const upload:any = document.getElementById('upload');
      let isDrawing = false;
      let startX = 0, startY = 0;
      let image: HTMLImageElement | null = null;

      let history: any[] = [];

      upload.addEventListener('change', (e:any) => {
         const file = e.target.files[0];
         if (!file) return;
         const reader = new FileReader();
         reader.onload = (event) => {
         const img:any = new Image();
         img.onload = () => {
            const maxWidth = window.innerWidth - 40;
            const ratio = img.width / img.height;
            let newWidth = Math.min(img.width, maxWidth);
            let newHeight = newWidth / ratio;

            canvas.width = newWidth;
            canvas.height = newHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            image = img;
            history = [];
            saveHistory();
         };
         if(event){
            if(event.target){
               img.src = event.target.result;
            }
         }
         };
         reader.readAsDataURL(file);
      });

      canvas.addEventListener('mousedown', (e:any) => {
         if (triggerContent === 'none') return;
         isDrawing = true;
         const rect = canvas.getBoundingClientRect();
         startX = e.clientX - rect.left;
         startY = e.clientY - rect.top;
      });

      canvas.addEventListener('mouseup', (e:any) => {
         if (!isDrawing || triggerContent === 'none') return;
         isDrawing = false;

         const rect = canvas.getBoundingClientRect();
         const endX = e.clientX - rect.left;
         const endY = e.clientY - rect.top;

         ctx.strokeStyle = colorInput.value;
         ctx.lineWidth = parseInt(widthInput.value);
         ctx.fillStyle = colorInput.value;

         saveHistory();

         switch (triggerContent) {
         case 'line':
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            break;
         case 'rect':
            ctx.beginPath();
            ctx.rect(startX, startY, endX - startX, endY - startY);
            ctx.stroke();
            break;
         case 'text':
            const text = captionInput.value || 'Caption';
            let fontsize = parseInt(widthInput.value)*2
            ctx.font = `${fontsize}px Arial`;
            ctx.fillText(text, startX, startY);
            break;
         case 'crop':
            const width = endX - startX;
            const height = endY - startY;
            const cropped = ctx.getImageData(startX, startY, width, height);
            canvas.width = width;
            canvas.height = height;
            ctx.putImageData(cropped, 0, 0);
            break;
         }
      });

      function clearCanvas() {
         saveHistory();
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         if (image) ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
      document.getElementById("clearCanvasbtn")?.addEventListener("click",clearCanvas)

      function resetEditor() {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         image = null;
         upload.value = '';
         canvas.width = 800;
         canvas.height = 600;
         history = [];
      }
      document.getElementById("resetEditorbtn")?.addEventListener("click",resetEditor)

      function downloadImage() {
         const link = document.createElement('a');
         link.download = 'canvas_image.png';
         link.href = canvas.toDataURL();
         link.click();
      }
      document.getElementById("downloadImagebtn")?.addEventListener("click",downloadImage)

      function saveHistory() {
         try {
         history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
         if (history.length > 50) history.shift(); // keep history size manageable
         } catch (e) {
         console.warn('History not saved (possible security or memory issue)', e);
         }
      }

      function undo() {
         if (history.length > 1) {
         history.pop(); // remove current state
         const prevState = history[history.length - 1];
         canvas.width = prevState.width;
         canvas.height = prevState.height;
         ctx.putImageData(prevState, 0, 0);
         } else {
            Swal.fire({icon:"success",title:"Nothing to Undo!",confirmButtonColor: "green",timer:3000,showConfirmButton:false})
         }
      }
      document.getElementById("undobtn")?.addEventListener("click",undo)
   })
</script>
<div style={`content-visibility:${!PageloadsidebarOpen?"auto":"hidden"}`}>
<div id="toolbar" class="mx-2 my-2">
   <input type="file" id="upload" accept="image/*"  class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" />
   
   <!-- <label for="tool">Tool:</label>
   <select id="tool">
     <option value="line">Line</option>
     <option value="rect">Rectangle</option>
     <option value="text">Caption</option>
     <option value="crop">Crop</option>
     <option value="none">Disable Editing</option>
   </select> -->

   <div class="controllabeldiv">
   <Select.Root type="single" name="favoriteFruit" bind:value={triggerContent} disabled={PageloadsidebarOpen}>
      <Select.Trigger class="w-[180px]">
        {triggerContent}
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.GroupHeading>Tools</Select.GroupHeading>
            <Select.Item value={"line"}>Line</Select.Item>
            <Select.Item value={"rect"}>Rectangle</Select.Item>
            <Select.Item value={"text"}>Caption</Select.Item>
            <Select.Item value={"crop"}>Crop</Select.Item>
            <Select.Item value={"none"}>Disable Editing</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
    </div>

   <div class="controllabeldiv">
      <label for="color">Color:</label>
      <input type="color" id="color" value="#000000" />
   </div>

   <div class="controllabeldiv">
      <label for="width">Width:</label>
      <input type="number" id="width" min="1" max="20" value="10" style="width: 60px;" class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
   </div>

   <div class="controllabeldiv">
      <input type="text" id="captionText" placeholder="Enter caption..." class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-30 rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
   </div>

   <div class="controllabeldiv">
      <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md" id="undobtn">Undo</button>
      <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md" id="clearCanvasbtn">Clear All</button>
      <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md" id="resetEditorbtn">Reset</button>
      <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md" id="downloadImagebtn">Download</button>
   </div>
 </div>

 <div id="canvasWrapper">
      <canvas id="canvas"></canvas>
   </div>
</div>
<div style={`content-visibility:${PageloadsidebarOpen?"auto":"hidden"}`}>
   <p class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">
      Close the Sidebar to use the canvas
   </p>
</div>