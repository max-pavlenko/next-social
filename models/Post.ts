import { Timestamp } from 'firebase/firestore';
import { AdditionalImageData } from '../components/Forms/PostFormEdit';

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
    additionalImages: AdditionalImageData[],
}
