class Listener{
    constructor(openMusicService, mailSender) {
        this._openMusicService = openMusicService;
        this._mailSender = mailSender;
        this.listen = this.listen.bind(this);
    }

    async listen(message){
        try{
            const { userId, playlistId, targetEmail } = JSON.parse(message.content.toString());
            const dataPlaylist = await this._openMusicService.getPlaylistById(playlistId, userId);
            const songs = await this._openMusicService.getSongsByPlaylistId(dataPlaylist.id);
            const playlist = { ...dataPlaylist, songs };
            const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlist));
            console.log(result);
        }catch (e) {
            console.log(e);
        }
    }
}

module.exports = Listener;
