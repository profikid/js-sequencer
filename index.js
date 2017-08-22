const SAMPLE_FOLDER = "samples/";

const program = {
    "kick.wav": ["0000","1000","1000","1111"],
    "oh.wav":   ["0000","0010","1111","1111"],
    "ch.wav":   ["0000","1010","0010","1111"],
    "tom.wav":  ["0000","1010","0001","1111"],
    "snare.wav":["0000","1001","00001000","1000"],
    "clap.wav": ["0000","01010100","00010100","11011111"]
}

console.log(program)

class Clock{
    constructor(sequencer){
        this.tempo = 60 * 260 / 130;
        this.isPlaying = false;
        this.sequencer = sequencer;
        this.loop();
    }

    loop(){
        setInterval(()=>{
            if(this.isPlaying){
                this.sequencer.next();
            }
        }, this.tempo)
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
        this.program = {};
        this.samples = [];
        this.currentStepIndex = 0;
        this.pattern = 1;
    }

    load(program){
        this.program = program;
        this.loadPattern(this.pattern);
    }

    loadPattern(pattern){
        this.pattern = pattern;
        this.samples = [];
        for (var layer in this.program) {
            if (this.program.hasOwnProperty(layer)) {
                this.loadLayer(layer,this.pattern);
            }
        }
    }

    loadLayer(sampleFileName, pattern){
        this.samples.push(new Pattern(sampleFileName,this.program[sampleFileName][pattern]));
    }

    next(){
        this.currentStepIndex++;
        this.samples.forEach(x=>x.next());
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
