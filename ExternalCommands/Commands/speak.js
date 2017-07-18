module.exports = {
	info: "Use Text-to-speech locally.",
	usage: "<text>...",
	func: args => {
		let text = args.slice(1).join(" ");
		var speech = new SpeechSynthesisUtterance(text);
		var voices = window.speechSynthesis.getVoices();

		speech.volume = 1;
		speech.rate   = 1;
		speech.pitch  = 1;
		speech.voice  = window.speechSynthesis.getVoices()[0];

		window.speechSynthesis.speak(speech);
	}
};