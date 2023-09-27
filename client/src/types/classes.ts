export type GameInfo = {
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
