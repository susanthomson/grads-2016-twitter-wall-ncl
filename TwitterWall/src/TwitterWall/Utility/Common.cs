namespace TwitterWall.Utility
{
    public static class Common
    {
        public static readonly long BRISTECH = 1600909274;

        public enum SubType
        {
            TRACK,
            PERSON
        }

        public static readonly string BanType = "BANNED";

        public enum TweetAction
        {
            ADD,
            REMOVE
        }
    }
}