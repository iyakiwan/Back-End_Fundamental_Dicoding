require('dotenv').config();
const amqp = require('amqplib');
const PlayListsService = require('./PlayListsService');
const MailSender = require('./MailSender');
const Listener = require('./Listener');

const init = async () => {
  const playListsService = new PlayListsService();
  const mailSender = new MailSender();
  const listener = new Listener(playListsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlists', {
    durable: true,
  });

  channel.consume('export:playlists', listener.listen, { noAck: true });
};

init();
