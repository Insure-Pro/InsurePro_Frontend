import React, { useEffect, useState } from "react";

const KakaoLogin = () => {
  const [isLoggedIn2, setIsLoggedIn2] = useState(false);

  useEffect(() => {
    // Kakao SDK 초기화
    window.Kakao.init("c089c8172def97eb00c07217cae17495");
    // 로그인 상태 확인
    displayToken();
  }, []);

  const loginWithKakao = () => {
    window.Kakao.Auth.authorize({
      redirectUri: "https://developers.kakao.com/tool/demo/oauth",
      state: "sendme_feed",
      scope: "talk_message",
    });
  };

  //   useEffect(() => {
  //     // Kakao SDK 초기화
  //     window.Kakao.init("5f312e942c7a1fa1133c655d80e8230e");
  //     // 로그인 상태 확인
  //     displayToken();
  //   }, []);

  //   const loginWithKakao = () => {
  //     window.Kakao.Auth.authorize({
  //       redirectUri: "http://localhost:3000/kakaotalk",
  //       state: "sendme_feed",
  //       scope: "talk_message",
  //     });
  //   };

  const sendToMe = () => {
    window.Kakao.API.request({
      url: "/v2/api/talk/memo/default/send",
      data: {
        template_object: {
          object_type: "feed",
          content: {
            title: "딸기 치즈 케익",
            description: "#케익 #딸기 #삼평동 #카페 #분위기 #소개팅",
            image_url:
              "http://k.kakaocdn.net/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png",
            link: {
              mobile_web_url: "https://developers.kakao.com",
              web_url: "https://developers.kakao.com",
            },
          },
          social: {
            like_count: 286,
            comment_count: 45,
            shared_count: 845,
          },
          buttons: [
            {
              title: "웹으로 보기",
              link: {
                mobile_web_url: "https://developers.kakao.com",
                web_url: "https://developers.kakao.com",
              },
            },
            {
              title: "앱으로 보기",
              link: {
                mobile_web_url: "https://developers.kakao.com",
                web_url: "https://developers.kakao.com",
              },
            },
          ],
        },
      },
    })
      .then((res) => alert("success: " + JSON.stringify(res)))
      .catch((err) => alert("error: " + JSON.stringify(err)));
  };

  const sendToFriends = () => {
    if (!window.confirm("메시지를 전송하시겠습니까?")) return;

    window.Kakao.Picker.selectFriends({
      showMyProfile: false,
      maxPickableCount: 10,
      minPickableCount: 1,
    })
      .then(function (res) {
        const uuids = res.users.map((user) => user.uuid);
        return window.Kakao.API.request({
          url: "/v1/api/talk/friends/message/default/send",
          data: {
            receiver_uuids: uuids,
            template_object: {
              object_type: "feed",
              content: {
                title: "베리베리 치즈 케익",
                description:
                  "#케익 #딸기 #블루베리 #카페 #디저트 #달달함 #분위기 #삼평동",
                image_url:
                  "http://k.kakaocdn.net/dn/bDgfik/btqwQWk4CRU/P6wNJJiQ3Ko21KNE1TiLw1/kakaolink40_original.png",
                link: {
                  mobile_web_url: "https://developers.kakao.com",
                  web_url: "https://developers.kakao.com",
                },
              },
              social: {
                like_count: 286,
                comment_count: 45,
                shared_count: 845,
              },
              buttons: [
                {
                  title: "웹으로 보기",
                  link: {
                    mobile_web_url: "https://developers.kakao.com",
                    web_url: "https://developers.kakao.com",
                  },
                },
                {
                  title: "앱으로 보기",
                  link: {
                    mobile_web_url: "https://developers.kakao.com",
                    web_url: "https://developers.kakao.com",
                  },
                },
              ],
            },
          },
        });
      })
      .then((res) => alert("success: " + JSON.stringify(res)))
      .catch((err) => alert("error: " + JSON.stringify(err)));
  };

  const displayToken = () => {
    const token = getCookie("authorize-access-token");
    if (token) {
      window.Kakao.Auth.setAccessToken(token);
      setIsLoggedIn2(true);
    }
  };

  const getCookie = (name) => {
    const parts = document.cookie.split(name + "=");
    if (parts.length === 2) return parts[1].split(";")[0];
  };

  return (
    <div>
      <a id="kakao-login-btn" onClick={loginWithKakao}>
        <img
          src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
          width="222"
          alt="카카오 로그인 버튼"
        />
      </a>
      <p id="token-result">
        {isLoggedIn2 && "login success, ready to send a message"}
      </p>
      {isLoggedIn2 && (
        <button
          className="api-btn"
          onClick={sendToMe}
          style={{ visibility: "visible" }}
        >
          나에게 메시지 보내기
        </button>
      )}

      {/* {isLoggedIn2 && ( */}
      {/* <button
        className="api-btn "
        class="flex w-[480px] items-center justify-center py-2"
        onClick={sendToFriends}
        style={{ visibility: "visible" }}
      >
        메시지 보내기 */}
      {/* </button> */}
      {/* )} */}
    </div>
  );
};

export default KakaoLogin;
