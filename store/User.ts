import { makeAutoObservable } from 'mobx';
import { FALLBACK_IMAGE } from '../utils/constants';

export interface IUser {
    data: IDataUser | null,
    username: string,
}

class User {
    user: IUser = {data: null, username: ''}
    photoURL: string = '';

    constructor() {
        makeAutoObservable(this)
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setPhotoURL(url: string){
        console.log('setPhotoURL', url)
        this.photoURL = url || FALLBACK_IMAGE;
    }
}

export default new User()

export interface IDataUser {
    displayName: string
    email: string
    emailVerified: boolean
    isAnonymous: boolean
    metadata: UserMetadata
    createdAt: number
    creationTime: Date
    lastLoginAt: number
    lastSignInTime: Date
    phoneNumber: null | number | string
    photoURL: string
    providerId: string
    refreshToken: string
    tenantId: null | string
    uid: string,
    favoriteQuoteData:IQuoteData,
    _delegate: any//UserImpl
}

export interface IQuoteData{
    text: string,
    _id: string,
    author: string,
}

export interface UserMetadata {
    createdAt: number
    creationTime: Date
    lastLoginAt: number
    lastSignInTime: Date
}
