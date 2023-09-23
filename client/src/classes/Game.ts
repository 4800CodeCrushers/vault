import { GameInfo } from "../types/classes";
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
    /** Get the cover URL of the game */
    getCoverURL() { return `https://images.igdb.com/igdb/image/upload/t_cover_big/${this.info.cover.image_id}.png` }
    /** Get a screenshot URL of the game */
    getScreenshotURL() { 
        let ran = Math.floor(Math.random() * this.info.screenshots.length);
        return `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${this.info.screenshots[ran].image_id}.png` 
    }
    /** Get the release date */
    getReleaseDate() { return Utility.getRelativeDay(this.info.first_release_date) }

}