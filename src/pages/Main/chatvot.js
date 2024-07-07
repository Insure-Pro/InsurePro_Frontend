import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "./config.js";
import MessageParser from "./MessageParser.js";
import ActionProvider from "./ActionProvider.jsx";
import "./chatbot.css";

const MyChatBot = () => {
  return (
    <div class="chatbot-container">
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
};
export default MyChatBot;
