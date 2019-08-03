<script>
  import { Dialog, Button } from "smelte";
  import { writable } from "svelte/store";
  export let name;
  import createScene from './createScene';
  import createMarker from './createMarker';

  const ctx = createScene();

  let initialDialog = true;
  let showDialog = writable(false);

  const cont1 = createMarker(ctx, { title: "plane" }, showDialog);
  const cont2 = createMarker(ctx, { title: "lighthouse" }, showDialog);

  animate();

  const titles = {
    plane: "СОМОЛЕТИК",
    lighthouse: "МОЕЧОК"
  };
  
  const descs = {
    plane: "ОПЕСАНИЕ СОМОЛЕТНИК",
    plane: "ОПЕСАНИЕ МОЕЧОК",
  }

  let desc, title;

  $: desc = descs[$showDialog];
  $: title = titles[$showDialog];

  function update() {
    if ($showDialog) return;

    ctx.updateScene();

    cont1.update();
    cont2.update();
  }

  function animate() {
    requestAnimationFrame(animate);
    update();
    ctx.render();
    TWEEN.update();
  }

  $: console.log($showDialog);
</script>

<style>
:global(body) {
  margin: 0px;
  overflow: hidden;
}

.alert {
	position: fixed;
	top: 20%;
	left: 50%;
	font-size: 30px;
	color: white;
	opacity: 0;
	transition: opacity 3s;
	display: none;
}

:global(.visible) {
	display: block;
	opacity: 1;
	transition: opacity 4s;
	transition-delay: 1s;
}

:global(.blurred) {
	filter: blur(10px) brightness(20%);
	transition: all 2s ease;
}
</style>

<div class="fixed top-0 left-0 h-full w-full z-50">
  <img class="absolute right-0 top-0 mt-10 mr-10 z-50" width="70" src="chukotka.png" alt="chukotka">
  {#if desc}
    <div class="container">
      {desc} {title}
    </div>
  {/if}

  <Dialog
    bind:value={$showDialog}
    opacity={0.8}
    scrimProps={{
      inProps:{ duration: 1000 },
      outProps:{ duration: 1000 },
    }}
    wrapperClasses="items-center z-50 rounded bg-white p-4 text-white text-lg relative">
   <div slot="title">{title}</div>
   <div>{desc}</div>
  </Dialog>

  <Dialog
    bind:value={initialDialog}
    opacity={0.8}
    scrimProps={{
      inProps:{ duration: 1000 },
      outProps:{ duration: 1000 },
    }}
    wrapperClasses="items-center z-50 rounded bg-transparent p-4 text-white text-lg relative">
    <Button
      outlined
      on:click={() => initialDialog = false}
      color="primary"
      remove="hover:bg-primary-trans"
      add="hover:bg-primary-transDark"
    >
      Наведите планшет на любую отметку и нажмите на фигурку
    </Button>
  </Dialog>

</div>


<div id="alert" class="alert">ВОТ ТАКОТА</div>