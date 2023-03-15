export const newConnectionHandler = (newClient) => {
  console.log("NEW CONNECTION: ", newClient.id);
  // 1. We emit a welcome event to the client to make sure connection is on
  newClient.emit("welcome", {
    message: `Welcome to Bamboo Bites shared order!, ${newClient.id}`,
  });

  // 3. Listen to sendMessage to handle the new message(data) that is sent by the client
  newClient.on("sendMessage", (message) => {
    console.log("NEW MESSAGE: ", message);
    newClient.broadcast.emit("newMessage", message);
  });
};
