import { Injectable } from '@angular/core';

declare var mat4: any;
declare var VRPanorama: any;
declare var WGLUStats: any;
declare var VRSamplesUtil: any;
declare var navigator: any;
declare var VRFrameData: any;
declare var VRSamplesUtil: any;
declare var VRSamplesUtil: any;
declare var VRSamplesUtil: any;

@Injectable()
export class VrEngineService {

  constructor() {}

  public panorama: any;
  public curAsset: string = "assets/imgs/pano2.jpg";
  public vrDisplay: any = null;
  public frameData = null;
  public projectionMat = mat4.create();
  public poseMat = mat4.create();
  public viewMat = mat4.create();
  public vrPresentButton = null;
  public webglCanvas: any;
  public vr: boolean = false;

  buildViewer(asset: string, canvas: string): void {
    if (asset == "") {
      asset = this.curAsset;
    } else {
      this.curAsset = asset;
    }

    this.panorama = null;

    // ================================================================
    // WebGL and WebAudio scene setup. This code is not WebVR specific.
    // ================================================================
    // WebGL setup.
    this.webglCanvas = document.getElementById(canvas);
    var gl = null;
    var stats = null;

    var self = this;

    function init(preserveDrawingBuffer) {
      var glAttribs = {
        alpha: false,
        antialias: false,
        preserveDrawingBuffer: preserveDrawingBuffer
      };

      gl = self.webglCanvas.getContext("webgl", glAttribs);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      self.panorama = new VRPanorama(gl);
      self.panorama.setImage(asset);

      //stats = new WGLUStats(gl);
      // Wait until we have a WebGL context to resize and start rendering.

      window.addEventListener("resize", onResize, false);
      onResize();
      window.requestAnimationFrame(onAnimationFrame);
    }
    // ================================
    // WebVR-specific code begins here.
    // ================================
    function onVRRequestPresent() {
      self.vrDisplay.requestPresent([{ source: self.webglCanvas }]).then(function() {}, function() {
        VRSamplesUtil.addError("requestPresent failed.", 2000);
      });
    }

    function onVRExitPresent() {
      if (!self.vrDisplay.isPresenting)
        return;
      self.vrDisplay.exitPresent().then(function() {}, function() {
        VRSamplesUtil.addError("exitPresent failed.", 2000);
      });
    }

    function onVRPresentChange() {
      onResize();
      if (self.vrDisplay.isPresenting) {
        if (self.vrDisplay.capabilities.hasExternalDisplay) {
          VRSamplesUtil.removeButton(self.vrPresentButton);
          self.vrPresentButton = VRSamplesUtil.addButton("Exit VR", "E", "media/icons/cardboard64.png", onVRExitPresent);
          self.vr = false;
        }
      } else {
        if (self.vrDisplay.capabilities.hasExternalDisplay) {
          VRSamplesUtil.removeButton(self.vrPresentButton);
          self.vr = true // self.vrPresentButton = VRSamplesUtil.addButton("Enter VR", "E", "media/icons/cardboard64.png", onVRRequestPresent);
        }
      }
    }
    if (navigator.getVRDisplays) {
      self.frameData = new VRFrameData();
      navigator.getVRDisplays().then(function(displays) {
        if (displays.length > 0) {
          self.vrDisplay = displays[0];
          self.vrDisplay.depthNear = 0.1;
          self.vrDisplay.depthFar = 1024.0;
          init(true);
          if (!self.vrDisplay.stageParameters) {
            //VRSamplesUtil.addButton("Reset Pose", "R", null, function () { vrDisplay.resetPose(); });
          }
          if (self.vrDisplay.capabilities.canPresent)
            self.vr = true //self.vrPresentButton = VRSamplesUtil.addButton("Enter VR", "E", "media/icons/cardboard64.png", onVRRequestPresent);
          window.addEventListener('vrdisplaypresentchange', onVRPresentChange, false);
          window.addEventListener('vrdisplayactivate', onVRRequestPresent, false);
          window.addEventListener('vrdisplaydeactivate', onVRExitPresent, false);
        } else {
          init(false);
          VRSamplesUtil.addInfo("WebVR supported, but no VRDisplays found.", 3000);
        }
      });
    } else if (navigator.getVRDevices) {
      init(false);
      VRSamplesUtil.addError("Your browser supports WebVR but not the latest version. See <a href='http://webvr.info'>webvr.info</a> for more info.");
    } else {
      init(false);
      VRSamplesUtil.addError("Your browser does not support WebVR. See <a href='http://webvr.info'>webvr.info</a> for assistance.");
    }

    function onResize() {
      if (self.vrDisplay && self.vrDisplay.isPresenting) {
        var leftEye = self.vrDisplay.getEyeParameters("left");
        var rightEye = self.vrDisplay.getEyeParameters("right");
        self.webglCanvas.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
        self.webglCanvas.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);
      } else {
        self.webglCanvas.width = self.webglCanvas.offsetWidth * window.devicePixelRatio;
        self.webglCanvas.height = self.webglCanvas.offsetHeight * window.devicePixelRatio;
      }
    }

