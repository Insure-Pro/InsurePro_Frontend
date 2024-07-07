class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lowercase = message.toLowerCase();

    if (lowercase.includes("hello")) {
      this.actionProvider.handleHello();
    }
    // 추가적인 메시지 파싱 로직
  }
}

export default MessageParser;
