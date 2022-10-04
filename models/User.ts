export interface FirebaseUser{
   displayName?: string | null,
   photoURL: string,
   username?: string,
   favoriteQuoteData?: FavoriteQuoteData
}

export type FavoriteQuoteData = {
   _id: string,
   author: string
   text: string
}
