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
    /** Get the info of the game */
    getInfo() { return this.info }
    /** Get the name of the game */
    getName() { return this.info.name }
    /** Get the summary of the game */
    getSummary() { return this.info.summary }
    /** Get the raw numeric rating of the game (out of 5) */
    getRating() { 
        // rating is out of 100 so normalize to 5
        return this.info.rating / 20; 
    }
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
    getScreenshot(index?: number) { 
        if (!this.info.screenshots) return undefined;
        index = index ?? Math.floor(Math.random() * this.info.screenshots.length);
        if (index > this.info.screenshots.length - 1) index = this.info.screenshots.length - 1;
        if (index < 0) index = 0;
        return `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${this.info.screenshots[index].image_id}.png`
    }
    /** Get the platforms the game was released on */
    getScreenshots() { 
        let res: string[] = [];
        this.info.screenshots.forEach(element => {
            res.push(`https://images.igdb.com/igdb/image/upload/t_screenshot_big/${element.image_id}.png`);
        });
        return res;
    }
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
    /** Is the game from this genre? */
    fromPlatform(platform: string) { 
        for (let i = 0; i < this.getPlatforms().length; i++) {
            if (this.getPlatforms()[i] == platform) return true;
        }
        return false;
    }
    /** Get the genres of the game */
    getGenres() { 
        let res: string[] = [];
        this.info.genres?.forEach(element => {
            res.push(element.name);
        });
        return res;
    }
    /** Is the game from this genre? */
    fromGenre(genre: string) { 
        for (let i = 0; i < this.getGenres().length; i++) {
            if (this.getGenres()[i] == genre) return true;
        }
        return false;
    }
    /** Get if the game is in the collection */
    getCollected() { return this.info.collected }
    /** Set if the game is in the collection */
    setCollected(b: boolean) { this.info.collected = b }
     /** Get if the game is in the wishlist */
    getWished() { return this.info.wished }
    /** Set if the game is in the wishlist */
    setWished(b: boolean) { this.info.wished = b }

    static getInfoInList(games: Game[]): GameInfo[] {
        let result: GameInfo[] = [];
        games.forEach(g => {
            result.push(g.info);
        });
        return result;
    }

    static getGenresInList(games: Game[]): Set<string> {
        let result: Set<string> = new Set();
        games.forEach(g => {
            g.getGenres().map((g) => result.add(g));
        });
        return result;
    }

    static getPlatformsInList(games: Game[]): Set<string> {
        let result: Set<string> = new Set();
        games.forEach(g => {
            g.getPlatforms().map((p) => result.add(p));
        });
        return result;
    }

}