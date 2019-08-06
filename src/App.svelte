<script>
  import { Dialog, Button } from "smelte";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  export let name;
  import createScene from './createScene';
  import createMarker from './createMarker';
  import { fly } from "svelte/transition";

  const ctx = createScene();

  let initialDialog = true;
  let showDialog = writable(false);

  const cont1 = createMarker(ctx, { title: "plane" }, showDialog);
  const cont2 = createMarker(ctx, { title: "lighthouse" }, showDialog);

  animate();

  onMount(() => {
    document.getElementsByTagName("canvas")[0].style.zIndex = 100;
    document.getElementsByTagName("canvas")[0].style.pointerEvents = "none";
  })

  const titles = {
    plane: "Международный  коридор для малой  авиации «Аляска –  Сибирь»",
    lighthouse: "МОЕЧОК"
  };
  
  const descs = {
    plane: "По мере развития малой авиации в мире растет мобильность путешественников. Наиболее мощным рынком для малой авиации сегодня является Северная Америка (только на Аляске парк малой авиации – 12 тыс. самолетов). Идея – в обеспечении возможности безопасных трансконтинентальных перелетов из Америки в Юго-Восточную Азию для малых самолетов (через отрезок Ном/Фэрбанкс – Провидения/Анадырь). Необходимые мероприятия: – Аудит маршрута (порядок заявления рейсов, выявление сложностей, упрощение процедур) – Партнерство с ассоциациями авиаторов Аляски – Активный маркетинг на рынке Аляски и Юго-Восточной Азии – Проведение исторического воздушного парада к 80-летию Алсиба (2022 год) ",
    lighthouse: "ОПЕСАНИЕ МОЕЧОК",
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

.dialog {
  width: 500px;
}
</style>


<div class="fixed top-0 left-0 h-full w-full z-50">
  <img class="absolute right-0 top-0 mt-10 mr-10 z-50" width="70" src="chukotka.png" alt="chukotka">

  <Dialog
    bind:value={$showDialog}
    opacity={0.8}
    scrimProps={{
      inProps:{ duration: 1000 },
      outProps:{ duration: 1000 },
    }}
    wrapperClasses="items-center z-10 rounded bg-primary-transDark text-white p-4 text-lg relative dialog py-10">
    <div class="px-10 max-w-2xl mx-auto">
      <div transition:fly class="text-xl text-center">{title}</div>
      <hr class="mb-6">
      <div transition:fly class="font-light">
        <p>
          {desc}
        </p>
      </div>
    </div>
  </Dialog>

  <Dialog
    bind:value={initialDialog}
    opacity={0.8}
    scrimProps={{
      inProps:{ duration: 1000 },
      outProps:{ duration: 1000 },
    }}
    wrapperClasses="items-center z-10 rounded bg-transparent p-4 text-white text-lg relative">
    <Button
      outlined
      on:click={(e) => {
        e.preventDefault();
        initialDialog = false;
      }}
      color="primary"
      remove="hover:bg-primary-trans"
      add="hover:bg-primary-transDark"
    >
      Наведите планшет на любую отметку и нажмите на фигурку
    </Button>
  </Dialog>

</div>