import ScaleMaker  from 'scale-maker';

//responsible for all things audio
class Synthesizer {
	constructor(){
		this.frequencies = ScaleMaker.makeScale('chromatic', 'C3', 100).inHertz;
		this.ctx = new AudioContext();
		this.compressor = this.ctx.createDynamicsCompressor();
		this.compressor.connect(this.ctx.destination);
		this.prevTime = 0;
		this.oscillators = this.frequencies.map((frequency, i) => {
			var osc = this.ctx.createOscillator();
			osc.type = 'sine';
			var gain = this.ctx.createGain();
			gain.connect(this.compressor);
			gain.gain.value = 0.0;
			osc.connect(gain);
			osc.frequency.value = this.frequencies[this.frequencies.length - 1 - i];
			osc.start(this.ctx.currentTime);
			return { osc: osc, gain: gain, val: 0 };
		})
	}

	resumeAudioContext() {
		this.ctx.resume();
		this.prevTime = this.ctx.currentTime;
	}

	getPrevTime() {
		return this.prevTime;
	}

	getCurrTime() {
		return this.ctx.currentTime;
	}

	updateGains(gainVals) {
		for (var i = 0; i < gainVals.length; i++) {
			if (this.oscillators[i].val != gainVals[i]) {
				this.oscillators[i].val = gainVals[i];
				this.oscillators[i].gain.gain.cancelScheduledValues(this.ctx.currentTime);
				this.oscillators[i].gain.gain.linearRampToValueAtTime(gainVals[i], this.ctx.currentTime + 0.1);
			}
		}
		this.prevTime = this.ctx.currentTime;
	}
}

export { Synthesizer as default}