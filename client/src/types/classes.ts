import { PicNames } from "."

export type GameInfo = {
    /** Is the game in the collection? */
    collected: boolean,
    /** Is the game in the wish list? */
    wished: boolean,
    /** The id of the game */
    id: number,
    /** The name of the game */
    name: string,
    /** The summary of the game */
    summary: string,
    /** Release date */
    first_release_date: number,
    /** Rating */
    rating: number,
    /** The cover of the game */
    cover?: {
        image_id: string
    },
    /** The screenshots of the game */
    screenshots: {
        image_id: string
    }[],
    /** The companies involved with the game */
    involved_companies?: {
        company: {
            id: number,
            logo?: {
                image_id: string,
            }
            name: string,
        },
        developer: boolean,
        publisher: boolean
    }[],
    /** The genres of the game */
    genres: {
        name: string
    }[],
    /** The platforms of the game */
    platforms: {
        name: string
    }[]
}

export type UserInfo = {
    /** The id of the user */
    id: number,
    /** The name of the user */
    name: string,
    /** The user's picture */
    picture?: PicNames,
    /** The user's friend code */
    code: string,
    /** The user's color */
    color?: string,
    /** when did the user join */
    joined: number,
}