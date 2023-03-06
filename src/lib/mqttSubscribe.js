import delay from 'delay';
import ms    from 'ms';

export default function mqttSubscribe({mqttClient, topic, topics, onMessage}) {
  if(!mqttClient) {
    return;
  }

  const subscribeTopics = topics || [topic];

  try {
    mqttClient.on('message', async(messageTopic, messageBuffer) => {
      if(!subscribeTopics.includes(messageTopic)) {
        return;
      }

      const messageRaw = messageBuffer.toString();

      try {
        const message = JSON.parse(messageRaw);

        onMessage({topic: messageTopic, message});
      } catch{
        onMessage({topic: messageTopic, message: messageRaw});
      }
    });

    (async() => {
      let subscribed = false;

      do {
        try {
          await mqttClient.subscribe(subscribeTopics);

          subscribed = true;
        } catch(err) {
          if(!err.message.endsWith('client disconnecting')) {
            throw err;
          }

          // eslint-disable-next-line no-console
          console.log(`subscribe retry for ${subscribeTopics.join(', ')}`);

          await delay(ms('1s'));
        }
      } while(!subscribed);
    })();

    // console.log(`subscribed to ${subscribeTopics.join(', ')}`);
  } catch(err) {
    // eslint-disable-next-line no-console
    console.log(`Failed to subscribe to '${subscribeTopics.join(', ')}'`, err.message);
  }

  return async() => {
    // console.log(`unsubscribing from ${subscribeTopics.join(', ')}`);
    try {
      await mqttClient.unsubscribe(subscribeTopics);
      // console.log(`unsubscribed from ${subscribeTopics.join(', ')}`);
    } catch{ // (err) {
      // / eslint-disable-next-line no-console
      // console.log(`failed unsubscribing from ${subscribeTopics.join(', ')}`, err.message);
    }
  };
}
