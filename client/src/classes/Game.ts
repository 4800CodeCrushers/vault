import { GameInfo } from "../types";
import { Utility } from "../utils";

export default class Game {

    /** The info of the game */
    private info: GameInfo;

    constructor(info: GameInfo) {
        this.info = info;
    }

    /** Get the ID of the game */
    getID() { return this.info.id }
    /** Get the name of the game */
    getName() { return this.info.name }
    /** Get the summary of the game */
    getSummary() { return this.info.summary }
    /** Get the rating of the game */
    getRating() { return this.info.rating }
    /** Get the cover URL of the game */
    getCoverURL() { 
        if (this.info.cover)
            return `https://images.igdb.com/igdb/image/upload/t_cover_big/${this.info.cover.image_id}.png`;
        return undefined; 
    }
    /** Get the cover URL of the game */
    getDevURL() { 
        if (this.info.involved_companies != null && this.info.involved_companies[0].company.logo)
            return `https://images.igdb.com/igdb/image/upload/t_logo_med/${this.info.involved_companies[0].company.logo.image_id}.png`;
        return undefined; 
    }
    /** Get a screenshot URL of the game */
    getScreenshotURL() { return `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${this.info.screenshots[0].image_id}.png`}
    /** Get the release date */
    getReleaseDate() { return Utility.getRelativeDay(this.info.first_release_date) }
    /** Get the platforms the game was released on */
    getPlatforms() { 
        let res: string[] = [];
        this.info.platforms.forEach(element => {
            res.push(element.name);
        });
        return res;
    }
    /** Get the genres of the game */
    getGenres() { 
        let res: string[] = [];
        this.info.genres.forEach(element => {
            res.push(element.name);
        });
        return res;
    }

}