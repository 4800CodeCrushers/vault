export type GameInfo = {
    /** The id of the game */
    id: number,
    /** The name of the game */
    name: string,
    /** The summary of the game */
    summary: string,
    /** Release data */
    first_release_date: number,
    /** The cover of the game */
    cover: {
        image_id: string
    },
    /** The url of the game */
    url: string,
    /** The developers of the game */
    involved_companies: {
        company: {
            id: number,
            logo?: {
                id: number,
                url: string,
            }
            name: string,
            
        },
        developer: boolean
    }[]
}



