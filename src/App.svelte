<script>
  import { Button, Checkbox, Switch } from "smelte";
  export let name;
  import createScene from './createScene';
  import createMarker from './createMarker';

  const ctx = createScene();

  createMarker(ctx, { title: "plane", marker: "8" });
  createMarker(ctx, { title: "lighthouse", marker: "13" });

  animate();

  function update() {
    // if (stop) return;

    ctx.updateScene();
  }

  function animate() {
    requestAnimationFrame(animate);
    update();
    ctx.render();
    TWEEN.update();
  }
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


<div id="alert" class="alert">ВОТ ТАКОТА</div>