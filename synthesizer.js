import ScaleMaker  from 'scale-maker';
import * as Tone from 'tone';

//responsible for all things audio
class Synthesizer {
	constructor(){
		this.prevTime = 0;

		this.frequencies = ScaleMaker.makeScale('melodicMinor', 'C3', window.innerHeight).inHertz;


		//audio data array, {frequency: int representing hertz, length: in seconds volume , volume}
		this.previousAudio = []
		this.currentAudio = []
		this.synth = new Tone.Synth().toDestination();
		this.plucky = new Tone.PluckSynth().toDestination();

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
	getNote(sonificationData, totalFeatureLength) {
		const length = ~~(Math.abs(sonificationData.endRow - sonificationData.startRow));
		const center = ~~(length/2 + sonificationData.startRow);
		const height = window.innerHeight;
		return {
			volume: length,
			frequency: this.frequencies[~~(window.innerHeight/(totalFeatureLength/length))],
			duration: (length/height).toFixed(5)
		}
	}
	

	playAudio(sonificationData) {
		this.previousAudio = this.currentAudio
		const reducer = (accumulator, currentValue) => accumulator + currentValue;
		const totalFeatureLength = sonificationData.map(data => ~~(Math.abs(data.endRow - data.startRow))).reduce(reducer)
		this.currentAudio = sonificationData.map(data => this.getNote(data, totalFeatureLength))

		Tone.Transport.cancel(0);
		this.currentAudio.forEach(audioData => {
			console.log("duration: " + audioData.duration)
			console.log("frequency: " + audioData.frequency)
			
			if(audioData.duration > 0 && audioData.frequency) {
				this.synth.triggerAttackRelease(audioData.frequency, audioData.duration)
			}
		})
		this.prevTime = this.getCurrTime()
	}
}

export { Synthesizer as default}