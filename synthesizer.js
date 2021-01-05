import ScaleMaker  from 'scale-maker';
import * as Tone from 'tone';

//responsible for all things audio
class Synthesizer {
	constructor(){
		this.frequencies = ScaleMaker.makeScale('melodicMinor', 'C3', 20).inHertz;
		this.prevTime = 0;

		//audio data array, {frequency: int representing hertz, length: in seconds volume , volume}
		this.previousAudio = []
		this.currentAudio = []
		this.synth = new Tone.Synth().toDestination();
	}

	resumeAudioContext() {
		Tone.start();
		this.prevTime = this.synth.context.currentTime;
	}

	getPrevTime() {
		return this.prevTime;
	}

	getCurrTime() {
		return this.synth.context.currentTime;
	}

	/*
	sonificationData -- object of structure
		{
			startRow: int, 
			endRow: int,
			red: int (0-255),
			green: int (0-255),
			blue: int (0-255),
			fingerLocation: int (representing row)
		},
		....

		volume = startRow - endRow
		frequency = (startRow - endRow) / 2
		envelope/attack, release = abs(fingerLocation - (startRow - endRow/2))

	returns--
		object with {frequency: int representing hertz, length: in seconds}
	*/
	getNote(sonificationData) {
		const length = ~~(Math.abs(sonificationData.endRow - sonificationData.startRow));
		const center = ~~(length/2 + sonificationData.startRow);
		return {
			volume: length,
			frequency: this.frequencies[center % this.frequencies.length],
			duration: Math.abs(center - sonificationData.fingerLocation)
		}
	}
	

	playAudio(sonificationData) {
		this.previousAudio = this.currentAudio
		this.currentAudio = sonificationData.map(data => this.getNote(data))

		Tone.Transport.cancel(0);
		this.currentAudio.forEach(audioData => {
			this.synth.triggerAttackRelease(audioData.frequency, (audioData.duration % 60) / 60.0)
		})
		this.prevTime = this.getCurrTime()
	}
}

export { Synthesizer as default}