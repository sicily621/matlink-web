import { provide } from 'vue';

export enum PublisherKeys {
    Main = "main",
}

export enum MemberKeys {
    Menu = "menu"
}

interface PublisherParams {
    members: any;
    setMember: Function;
    getMember: Function;
    delMember: Function;
}

const publisher: PublisherParams = {
    members: {},
    setMember(key: MemberKeys, value: any) {
        publisher.members[key] = value;
    },
    getMember(key: string) {
        return publisher.members[key];
    },
    delMember(key: string) {
        delete publisher.members[key];
    }
}
export const setupPublisher = () => {
    provide(PublisherKeys.Main, publisher);
}
