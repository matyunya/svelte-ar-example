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

  new THREE.GLTFLoader().setPath("models/").load(`ship.glb`, function(group) {
    mesh = group.scene;
    console.log(mesh);

    // mesh.children.forEach(c => {
    //   c.castShadow = true;
    //   c.receiveShadow = true;
    // });

    // mesh.position.y = 0.25;

    mesh.children.forEach(c => (c.castShadow = true));

    // mesh.scale.x = 1;
    // mesh.scale.y = 1;
    // mesh.scale.z = 1;

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
            0.9946019053459167,
            -0.09622358530759799,
            0.038838528096676,
            0,
            -0.07378231734037406,
            -0.3926204144954681,
            0.9167366623878479,
            0,
            -0.07296279072761519,
            -0.9146525859832764,
            -0.39760044217109675,
            0,
            -1.6659895181655877,
            -0.07961864024400732,
            -4.709328651428223,
            1
          ],
          1200
        )
        .easing(TWEEN.Easing.Quadratic.In)
        .start();

      new TWEEN.Tween(mesh.scale)
        .to({ x: 0.5, y: 0.5, z: 0.5 }, 1000 - 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

      ctx.lights.forEach(l => {
        new TWEEN.Tween(l).to({ intensity: 3 }, 1000).start();
      });

      stopped.update(() => ({
        title,
        onClose: () => {
          let t;
          stopped.update(v => {
            t = v.title;
            return v;
          });

          if (t === title) return;

          ctx.lights.forEach(l => {
            new TWEEN.Tween(l).to({ intensity: 1 }, 1000).start();
          });

          new TWEEN.Tween(mesh.scale)
            .to({ x: 1, y: 1, z: 1 }, 1000 - 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        }
      }));
    }
  }

  document.addEventListener("mousedown", onDocumentMouseDown, false);
  document.addEventListener("touchend", onDocumentMouseDown, false);

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
