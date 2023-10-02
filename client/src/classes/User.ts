import { PicNames, UserInfo } from "../types";
import { Utility } from "../utils";

export default class User {

    /** A reference to the logged in user */
    public static me: User | null;
    /** The info of the user */
    private info: UserInfo;

    constructor(info: UserInfo) {
        this.info = info;
    }

    /** Get the ID of the user */
    getID() { return this.info.user_id }
    /** Get the user's code */
    getCode() { return this.info.code }
    /** Get the user's picture */
    getPicture() { return this.info.picture }
    /** Set the user's picture */
    setPicture(pic: PicNames) { return this.info.picture = pic }
    /** Get the user's color */
    getColor() { return this.info.color }
    /** Set the user's color */
    setColor(color: string) { return this.info.color = color }
    /** Get the name of the user */
    getName() { return this.info.name }
    /** Set the name of the user */
    setName(name: string) { return this.info.name = name }
    /** Get the release date */
    getJoinedDate() { return Utility.getRelativeDay(this.info.joined) }
}