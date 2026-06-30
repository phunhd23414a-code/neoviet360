// neoviet360/ecosystem/chatbot.js
const ChatbotPage = {
  render: (container) => {
    container.innerHTML = `
      <div class="max-w-4xl mx-auto w-full pt-4 animate__animated animate__fadeIn flex flex-col h-[calc(100vh-140px)]">
        <div class="flex items-center gap-3 mb-6 flex-shrink-0">
          <button onclick="router.navigate('dashboard')" class="p-2 rounded-lg bg-white/5 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-status-highlight/10 border border-status-highlight/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.2)]">
              <i data-lucide="bot" class="w-5 h-5 text-status-highlight animate-pulse"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white tracking-wide">Trợ lý AI NeoViet</h2>
              <p class="text-[11px] font-mono text-status-highlight uppercase tracking-widest mt-0.5">Được hỗ trợ bởi Gemini 2.0</p>
            </div>
          </div>
        </div>

        <div class="layer-primary rounded-3xl flex flex-col flex-1 overflow-hidden border-status-highlight/20 relative">
          <div class="absolute inset-0 cyber-grid opacity-10 pointer-events-none"></div>
          
          <div id="chat-messages" class="flex-1 overflow-y-auto p-6 space-y-6 native-scrollbar relative z-10">
            <div class="flex gap-4 items-start">
              <div class="w-8 h-8 rounded-full bg-status-highlight/20 flex items-center justify-center border border-status-highlight/30 shrink-0">
                <i data-lucide="sparkles" class="w-4 h-4 text-status-highlight"></i>
              </div>
              <div class="bg-ai-surface/80 border border-white/5 p-4 rounded-2xl rounded-tl-none max-w-[80%] backdrop-blur-md">
                <p class="text-[14px] text-white leading-relaxed">Chào bạn, tôi là trợ lý AI của hệ sinh thái tài chính NeoViet 360 (tích hợp VNPAY, VCB Digibank và Revolut). Tôi có thể giúp gì cho bạn hôm nay?</p>
              </div>
            </div>
          </div>

          <div class="p-4 bg-ai-surface border-t border-white/5 relative z-10">
            <form id="chat-form" class="flex items-center gap-3">
              <button type="button" id="btn-voice-chat" class="w-14 h-14 rounded-xl bg-white/5 hover:bg-white/10 text-ai-muted border border-white/10 flex items-center justify-center transition-all shrink-0">
                <i data-lucide="mic" class="w-5 h-5"></i>
              </button>
              <input type="text" id="chat-input" placeholder="Hỏi AI về quản lý chi tiêu, đầu tư..." required autocomplete="off"
                     class="flex-1 bg-[#07111F] border border-white/10 rounded-xl px-5 py-4 text-[14px] text-white placeholder-ai-muted outline-none focus:border-status-highlight/50 transition-colors">
              <button type="submit" id="btn-send-chat" class="w-14 h-14 rounded-xl bg-status-highlight/20 hover:bg-status-highlight/30 text-status-highlight border border-status-highlight/50 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(0,245,255,0.1)] shrink-0">
                <i data-lucide="send" class="w-5 h-5"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
    ChatbotPage.bindEvents();
    
    // Load lịch sử chat nếu có
    if (state.chatHistory && state.chatHistory.length > 0) {
      ChatbotPage.renderHistory();
    }
  },

  renderHistory: () => {
    const box = document.getElementById('chat-messages');
    box.innerHTML = '';
    state.chatHistory.forEach(msg => {
      const isUser = msg.role === 'user';
      box.innerHTML += `
        <div class="flex gap-4 items-start ${isUser ? 'flex-row-reverse' : ''}">
          <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-status-premium/20 border-status-premium/30' : 'bg-status-highlight/20 border-status-highlight/30'} border">
            <i data-lucide="${isUser ? 'user' : 'sparkles'}" class="w-4 h-4 ${isUser ? 'text-status-premium' : 'text-status-highlight'}"></i>
          </div>
          <div class="${isUser ? 'bg-status-premium/10 border-status-premium/20 rounded-tr-none' : 'bg-ai-surface/80 border-white/5 rounded-tl-none'} border p-4 rounded-2xl max-w-[80%] backdrop-blur-md">
            <p class="text-[14px] text-white leading-relaxed whitespace-pre-wrap">${msg.parts[0].text}</p>
          </div>
        </div>
      `;
    });
    lucide.createIcons();
    box.scrollTop = box.scrollHeight;
  },

  bindEvents: () => {
    const voiceBtn = document.getElementById('btn-voice-chat');
    const chatInput = document.getElementById('chat-input');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      let isListening = false;

      voiceBtn.addEventListener('click', () => {
        if (!isListening) {
          recognition.start();
        } else {
          recognition.stop();
        }
      });

      recognition.onstart = () => {
        isListening = true;
        voiceBtn.classList.add('bg-status-alert/20', 'text-status-alert', 'border-status-alert/50', 'animate-pulse');
        voiceBtn.innerHTML = '<i data-lucide="mic-off" class="w-5 h-5"></i>';
        lucide.createIcons();
        chatInput.placeholder = "Đang nghe...";
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
      };

      recognition.onend = () => {
        isListening = false;
        voiceBtn.classList.remove('bg-status-alert/20', 'text-status-alert', 'border-status-alert/50', 'animate-pulse');
        voiceBtn.innerHTML = '<i data-lucide="mic" class="w-5 h-5"></i>';
        lucide.createIcons();
        chatInput.placeholder = "Hỏi AI về quản lý chi tiêu, đầu tư...";
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        recognition.stop();
      };
    } else {
      voiceBtn.style.display = 'none';
    }

    document.getElementById('chat-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('chat-input');
      const text = input.value.trim();
      const btn = document.getElementById('btn-send-chat');
      const box = document.getElementById('chat-messages');
      
      if (!text) return;
      
      // Khởi tạo lịch sử nếu chưa có
      if (!state.chatHistory) state.chatHistory = [];
      
      // Thêm tin nhắn user vào UI và State
      state.chatHistory.push({ role: "user", parts: [{ text: text }] });
      input.value = '';
      ChatbotPage.renderHistory();
      
      // Hiệu ứng Loading
      btn.innerHTML = `<i class="animate-spin" data-lucide="loader"></i>`;
      lucide.createIcons();
      btn.disabled = true;

      try {
        const apiKey = typeof CONFIG !== 'undefined' ? CONFIG.GEMINI_API_KEY : '';
        if (!apiKey || apiKey === "") {
          throw new Error("Chưa cấu hình GEMINI_API_KEY trong file config.js");
        }

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: "Bạn là trợ lý AI cao cấp của hệ sinh thái ngân hàng số NeoViet 360. Trả lời ngắn gọn, chuyên nghiệp, thông minh bằng tiếng Việt." }] },
            contents: state.chatHistory
          })
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        
        const aiResponse = data.candidates[0].content.parts[0].text;
        state.chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });
        
      } catch (error) {
        state.chatHistory.push({ role: "model", parts: [{ text: `[Lỗi Hệ Thống]: ${error.message}` }] });
      } finally {
        ChatbotPage.renderHistory();
        btn.innerHTML = `<i data-lucide="send" class="w-5 h-5"></i>`;
        lucide.createIcons();
        btn.disabled = false;
        input.focus();
      }
    });
  }
};