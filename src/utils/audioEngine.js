// Advanced audio engine with crossfade, gapless playback, and audio effects

export class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.currentTrack = null;
    this.nextTrack = null;
    this.gainNode = null;
    this.nextGainNode = null;
    this.analyserNode = null;
    this.equalizerNodes = [];
    this.crossfadeDuration = 3; // seconds
    this.isInitialized = false;
    this.volume = 0.7;
    this.isCrossfading = false;
    this.preloadBuffer = null;
  }

  // Initialize Web Audio API
  async initialize() {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create main gain node
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = this.volume;
      
      // Create analyser for visualizations
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;
      
      // Create equalizer nodes (10-band)
      this.createEqualizer();
      
      // Connect nodes
      this.gainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioContext.destination);
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      throw error;
    }
  }

  // Create 10-band equalizer
  createEqualizer() {
    const frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
    
    this.equalizerNodes = frequencies.map(frequency => {
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = frequency;
      filter.Q.value = 1;
      filter.gain.value = 0;
      return filter;
    });

    // Connect equalizer nodes in series
    for (let i = 0; i < this.equalizerNodes.length - 1; i++) {
      this.equalizerNodes[i].connect(this.equalizerNodes[i + 1]);
    }
    
    // Connect last EQ node to gain
    if (this.equalizerNodes.length > 0) {
      this.equalizerNodes[this.equalizerNodes.length - 1].connect(this.gainNode);
    }
  }

  // Load and decode audio file
  async loadAudioBuffer(url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      return audioBuffer;
    } catch (error) {
      console.error('Failed to load audio:', error);
      throw error;
    }
  }

  // Create audio source from buffer
  createSource(audioBuffer) {
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    return source;
  }

  // Play track with optional crossfade
  async playTrack(url, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const {
      crossfade = false,
      startTime = 0,
      preload = false
    } = options;

    try {
      const audioBuffer = await this.loadAudioBuffer(url);
      
      if (preload) {
        this.preloadBuffer = audioBuffer;
        return;
      }

      if (crossfade && this.currentTrack) {
        await this.crossfadeToTrack(audioBuffer, startTime);
      } else {
        await this.playDirectly(audioBuffer, startTime);
      }
    } catch (error) {
      console.error('Failed to play track:', error);
      throw error;
    }
  }

  // Play track directly (no crossfade)
  async playDirectly(audioBuffer, startTime = 0) {
    // Stop current track
    if (this.currentTrack) {
      this.currentTrack.stop();
    }

    // Create new source
    this.currentTrack = this.createSource(audioBuffer);
    
    // Connect to equalizer or gain node
    if (this.equalizerNodes.length > 0) {
      this.currentTrack.connect(this.equalizerNodes[0]);
    } else {
      this.currentTrack.connect(this.gainNode);
    }

    // Start playback
    this.currentTrack.start(0, startTime);
    
    return this.currentTrack;
  }

  // Crossfade between tracks
  async crossfadeToTrack(audioBuffer, startTime = 0) {
    if (this.isCrossfading) return;
    
    this.isCrossfading = true;

    // Create next track
    this.nextTrack = this.createSource(audioBuffer);
    this.nextGainNode = this.audioContext.createGain();
    this.nextGainNode.gain.value = 0; // Start silent
    
    // Connect next track
    this.nextTrack.connect(this.nextGainNode);
    if (this.equalizerNodes.length > 0) {
      this.nextGainNode.connect(this.equalizerNodes[0]);
    } else {
      this.nextGainNode.connect(this.gainNode);
    }

    // Start next track
    this.nextTrack.start(0, startTime);

    // Crossfade animation
    const fadeSteps = 60; // 60 steps for smooth fade
    const stepDuration = (this.crossfadeDuration * 1000) / fadeSteps;
    
    for (let i = 0; i <= fadeSteps; i++) {
      setTimeout(() => {
        const progress = i / fadeSteps;
        
        // Fade out current track
        if (this.currentTrack && this.gainNode) {
          this.gainNode.gain.value = this.volume * (1 - progress);
        }
        
        // Fade in next track
        if (this.nextGainNode) {
          this.nextGainNode.gain.value = this.volume * progress;
        }
        
        // Complete crossfade
        if (i === fadeSteps) {
          if (this.currentTrack) {
            this.currentTrack.stop();
          }
          
          this.currentTrack = this.nextTrack;
          this.gainNode.gain.value = this.volume;
          this.nextTrack = null;
          this.nextGainNode = null;
          this.isCrossfading = false;
        }
      }, i * stepDuration);
    }
  }

  // Set master volume
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }

  // Set equalizer band
  setEqualizerBand(bandIndex, gain) {
    if (this.equalizerNodes[bandIndex]) {
      this.equalizerNodes[bandIndex].gain.value = gain;
    }
  }

  // Set all equalizer bands
  setEqualizerPreset(gains) {
    gains.forEach((gain, index) => {
      this.setEqualizerBand(index, gain);
    });
  }

  // Get frequency data for visualizer
  getFrequencyData() {
    if (!this.analyserNode) return new Uint8Array(0);
    
    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }

  // Get time domain data for waveform
  getTimeDomainData() {
    if (!this.analyserNode) return new Uint8Array(0);
    
    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyserNode.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  // Pause current track
  pause() {
    if (this.currentTrack) {
      this.audioContext.suspend();
    }
  }

  // Resume current track
  resume() {
    if (this.currentTrack && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Stop current track
  stop() {
    if (this.currentTrack) {
      this.currentTrack.stop();
      this.currentTrack = null;
    }
    if (this.nextTrack) {
      this.nextTrack.stop();
      this.nextTrack = null;
    }
  }

  // Set crossfade duration
  setCrossfadeDuration(duration) {
    this.crossfadeDuration = Math.max(0.5, Math.min(10, duration));
  }

  // Apply audio effects
  applyEffect(effectType, params = {}) {
    switch (effectType) {
      case 'reverb':
        this.applyReverb(params);
        break;
      case 'delay':
        this.applyDelay(params);
        break;
      case 'distortion':
        this.applyDistortion(params);
        break;
      case 'compressor':
        this.applyCompressor(params);
        break;
    }
  }

  // Apply reverb effect
  applyReverb(params = {}) {
    const { roomSize = 0.5, dampening = 0.5, wetness = 0.3 } = params;
    
    const convolver = this.audioContext.createConvolver();
    const impulseBuffer = this.createReverbImpulse(roomSize, dampening);
    convolver.buffer = impulseBuffer;
    
    const wetGain = this.audioContext.createGain();
    const dryGain = this.audioContext.createGain();
    
    wetGain.gain.value = wetness;
    dryGain.gain.value = 1 - wetness;
    
    // Reconnect audio graph with reverb
    if (this.currentTrack) {
      this.currentTrack.disconnect();
      this.currentTrack.connect(dryGain);
      this.currentTrack.connect(convolver);
      convolver.connect(wetGain);
      
      const merger = this.audioContext.createChannelMerger(2);
      dryGain.connect(merger);
      wetGain.connect(merger);
      merger.connect(this.gainNode);
    }
  }

  // Create reverb impulse response
  createReverbImpulse(roomSize, dampening) {
    const length = this.audioContext.sampleRate * roomSize;
    const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - (i / length), dampening);
        channelData[i] = (Math.random() * 2 - 1) * decay;
      }
    }
    
    return impulse;
  }

  // Apply delay effect
  applyDelay(params = {}) {
    const { delayTime = 0.3, feedback = 0.4, wetness = 0.3 } = params;
    
    const delay = this.audioContext.createDelay(1);
    const feedbackGain = this.audioContext.createGain();
    const wetGain = this.audioContext.createGain();
    const dryGain = this.audioContext.createGain();
    
    delay.delayTime.value = delayTime;
    feedbackGain.gain.value = feedback;
    wetGain.gain.value = wetness;
    dryGain.gain.value = 1 - wetness;
    
    // Connect delay nodes
    if (this.currentTrack) {
      this.currentTrack.disconnect();
      this.currentTrack.connect(dryGain);
      this.currentTrack.connect(delay);
      delay.connect(feedbackGain);
      feedbackGain.connect(delay);
      delay.connect(wetGain);
      
      const merger = this.audioContext.createChannelMerger(2);
      dryGain.connect(merger);
      wetGain.connect(merger);
      merger.connect(this.gainNode);
    }
  }

  // Apply compressor
  applyCompressor(params = {}) {
    const {
      threshold = -24,
      knee = 30,
      ratio = 12,
      attack = 0.003,
      release = 0.25
    } = params;
    
    const compressor = this.audioContext.createDynamicsCompressor();
    compressor.threshold.value = threshold;
    compressor.knee.value = knee;
    compressor.ratio.value = ratio;
    compressor.attack.value = attack;
    compressor.release.value = release;
    
    if (this.currentTrack) {
      this.currentTrack.disconnect();
      this.currentTrack.connect(compressor);
      compressor.connect(this.gainNode);
    }
  }

  // Get current audio context time
  getCurrentTime() {
    return this.audioContext ? this.audioContext.currentTime : 0;
  }

  // Cleanup
  destroy() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.isInitialized = false;
  }
}

// Create singleton instance
export const audioEngine = new AudioEngine();