    function getPoseMatrix(out, pose) {
      // When rendering a panorama ignore the pose position. You want the
      // users head to stay centered at all times. This would be terrible
      // advice for any other type of VR scene, by the way!
      var orientation = pose.orientation;
      if (!orientation) { orientation = [0, 0, 0, 1]; }
      mat4.fromQuat(out, orientation);
      mat4.invert(out, out);
    }

    function onAnimationFrame(t) {
      //stats.begin();
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (self.vrDisplay) {
        self.vrDisplay.requestAnimationFrame(onAnimationFrame);
        self.vrDisplay.getFrameData(self.frameData);
        // FYI: When rendering a panorama do NOT use view matricies directly!
        // That will make the viewer feel like their head is trapped in a tiny
        // ball, which is usually not the desired effect. Instead, render both
        // eyes from a single viewpoint.
        getPoseMatrix(self.viewMat, self.frameData.pose);
        if (self.vrDisplay.isPresenting) {
          gl.viewport(0, 0, self.webglCanvas.width * 0.5, self.webglCanvas.height);
          self.panorama.render(self.frameData.leftProjectionMatrix, self.viewMat);
          gl.viewport(self.webglCanvas.width * 0.5, 0, self.webglCanvas.width * 0.5, self.webglCanvas.height);
          self.panorama.render(self.frameData.rightProjectionMatrix, self.viewMat);
          self.vrDisplay.submitFrame();
        } else {
          gl.viewport(0, 0, self.webglCanvas.width, self.webglCanvas.height);
          mat4.perspective(self.projectionMat, Math.PI * 0.4, self.webglCanvas.width / self.webglCanvas.height, 0.1, 1024.0);
          self.panorama.render(self.projectionMat, self.viewMat);
          //stats.renderOrtho();
        }
      } else {
        window.requestAnimationFrame(onAnimationFrame);
        // No VRDisplay found.
        gl.viewport(0, 0, self.webglCanvas.width, self.webglCanvas.height);
        mat4.perspective(self.projectionMat, Math.PI * 0.4, self.webglCanvas.width / self.webglCanvas.height, 0.1, 1024.0);
        mat4.identity(self.viewMat);
        self.panorama.render(self.projectionMat, self.viewMat);
        //stats.renderOrtho();
      }
      //stats.end();
    }
  }

  resetPano(asset: string): void {

    this.curAsset = asset;
    this.panorama.setImage(asset);
  }

  onResize() {
    if (this.vrDisplay && this.vrDisplay.isPresenting) {
      var leftEye = this.vrDisplay.getEyeParameters("left");
      var rightEye = this.vrDisplay.getEyeParameters("right");
      this.webglCanvas.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
      this.webglCanvas.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);
    } else {
      this.webglCanvas.width = this.webglCanvas.offsetWidth * window.devicePixelRatio;
      this.webglCanvas.height = this.webglCanvas.offsetHeight * window.devicePixelRatio;
    }
  }

  enterHead() {
    this.vrDisplay.requestPresent([{ source: this.webglCanvas }]).then(function() {}, function() {
      VRSamplesUtil.addError("requestPresent failed.", 2000);
    });
  }

}
