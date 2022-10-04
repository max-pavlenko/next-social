import { Timestamp } from 'firebase/firestore';

export interface IPost {
    content: string
    createdAt: Date | Timestamp
    heartsCount: number
    published: boolean
    slug: string
    title: string
    uid: string
    updatedAt: Date | Timestamp
    username: string,
    userPath: string,
}
