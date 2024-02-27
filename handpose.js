let video = document.querySelector("#vid");
let mediaDevices = navigator.mediaDevices;
// vid.muted = true;
// but.addEventListener("click", () => {
// Accessing the user camera and video.
mediaDevices
    .getUserMedia({
        video: true,
        // audio: true,
    })
    .then((stream) => {
        // Changing the source of video to current stream.
        // console.log(video);
        video.srcObject = stream;
        video.play();
        video.addEventListener("loadedmetadata", (e) => {
            console.log(e);
            video.play();
        });
    })

// const model = handPoseDetection.SupportedModels.MediaPipeHands;
// const detectorConfig = {
//   runtime: 'mediapipe', // or 'tfjs',
//   solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
//   modelType: 'full'
// }
// const detector = await handPoseDetection.createDetector(model, detectorConfig);
// const hands = await detector.estimateHands(video);
// console.log(hands);