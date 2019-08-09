export default function createMarker(ctx, model, stopped) {
  const { scene, arToolkitContext, camera } = ctx;

  const { title } = model;

  let mesh, s;

  const markerRoot = new THREE.Group();
  scene.add(markerRoot);
  let markerControls = new THREEx.ArMarkerControls(
    arToolkitContext,
    markerRoot,
    {
      type: "pattern",
      patternUrl: `data/${title}.patt`
    }
  );

  const mouse = new THREE.Vector2();

  const geometry = new THREE.BoxGeometry(1, 1, 2);
  const material = new THREE.MeshLambertMaterial({
    opacity: 0,
    transparent: true
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.z -= 0.5;

  markerRoot.add(cube);

  new THREE.GLTFLoader()
    .setPath("models/")
    .load(`${title}.glb`, function(group) {
      mesh = group.scene;
      console.log(mesh);

      mesh.position.y = 0.25;

      mesh.children.forEach(c => (c.castShadow = true));

      mesh.scale.x = 1;
      mesh.scale.y = 1;
      mesh.scale.z = 1;

      setTimeout(function() {
        s = setInterval(() => (mesh.rotation.y += 0.05), 20);
      }, 1000 - 200);

      mesh.rotation.x = -Math.PI / 2;
      markerRoot.add(mesh);
    });

  function onDocumentMouseDown(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    vector.unproject(camera);
    var ray = new THREE.Raycaster(
      camera.position,
      vector.sub(camera.position).normalize()
    );
    var intersects = ray.intersectObjects([cube]);

    if (intersects.length > 0) {
      new TWEEN.Tween(markerControls.object3d.matrix.elements)
        .to(
          [
            0.9616535305976868,
            0.03676606714725506,
            0.2717910110950471,
            0,
            -0.26652061939239513,
            -0.10857757925987241,
            0.9576937556266785,
            0,
            0.06472101062536252,
            -0.9934077858924866,
            -0.09461507946252816,
            0,
            -0.8124303221702572,
            -0.22422127425670635,
            -2.9146223068237305,
            1
          ],
          1200
        )
        .easing(TWEEN.Easing.Quadratic.In)
        .start();

      new TWEEN.Tween(mesh.scale)
        .to({ x: 0.12, y: 0.12, z: 0.1 }, 1000 - 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

      ctx.lights.forEach(l => {
        new TWEEN.Tween(l).to({ intensity: 0.8 }, 1000).start();
      });

      stopped.update(() => ({
        title,
        onClose: () => {
          ctx.lights.forEach(l => {
            new TWEEN.Tween(l).to({ intensity: 0.7 }, 1000).start();
          });
        }
      }));
    }
  }

  document.addEventListener("mousedown", onDocumentMouseDown, false);
  document.addEventListener("touchstart", onDocumentMouseDown, false);

  const smoothedControls = new THREEx.ArSmoothedControls(markerRoot, {
    // lerp coeficient for the position - between [0,1] - default to 1
    lerpPosition: 0.8,
    // lerp coeficient for the quaternion - between [0,1] - default to 1
    lerpQuaternion: 0.2,
    // lerp coeficient for the scale - between [0,1] - default to 1
    lerpScale: 0.7,
    // delay for lerp fixed steps - in seconds - default to 1/120
    lerpStepDelay: 1 / 60,
    // minimum delay the sub-control must be visible before this controls become visible - default to 0 seconds
    minVisibleDelay: 0.0,
    // minimum delay the sub-control must be unvisible before this controls become unvisible - default to 0 seconds
    minUnvisibleDelay: 0.2
  });

  return {
    update: () => smoothedControls.update(markerRoot)
  };
}
