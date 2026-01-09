import { defineStore } from 'pinia';
const useMessageStore = defineStore('message', {
    state: () => ({
        content: "",
        icon: ""
    }),
    getters: {
        getContent: (state) => state.content,
        getIcon: (state) => state.icon,
    },
    actions: {
        setContent(content: string) {
            this.content = content;
        },
        setIcon(icon: string) {
            this.icon = icon;
        },
    }
});
export default useMessageStore;