const Request = require("request-promise");
const { chunk } = require("lodash");

class OneSignalUtil {
    static async pushNotification({
        heading,
        content,
        oneSignalPlayerIds,
        data,
        pathUrl = "/",
    }) {
        const appId = process.env.APPID;
        const callbackUrl = process.env.CALLBACKURL;
        const restApiKey = process.env.RECTAPIKEY;

        const chunkArray = chunk(oneSignalPlayerIds, 1000);
        for (const itemChunk of chunkArray) {
            const response = await Request({
                method: "POST",
                uri: "https://onesignal.com/api/v1/notifications",
                headers: {
                    Authorization: `Basic ${restApiKey}`,
                },
                body: {
                    app_id: appId,
                    contents: { en: content },
                    headings: { en: heading },
                    include_player_ids: itemChunk,
                    url: callbackUrl + pathUrl,
                    data,
                },
                json: true,
            });

            console.log("one signal response", response);
        }
    }

    static async pushNotificationAll({
        content,
        heading,
        url,
        data,
        userType = "admin",
    }) {
        try {
            const { appId, callbackUrl, restApiKey } = this.getConfig(userType);

            const response = await Request({
                method: "POST",
                uri: "https://onesignal.com/api/v1/notifications",
                headers: {
                    Authorization: `Basic ${restApiKey}`,
                },
                body: {
                    app_id: appId,
                    contents: { en: content },
                    headings: { en: heading },
                    included_segments: ["All"],
                    url: callbackUrl + url,
                    data,
                },
                json: true,
            });
        } catch (error) {}
    }
}
module.exports = OneSignalUtil;
