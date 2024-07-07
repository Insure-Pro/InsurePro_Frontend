import { createChatBotMessage } from "react-chatbot-kit";
import ActionProvider from "./ActionProvider";
import Options from "./Option"; // 수정된 경로

const config = {
  botName: "MyBot",
  initialMessages: [
    createChatBotMessage("Choose an option:", {
      widget: "optionsWidget",
    }),
  ],
  widgets: [
    {
      widgetName: "optionsWidget",
      widgetFunc: (props) => <Options {...props} />,
      props: {
        options: [
          {
            text: "가",
            handler: (props) => props.actionProvider.handleOption("가"),
            id: 1,
          },
          {
            text: "나",
            handler: (props) => props.actionProvider.handleOption("나"),
            id: 2,
          },
          {
            text: "다",
            handler: (props) => props.actionProvider.handleOption("다"),
            id: 3,
          },
          {
            text: "라",
            handler: (props) => props.actionProvider.handleOption("라"),
            id: 4,
          },
        ],
      },
    },
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
    },
    chatButton: {
      backgroundColor: "#5ccc9d",
    },
  },
};

export default config;
