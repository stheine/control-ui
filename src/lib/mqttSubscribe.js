import _ from 'lodash';

let lastTopics = null;
let onMessage  = null;

export const mqttOnMessage = function(newOnMessage) {
  onMessage = newOnMessage;
};

export const mqttSubscribe = function({mqttClient, topics}) {
  if(!mqttClient) {
    return;
  }

  if(_.isEqual(topics, lastTopics)) {
    return;
  }

  try {
    mqttClient.on('message', async(messageTopic, messageBuffer) => {
      if(!onMessage) {
        return;
      }

      if(!topics.includes(messageTopic)) {
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
      try {
        await mqttClient.subscribeAsync(topics);
      } catch(err) {
        if(!err.message.endsWith('client disconnecting')) {
          throw err;
        }
      }
    })();

    lastTopics = topics;
  } catch(err) {
    // eslint-disable-next-line no-console
    console.log(`Failed to subscribe to '${topics.join(', ')}'`, err.message);
  }

  return async() => {
    try {
      await mqttClient.unsubscribeAsync(topics);
    } catch{
      // / eslint-disable-next-line no-console
      // console.log(`failed unsubscribing from ${topics.join(', ')}`, err.message);
    } finally {
      lastTopics = null;
    }
  };
};
