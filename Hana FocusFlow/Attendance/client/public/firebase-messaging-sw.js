importScripts('https://www.gstatic.com/firebasejs/9.x/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.x/firebase-messaging-compat.js');
firebase.initializeApp({/* same config */});
const messaging = firebase.messaging();
messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
