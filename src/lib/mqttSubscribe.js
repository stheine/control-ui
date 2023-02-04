export default function mqttSubscribe({mqttClient, topic, setMessage}) {
  if(!mqttClient) {
    return;
  }

  try {
    mqttClient.on('message', async(messageTopic, messageBuffer) => {
      if(messageTopic !== topic) {
        return;
      }

      const messageRaw = messageBuffer.toString();
      const message = JSON.parse(messageRaw);

      setMessage(message);
    });

    mqttClient.subscribe(topic);
  } catch(err) {
    // eslint-disable-next-line no-console
    console.log(`Failed to subscribe to '${topic}'`, err.message);
  }

  return async() => {
    await mqttClient.unsubscribe(topic);
  };
}
