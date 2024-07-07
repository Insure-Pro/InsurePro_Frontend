import React from "react";

class ActionProvider {
  constructor(createChatBotMessage, setState, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setState;
    this.createClientMessage = createClientMessage;
  }

  handleOption = (option) => {
    const message = this.createChatBotMessage(`You selected ${option}`);
    this.setChatbotMessage(message);
  };

  setChatbotMessage = (message) => {
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };
}

export default ActionProvider;
