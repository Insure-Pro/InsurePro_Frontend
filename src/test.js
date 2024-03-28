<header id="header">
  <div class="container">
    <div class="row">
      <div class="header clearfix">
        <div class="logo">
          <h1>
            <a href="#">LOGO</a>
          </h1>
        </div>
        <nav class="gnb">
          <ul class="clearfix">
            <li>
              <a href="#">회사소개</a>
              <ul class="submenu">
                <li>
                  <a href="#">인사말</a>
                </li>
                <li>
                  <a href="#">오시는 길</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">제품소개</a>
              <ul class="submenu">
                <li>
                  <a href="#">스폰지</a>
                </li>
                <li>
                  <a href="#">필터</a>
                </li>
                <li>
                  <a href="#">그 외 제품</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">응용분야</a>
              <ul class="submenu">
                <li>
                  <a href="#">자동차</a>
                </li>
                <li>
                  <a href="#">필터2</a>
                </li>
                <li>
                  <a href="#">기타</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">고객지원</a>
              <ul class="submenu">
                <li>
                  <a href="#">공지사항</a>
                </li>
                <li>
                  <a href="#">견적의뢰</a>
                </li>
                <li>
                  <a href="#">자료실</a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>{" "}
        {/* <!--.nav--> */}
        <div id="barMenu">
          <div class="bar"></div>
        </div>
      </div>{" "}
      {/* <!--.header--> */}
    </div>{" "}
    {/* <!--.row--> */}
  </div>{" "}
  {/* <!--.container--> */}
  <div id="gnbBg"></div>
</header>;

<script>

winSzin();
function winSzin(){
    let winW = $(window).width();
    
    if(winW >= 960){
        $(".header .submenu").hide();
    }
}

$(window).resize(function(){
    winSzin();
});

$(".gnb > ul > li").mouseover(function(){

    winW = $(window).width();
    if(winW >= 960){
        $(".gnb > ul > li").find(".submenu").stop().slideDown();
        $("#gnbBg").stop().slideDown(500);
    }
})

$(".gnb > ul > li").mouseout(function(){

    winW = $(window).width();
    if(winW >= 960){
        $(".gnb > ul > li").find(".submenu").stop().slideUp();
        $("#gnbBg").stop().slideUp(500);
    }
})

$("#barMenu").click(function(e){
    e.preventDefault();
    $(".gnb").toggleClass("open")
});
$(".gnb > ul > li > a").click(function(e){
    if(winW < 960){
        e.preventDefault();
        $(".header .gnb>ul>li>.submenu").stop().slideUp();
        $(this).next("ul").stop().slideToggle();

    }
});

</script>