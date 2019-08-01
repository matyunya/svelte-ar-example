<script>
  import { Button, Checkbox, Switch } from "smelte";
  export let name;
  import createScene from './createScene';

  const {
    scene,
    camera,
    renderer,
    arToolkitSource,
    arToolkitContext,
  } = createScene();

  let mesh0, smoothedControls, markerRoot1;

  let stop = false;

  createMarker();
  animate();

  function createMarker() {
    // build markerControls
    markerRoot1 = new THREE.Group();
    scene.add(markerRoot1);
    let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
      type: 'pattern', patternUrl: "data/hiro.patt",
    })

    smoothedControls = new THREEx.ArSmoothedControls(markerRoot1, {
      lerpPosition: 0.8,
      lerpQuaternion: 0.8,
      lerpScale: 1,
    });

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    new THREE.MTLLoader()
      .setPath( 'models/' )
      .load('plane2.mtl', function ( materials ) {
        materials.preload();
        new THREE.OBJLoader()
          .setMaterials(materials)
          .setPath( 'models/' )
          .load('plane2.obj', function ( group ) {
            mesh0 = group.children[0];
            mesh0.material.side = THREE.DoubleSide;
            mesh0.position.y = 0.25;

            let scale = 1;

            mesh0.rotation.x = -Math.PI/2;
            markerRoot1.add(mesh0);
          });

          function onDocumentMouseDown( event ) {
            event.preventDefault();
            
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            
            var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
            vector.unproject( camera );
            var ray = new THREE.Raycaster(camera.position, vector.sub( camera.position ).normalize() );
            var intersects = ray.intersectObjects( [mesh0] );
            
            if (intersects.length > 0) {
              stop = true;
              const video = document.getElementsByTagName("video")[0];
              video.classList.add("blurred");

              const alert = document.getElementById("alert");
              alert.classList.add("visible");
              const tween = new TWEEN.Tween(markerControls1.object3d.matrix.elements) // Create a new tween that modifies 'coords'.
                .to([0.6,-0.2,-0.8,0,0.5,-0.15901045494538538,0.5098486865292884,0,-0.27955281995349657,-0.9451791917551653,0.1687793786989792,0,-0.5172344446182242,-0.18319368362426763,-7.384635925292969,1], 1000) // Move to (300, 200) in 1 second.
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();


              console.log(markerControls1.object3d);
            }
          }

          document.addEventListener('mousedown', onDocumentMouseDown, false );
      });
  }

  function update() {
    if (stop) return;

    // update artoolkit on every frame
    if ( arToolkitSource.ready !== false ) {
      arToolkitContext.update( arToolkitSource.domElement );
    }

    smoothedControls.update(markerRoot1);
  }


  function render() {
    renderer.render(scene, camera);
  }

  function animate() {
    requestAnimationFrame(animate);
    update();
    render();
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