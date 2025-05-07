(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);


  // 为聊天历史记录添加新条目
  function createHistoryEntry(message) {
    const historyList = document.querySelector('.history-list');

    // 创建新条目
    const historyItem = document.createElement('a');
    historyItem.className = 'history-item';
    historyItem.href = '#';

    // 生成时间戳
    const timeString = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    // 填充内容
    historyItem.innerHTML = `
      <div class="history-title">${message.substring(0, 20)}${message.length > 20 ? '...' : ''}</div>
      <div class="history-time">${timeString}</div>
    `;

    // 添加点击交互
    historyItem.addEventListener('click', function (e) {
      e.preventDefault();
      // 这里可以添加加载聊天记录的逻辑
      console.log('Loading chat history:', this.dataset.chatId);
    });

    // 插入列表顶部
    historyList.insertBefore(historyItem, historyList.firstChild);

    // 自动滚动到底部
    historyList.scrollTop = 0;
  }

  // 发送按钮功能：将输入框内容添加到聊天消息区

  document.addEventListener('DOMContentLoaded', function () {

    // 发送按钮功能：将输入框内容追加至聊天消息区
    const sendButton = document.querySelector('.chat-input button');
    const chatInput = document.querySelector('.chat-input input');
    // const chatMessages = document.querySelector('.chat-messages');

    sendButton.addEventListener('click', function () {
      sendMessage();
    });

    chatInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    let hasSendMessage = false; // 是否是第一条消息
    let city = ''; // 城市变量
    let latitude = ''; // 纬度变量
    let longitude = ''; // 经度变量

    // 首先通过浏览器定位获取地理位置信息
    const script = document.createElement('script');
    window._AMapSecurityConfig = {
      securityJsCode: "86011e785c01b84d441cb95e32e91fe7",
    };
    script.src = `https://webapi.amap.com/maps?v=2.0&key=6bb0b3a71f5734007d182ebfb0c51f1a`;
    document.head.appendChild(script);

    script.onload = function () {
      AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认：true
          // timeout: 20000, // 设置定位超时时间，默认：无穷大
          // offset: [10, 20],  // 定位按钮的停靠位置的偏移量
          // zoomToAccuracy: true,  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          // position: 'RB' //  定位按钮的排放位置,  RB表示右下
        })

        geolocation.getCityInfo(function (status, result) {
          if (status == 'complete') {
            onComplete(result);
            city = result.city; // 提取city

            console.log(city);
          } else {
            onError(result);
            console.log('定位失败');
          }
        });

        geolocation.getCurrentPosition(function (status, result) {
          if (status == 'complete') {
            onComplete(result);
            [latitude, longitude] = [result.position.lat, result.position.lng]; // 提取纬度和经度
            console.log(latitude, longitude);
            console.log(result);
          } else {
            onError(result);
            console.log('定位失败');
          }
        });

        function onComplete(data) {
          // data是具体的定位信息
        }

        function onError(data) {
          // 定位出错
        }
      })
    }





    async function sendMessage() {
      const message = chatInput.value.trim();
      if (!message) return;

      // 首次消息处理（保持原有历史记录功能）
      if (!hasSendMessage) {
        createHistoryEntry(message);
        hasSendMessage = true;
      }

      chatInput.value = '';
      // 添加用户消息（保持原有UI功能）
      addMessage(message, 'user');

      //   try {
      //     const response = await fetch('http://localhost:8000/api/chat', {
      //         method: 'POST',
      //         headers: {
      //             'Content-Type': 'application/json'
      //         },
      //         body: JSON.stringify({
      //             inputs: {},
      //             query: message,
      //             response_mode: "streaming",
      //             conversation_id: "",
      //             user: "user-" + Date.now()
      //         })
      //     });

      //     if (!response.ok) throw new Error(`API请求失败: ${response.status}`);

      //     const reader = response.body.getReader();
      //     const decoder = new TextDecoder();
      //     let fullResponse = '';
      //     let botMessageElement = null;

      //     while (true) {
      //         const { done, value } = await reader.read();
      //         if (done) break;

      //         const chunk = decoder.decode(value, { stream: true }); // 注意添加 stream: true
      //         const lines = chunk.split('\n');

      //         for (const line of lines) {
      //             if (!line.startsWith('data: ')) continue;

      //             try {
      //                 const jsonStr = line.replace('data: ', '').trim();
      //                 if (!jsonStr) continue; // 跳过空数据

      //                 const data = JSON.parse(jsonStr);
      //                 if (data.event === "message") {
      //                     if (!botMessageElement) {
      //                         botMessageElement = document.createElement('div');
      //                         botMessageElement.className = 'message-bubble bot-message p-3 mb-2';
      //                         document.querySelector('.chat-messages').appendChild(botMessageElement);
      //                     }

      //                     fullResponse += data.answer;
      //                     botMessageElement.innerHTML = fullResponse;

      //                     document.querySelector('.chat-messages').scrollTop = 
      //                         document.querySelector('.chat-messages').scrollHeight;
      //                 }
      //             } catch (e) {
      //                 console.error('解析 JSON 失败:', e, '原始行:', line);
      //             }
      //         }
      //     }
      // } catch (error) {
      //     console.error('请求失败:', error);
      //     addMessage('服务暂时不可用: ' + error.message, 'bot');
      // }



      try {
        const response = await fetch('http://localhost:8000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
          },
          body: JSON.stringify({
            inputs: {
              city: city,          // "温州市"
              latitude: latitude,
              longitude: longitude,        // 经度, 纬度
            },
            query: message, // 发送城市和经纬度
            response_mode: "streaming",
            conversation_id: "",
            user: "user-" + Date.now()
          })
        });

        if (!response.ok) throw new Error(`API请求失败: ${response.status}`);

        // const reader = response.body.getReader();
        // const decoder = new TextDecoder('utf-8');
        // let buffer = '';
        // let botMessageElement = null;
        // let jsonBuffer = ''; // 新增：用于拼接不完整的JSON
        // let isInsideJson = false; // 标记是否开始接收JSON结构

        // while (true) {
        //   const { done, value } = await reader.read();
        //   if (done) {
        //     // 最终处理可能残留的数据

        //     break;
        //   }

        //   buffer += decoder.decode(value, { stream: true });
        //   const lines = buffer.split('\n');
        //   buffer = lines.pop() || '';


        //   for (const line of lines) {
        //     if (!line.startsWith('data: ')) continue;

        //     try {
        //       const jsonStr = line.replace('data: ', '').trim();
        //       if (!jsonStr) continue;

        //       const data = JSON.parse(jsonStr);
        //       if (data.event === "message") {
        //         if (!botMessageElement) {
        //           botMessageElement = document.createElement('div');
        //           botMessageElement.className = 'message-bubble bot-message p-3 mb-2';
        //           document.querySelector('.chat-messages').appendChild(botMessageElement);
        //         }

        //         botMessageElement.textContent += data.answer;
        //         document.querySelector('.chat-messages').scrollTop =
        //           document.querySelector('.chat-messages').scrollHeight;
        //       }
        //     } catch (e) {
        //       console.error('解析 JSON 失败:', e, '原始行:', line);
        //     }
        //   }
        // }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let botMessageElement = null;
        let hasProcessedKeyword = false; // 标记是否已处理关键词
        let responseBuffer = ''; // 用于存储完整的响应内容

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // 流结束时检查是否有未处理的标记
            console.log('流结束，检查未处理的内容');
            if (!botMessageElement) {
              botMessageElement = document.createElement('div');
              botMessageElement.className = 'message-bubble bot-message p-3 mb-2';
              document.querySelector('.chat-messages').appendChild(botMessageElement);
            }

            let [displayText, keywordPart] = responseBuffer.split('<cityKeyword>');

            botMessageElement.textContent += displayText; // 显示最后的内容
            document.querySelector('.chat-messages').scrollTop =
                  document.querySelector('.chat-messages').scrollHeight;

            let cityKeyRes = processRemainingContent(responseBuffer);
            let city = cityKeyRes.city;
            let keyword = cityKeyRes.keyword;
            if (city && keyword) {
              showTestMap(city, keyword);
            }
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;

            try {
              const jsonStr = line.replace('data: ', '').trim();
              if (!jsonStr) continue;

              const data = JSON.parse(jsonStr);
              if (data.event === "message") {
                

                // 核心处理逻辑
                // if (data.answer.includes('<cityKeyword>') && !hasProcessedKeyword) {
                  console.log('检测到关键词标记');
                  let answerText = data.answer;

                  // 显示标记前的内容
                  responseBuffer += answerText;
                  // botMessageElement.textContent += displayText;
                  

                  // hasProcessedKeyword = true; // 标记已处理
                // } else if (!hasProcessedKeyword) {
                  // 普通内容直接显示
                  // botMessageElement.textContent += data.answer;
                  // console.log('普通内容输出');
                // }

                
                
              }
            } catch (e) {
              console.error('解析失败:', e);
            }
          }
        }
      } catch (error) {
        console.error('请求失败:', error);
        addMessage('服务暂时不可用: ' + error.message, 'bot');
      }
    }


    // 处理流结束时可能残留的内容
    function processRemainingContent(content) {
      if (content.includes('<cityKeyword>')) {
        const [displayText, keywordPart] = content.split('<cityKeyword>');
        // if (botMessageElement) {
        //   botMessageElement.textContent += displayText;
        // }

        const [city, keyword] = keywordPart.split(',').map(item => item.trim());
        console.log('最终提取参数:', { city, keyword });
        return {city, keyword};
      }
    }


    // 处理完整JSON的函数
    function processJsonBuffer(jsonStr) {
      try {
        // 修复可能的转义字符问题
        const answerObj = safeJsonParse(jsonStr);

        // 渲染文本
        if (!botMessageElement) {
          botMessageElement = createMessageElement();
        }
        botMessageElement.textContent = answerObj.textResponse || answerObj.text;

        // 提取结构化数据
        if (answerObj.city && answerObj.keyword) {
          console.log('提取到地图参数:', {
            city: answerObj.city,
            keyword: answerObj.keyword
          });
          // 这里调用地图API
          AMapPlaceSearch(answerObj.city, answerObj.keyword);
        }
      } catch (e) {
        console.error('JSON解析失败:', e, '原始内容:', jsonStr);
      }
    }

    function createMessageElement() {
      const el = document.createElement('div');
      el.className = 'message-bubble bot-message p-3 mb-2';
      document.querySelector('.chat-messages').appendChild(el);
      return el;
    }



    // 测试地图显示
    //   showTestMap();
    // }

    // 测试地图显示
    function showTestMap(query_city, query_keyword) {
      // 1. 创建地图容器（直接使用你的CSS类名）
      const mapContainer = document.createElement('div');
      mapContainer.className = 'chat-map'; // 关键点：使用你的现有CSS类
      mapContainer.id = `map-${Date.now()}`;

      // 2. 添加到聊天区域（建议放在消息气泡外部）
      const chatMessages = document.querySelector('.chat-messages');
      chatMessages.appendChild(mapContainer);

      // 3. 确保容器渲染完成后再初始化地图
      const initMap = () => {
        if (!window.AMap) {
          const script = document.createElement('script');
          window._AMapSecurityConfig = {
            securityJsCode: "86011e785c01b84d441cb95e32e91fe7",
          };
          script.src = `https://webapi.amap.com/maps?v=2.0&key=6bb0b3a71f5734007d182ebfb0c51f1a`;
          script.onload = () => renderMap(mapContainer.id);
          document.head.appendChild(script);
        } else {
          renderMap(mapContainer.id, query_city, query_keyword);
        }
      };

      // 使用现代浏览器支持的API检测元素尺寸
      if ('ResizeObserver' in window) {
        const observer = new ResizeObserver(() => {
          if (mapContainer.offsetHeight > 0) {
            observer.disconnect();
            initMap();
          }
        });
        observer.observe(mapContainer);
      } else {
        // 兼容方案
        setTimeout(initMap, 100);
      }
    }

    function renderMap(containerId, query_city, query_keyword) {
      const container = document.getElementById(containerId);
      if (!container || container.offsetHeight === 0) return;

      // 修复地图可能出现的白边问题
      container.style.overflow = 'hidden';

      const map = new AMap.Map(container, {
        viewMode: '2D',
        resizeEnable: true, // 允许自动适应尺寸变化
        // zoom: 13,
      });

      const infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -30),  // 调整窗体显示位置
        autoMove: true  // 自动避免被边缘遮挡
      });

      // 搜索固定地点
      AMap.plugin(["AMap.PlaceSearch"], () => {

        const placeSearch = new AMap.PlaceSearch({
          map: map,
          autoFitView: true,
          pageSize: 5,
          city: query_city, // 兴趣点城市
          // citylimit: true,  //是否强制限制在设置的城市内搜索
        });

        placeSearch.search(query_keyword, function (status, result) {
          // 查询成功时，result即对应匹配的POI信息
          console.log(result)

          var pois = result.poiList.pois;
          for (var i = 0; i < pois.length; i++) {
            var poi = pois[i];
            var marker = [];
            marker[i] = new AMap.Marker({
              position: poi.location,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              title: poi.name,
              map: map,

            });

            // 将创建的点标记添加到已有的地图实例：
            map.add(marker[i]);
          }
          map.setFitView();
        });
      });
      console.log('PlaceSearch插件加载完成');

      // 处理窗口大小变化
      const resizeHandler = () => map.setFitView();
      window.addEventListener('resize', resizeHandler);

      // 清理时移除监听
      container._resizeHandler = resizeHandler;
    }



    function addMessage(content, sender) {
      const messages = document.querySelector('.chat-messages');
      const bubble = document.createElement('div');
      bubble.className = `message-bubble ${sender}-message p-3 mb-2`;

      // 添加消息内容容器
      const contentContainer = document.createElement('div');
      contentContainer.className = 'd-inline-block';
      contentContainer.textContent = content;

      bubble.appendChild(contentContainer);
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
    }

    function addMedia(url, type) {
      const messages = document.querySelector('.chat-messages');
      const bubble = document.createElement('div');
      bubble.className = 'message-bubble bot-message p-3 mb-2';

      if (type === 'image') {
        const img = document.createElement('img');
        img.className = 'chat-image mb-2';
        img.src = url;
        bubble.appendChild(img);
      } else if (type === 'map') {
        const iframe = document.createElement('iframe');
        iframe.className = 'google-map';
        iframe.src = url;
        bubble.appendChild(iframe);
      }

      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
    }

  });

})();

// main.js 更新控制逻辑
document.addEventListener('DOMContentLoaded', function () {
  const controlPanel = new bootstrap.Collapse('#controlPanel', {
    toggle: false
  });

  document.getElementById('expandBtn').addEventListener('click', () => {
    controlPanel.show();
    document.getElementById('expandBtn').style.opacity = '0';
  });

  document.getElementById('collapseBtn').addEventListener('click', () => {
    controlPanel.hide();
    document.getElementById('expandBtn').style.opacity = '1';
  });
});

