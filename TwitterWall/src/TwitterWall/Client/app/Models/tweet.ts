import { MediaUrl } from "./MediaUrl";

export class Tweet {

    public Id: number;
    public TweetId: number;
    public Body: string;
    public Handle: string;
    public Date: Date;
    public Name: string;
    public ProfileImage: string;
    public StickyList: string[];
    public MediaList: MediaUrl[];
    public LoadedProfileImage: HTMLImageElement;

    constructor(id: number, tweetid: number, body: string, handle: string, date: Date, name: string, profileImage: string, mediaList: MediaUrl[], stickyList: string[]) {
        this.Id = id;
        this.TweetId = tweetid;
        this.Body = body;
        this.Handle = handle;
        this.Date = date;
        this.Name = name;
        this.ProfileImage = profileImage;
        this.MediaList = mediaList;
        this.StickyList = stickyList;
    }
}
