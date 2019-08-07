export default function createMarker(ctx, model, stopped) {
  const { scene, arToolkitContext, camera } = ctx;

  const { title } = model;

  let mesh;

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

  new THREE.MTLLoader()
    .setPath("models/")
    .load(`${title}.mtl`, function(materials) {
      materials.preload();
      new THREE.OBJLoader()
        .setMaterials(materials)
        .setPath("models/")
        .load(`${title}.obj`, function(group) {
          mesh = group;
          mesh.position.y = 0.25;

          mesh.scale.x = 0.3;
          mesh.scale.y = 0.3;
          mesh.scale.z = 0.3;

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
        var intersects = ray.intersectObjects([mesh]);

        if (intersects.length > 0) {
          stopped.update(() => title);

          new TWEEN.Tween(markerControls.object3d.matrix.elements)
            .to(
              [
                0.878688156604767,
                -0.015010415576398265,
                -0.4771596789360045,
                0,
                0.3572618067264557,
                -0.6422934532165527,
                0.6781015396118164,
                0,
                -0.3166553378105162,
                -0.7663110494613647,
                -0.5590136051177979,
                0,
                -2.6200318336486808,
                0.9250363111495968,
                -7.904438018798828,
                1
              ],
              3000
            )
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

          new TWEEN.Tween(mesh.scale)
            .to({ x: 0.35, y: 0.35, z: 0.35 }, 20000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        }
      }

      document.addEventListener("mousedown", onDocumentMouseDown, false);
      document.addEventListener("touchstart", onDocumentMouseDown, false);
    });

  const smoothedControls = new THREEx.ArSmoothedControls(markerRoot, {
    lerpPosition: 0.5,
    lerpQuaternion: 0.5,
    lerpScale: 0.5,
    minVisibleDelay: 0.5,
    minUnvisibleDelay: 0.5,
    lerpStepDelay: 1 / 120
  });

  return {
    update: () => smoothedControls.update(markerRoot)
  };
}
