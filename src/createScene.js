export default function initialize() {
  const scene = new THREE.Scene();

  var point = new THREE.PointLight(0xffffff, 3);

  let ambientLight = new THREE.HemisphereLight(0xfcfde3, 0xb97a20, 3);
  var light = new THREE.DirectionalLight(0xe3f2fd, 2);
  var spotLight = new THREE.DirectionalLight(0x1565c0, 2);
  light.position.set(-30, 30, 30);
  spotLight.position.set(30, 50, 50);

  const camera = new THREE.Camera();
  scene.add(camera);
  const lights = [ambientLight, light, spotLight, point];

  lights.forEach(l => {
    camera.add(l);
  });

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  const w = window.innerWidth * 2;
  const h = window.innerHeight * 2;
  renderer.setSize(window.innerWidth * 4, window.innerHeight * 4);

  renderer.domElement.style.width = w;
  renderer.domElement.style.height = h;
  renderer.domElement.width = w * 2;
  renderer.domElement.height = h * 2;
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0px";
  renderer.domElement.style.left = "0px";
  renderer.physicallyCorrectLights = true;
  // renderer.shadowMapEnabled = true;
  // renderer.shadowMapSoft = true;
  // renderer.shadowMapType = THREE.PCFSoftShadowMap;
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
    render,
    lights
  };
}
