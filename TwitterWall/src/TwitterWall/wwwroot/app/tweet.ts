export class Tweet {

    public Id: number;
    public TweetId: number;
    private Body: string;
    private Handle: string;
    private Date: Date;
    private Name: string;
    public ProfileImage: string;
    public LoadedProfileImage: HTMLImageElement;

    constructor(id: number, tweetid: number, body: string, handle: string, date: Date, name: string, profileImage: string) {
        this.Id = id;
        this.TweetId = tweetid;
        this.Body = body;
        this.Handle = handle;
        this.Date = date;
        this.Name = name;
        this.ProfileImage = profileImage;
    }

}
