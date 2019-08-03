export default function initialize() {
  const scene = new THREE.Scene();

  let ambientLight = new THREE.AmbientLight(0xff0fff, 0.5);
  var light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(30, 30, 30);
  scene.add(light);
  scene.add(ambientLight);

  const camera = new THREE.Camera();
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(new THREE.Color("purple"), 0);
  renderer.setSize(640, 480);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0px";
  renderer.domElement.style.left = "0px";
  document.body.appendChild(renderer.domElement);

  const arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam"
  });

  function onResize() {
    arToolkitSource.onResize();
    arToolkitSource.copySizeTo(renderer.domElement);
    if (arToolkitContext.arController !== null) {
      arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
    }
  }

  arToolkitSource.init(
    function onReady() {
      onResize();
    },
    e => console.log(e)
  );

  // handle resize event
  window.addEventListener("resize", function() {
    onResize();
  });

  // create atToolkitContext
  const arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: "data/camera_para.dat",
    detectionMode: "mono"
  });

  // copy projection matrix to camera when initialization complete
  arToolkitContext.init(function onCompleted() {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });

  function updateScene() {
    if (arToolkitSource.ready) {
      arToolkitContext.update(arToolkitSource.domElement);
    }
  }

  function render() {
    renderer.render(scene, camera);
  }

  return {
    scene,
    camera,
    renderer,
    arToolkitSource,
    arToolkitContext,
    updateScene,
    render
  };
}
