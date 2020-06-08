export const sendPushNotification = async (_topic, _notification) => {
  const FIREBASE_API_KEY =
    'AAAAQRY_7i8:APA91bHBywSx6u8hOSEmoosuhYqbOIPgoKo-h3r1lze6uCL6TCx2h0cerZuPBrQBPBLgEzhXkRfhN3APjnpF7qC9Vx6SgDAz2I_vL2Tg0c6Yxc7cYRa3EJDCHESLWOUUmG9y2jGIYM00';
  const message = {
    to: _topic,
    notification: _notification,
  };

  let headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: 'key=' + FIREBASE_API_KEY,
  });

  let response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers,
    body: JSON.stringify(message),
  });
  response = await response.json();
  console.log(response);
};
