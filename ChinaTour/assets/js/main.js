(function() {
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
    navmenu.addEventListener('click', function(e) {
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

    async function sendMessage() {
      const message = chatInput.value.trim();
      if (!message) return;

      chatInput.value = '';
      // 添加用户消息
      addMessage(message, 'user');

      try {
        // 调用模拟 API
        const response = await simulateAPI(message);

        response.responses.forEach(res => {
          if (res.type === 'text') {
            addMessage(res.content, 'bot');
          } else {
            addMedia(res.url, res.type);
          }
        });
      } catch (error) {
        console.error('请求失败:', error);
        addMessage('服务暂时不可用', 'bot');
      }

      
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

    async function simulateAPI(message) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            responses: [
              { type: 'text', content: '这是示例响应文本' },
              { type: 'image', url: 'https://picsum.photos/seed/picsum/200/300' },
              { type: 'map', url: 'https://maps.google.com/maps?q=Shanghai&output=embed' }
            ]
          });
        }, 1000);
      });
    }
  });

})();

// main.js 更新控制逻辑
document.addEventListener('DOMContentLoaded', function() {
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
