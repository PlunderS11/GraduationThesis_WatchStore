import OneSignal from 'react-onesignal';

export default async function runOneSignal() {
    await OneSignal.init({
        appId: process.env.REACT_APP_ONESIGNAL_ID,
        autoResubscribe: false,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
            enable: true /* Required to use the Subscription Bell */,
        },
    });
    OneSignal.registerForPushNotifications();
    OneSignal.showSlidedownPrompt().then(() => {
        OneSignal.isPushNotificationsEnabled(isPushEnabled => {
            if (isPushEnabled) {
                OneSignal.getUserId(userId => {
                    localStorage.setItem('oneSignalId', userId);
                });
            }
        });
    });
}
