export default function createMarker(ctx, model) {
  const { scene, arToolkitContext, camera } = ctx;

  const { title, marker } = model;

  let mesh;

  const markerRoot = new THREE.Group();
  scene.add(markerRoot);
  let markerControls = new THREEx.ArMarkerControls(
    arToolkitContext,
    markerRoot,
    {
      type: "pattern",
      patternUrl: `data/${marker}.patt`
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
          mesh = group.children[0];
          mesh.material.side = THREE.DoubleSide;
          mesh.position.y = 0.25;

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
          stop = true;
          const video = document.getElementsByTagName("video")[0];
          video.classList.add("blurred");

          const alert = document.getElementById("alert");
          alert.classList.add("visible");

          new TWEEN.Tween(markerControls.object3d.matrix.elements)
            .to(
              [
                0.6,
                -0.2,
                -0.8,
                0,
                0.5,
                -0.15901045494538538,
                0.5098486865292884,
                0,
                -0.27955281995349657,
                -0.9451791917551653,
                0.1687793786989792,
                0,
                -0.5172344446182242,
                -0.18319368362426763,
                -7.384635925292969,
                1
              ],
              1000
            )
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        }
      }

      document.addEventListener("mousedown", onDocumentMouseDown, false);
    });

  const smoothedControls = new THREEx.ArSmoothedControls(markerRoot, {
    lerpPosition: 0.8,
    lerpQuaternion: 0.8,
    lerpScale: 1
  });

  return () => smoothedControls.update(markerRoot);
}
