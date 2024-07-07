import React from "react";

const BotAvatar = () => {
  const add_icon = process.env.PUBLIC_URL + "/folder-add.png";

  return (
    <img
      src={add_icon}
      alt="Bot Avatar"
      style={{ width: "50px", height: "50px" }}
    />
  );
};

export default BotAvatar;
