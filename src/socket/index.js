export const newConnectionHandler = (newClient) => {
  console.log("NEW CONNECTION: ", newClient.id);
  // 1. We emit a welcome event to the client to make sure connection is on
  newClient.emit("connected", {
    message: `Welcome to Bamboo Bites shared order!, ${newClient.id}`,
  });

  // 2. Listen to sendMessage to handle the new message(data) that is sent by the client
  newClient.on("sendMessage", (message) => {
    console.log("NEW MESSAGE: ", message);
    newClient.broadcast.emit("newMessage", message);
  });

  //3. Listen to when an user disconnects from shared order screen
  newClient.on("disconnectMe", (message) => {
    console.log("Disconnected this user: ", message);
    newClient.broadcast.emit("disconnectUser", message);
  });
  newClient.on("waitingScreen", (message) => {
    console.log("Waiting screen obj: ", message);
    newClient.broadcast.emit("waitingScreen", message);
  });
};
