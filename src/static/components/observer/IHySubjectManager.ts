// 假设您已经定义了 IHySubject 和具体的观察者实体类
import IHyTopic from "./IHyTopic";
import { IHySubject } from './IHySubject';

// 定义一个泛型函数创建主题管理器
export class IHySubjectManager {

    private static subjectManager: IHySubjectManager | null = null;
    private subjectMap: Map<string, IHySubject<IHyTopic, Object>> = new Map();

    private constructor() {

    }

    public static getInstance() {
        if (!IHySubjectManager.subjectManager) {
            IHySubjectManager.subjectManager = new IHySubjectManager();

        }
        return IHySubjectManager.subjectManager;
    }

    public addSubject(subject: IHySubject<IHyTopic, Object>): void {
        const key = subject.getTopic().getKey();
        if (subject && !this.subjectMap.has(key)) {
            this.subjectMap.set(key, subject);
        }
    }

    public removeSubject(key: string): void {
        if (this.subjectMap.has(key)) {
            this.subjectMap.delete(key);
        }
    }
    public getAllSubjects(): Array<IHySubject<IHyTopic, Object>> | undefined {
        return Array.from(this.subjectMap.values());
    }

    public getSubjectByTopicKey(topicKey: string): IHySubject<IHyTopic, Object> | undefined {
        return this.subjectMap.get(topicKey);
    }
}