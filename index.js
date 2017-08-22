const SAMPLE_FOLDER = "samples/";

const program = {
    "kick.wav": "1000",
    "oh.wav":   "0010",
    "ch.wav":   "1",
    "tom.wav":  "10",
    "snare.wav":"00001000",
    "clap.wav": "00010100"
}

class Clock{
    constructor(sequencer){
        this.tempo = 128;
        this.isPlaying = false;
        this.sequencer = sequencer;
        this.loop();
    }

    loop(){
        setInterval(()=>{
            if(this.isPlaying){
                this.sequencer.next();
            }
        }, this.calculateInterval())
    }

    calculateInterval(){
        return 60 * 260 / this.tempo;
    }

    start(){
        this.isPlaying = true;
    }

    stop(){
        this.isPlaying = false;
    }
}

class Sequencer{
    constructor(){
        this.patterns = [];
        this.currentStepIndex = 0;
    }

    load(program){
        for (var key in program) {
            if (program.hasOwnProperty(key)) {
                this.patterns.push(new Pattern(key,program[key]));
            }
        }
    }

    next(){
        this.currentStepIndex++;
        this.patterns.forEach(x=>x.next());
    }
}

class Pattern{
    constructor(layer, stepString){
        this.mute = false;
        this.layer = layer;
        this.stepString = stepString;
        this.stepAmount = stepString.length;
        this.currentStepIndex = 0;
        this.steps = [];
        this.setupSteps();
        this.currentStep = this.steps[0];
    }

    setupSteps(){
        for (var i = 0; i < this.stepAmount; i++) {
            this.steps.push(new Step(SAMPLE_FOLDER + this.layer, this.stepString[i]));
        }
    }

    next(){
        if(!this.mute){
            this.currentStep.play();
        }
        this.currentStepIndex++;
        this.currentStep = this.steps[this.currentStepIndex % this.stepAmount];
    }
}

class Step{
    constructor(sample,playNote){
        this.playNote = playNote;
        this.sample = sample;
    }

    play(){
        if(this.playNote == "1"){
           new Audio(this.sample).play();
        }
    }
}

seq = new Sequencer();
seq.load(program);
clock = new Clock(seq);
