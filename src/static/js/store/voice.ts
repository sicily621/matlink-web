import { defineStore } from 'pinia';
const useVoiceStore = defineStore('voice', {
    state: () => ({
        canSpeak: true,
        canSpeakMenu: true,
        isPlaying: false,
        currentText: "",
        settings: {
            lang: "zh-CN",
            rate: 1,
            pitch: 1,
            volume: 1,
            voice: speechSynthesis.getVoices()[0]
        },
    }),
    getters: {
        getCanSpeak: (state) => state.canSpeak,
        getCanSpeakMenu: (state) => state.canSpeakMenu,
    },
    actions: {

        play(text: string) {
            if (!this.canSpeak) return
            if (this.isPlaying) {
                window.speechSynthesis.cancel();
            }

            this.currentText = text;
            this.isPlaying = true;
            const utterance = new SpeechSynthesisUtterance(this.currentText);
            const { lang, rate, pitch, volume, voice } = this.settings;
            utterance.lang = lang;
            utterance.rate = rate;
            utterance.pitch = pitch;
            utterance.volume = volume;
            utterance.voice = voice;
            utterance.onend = () => {
                this.isPlaying = false;
            };
            window.speechSynthesis.speak(utterance);
        },
        stop() {
            window.speechSynthesis.cancel();
            this.isPlaying = false;
        },
        setCanSpeak(value: boolean) {
            this.canSpeak = value;
        },
        setCanSpeakMenu(value: boolean) {
            this.canSpeakMenu = value;
        }
    }
});
export default useVoiceStore;