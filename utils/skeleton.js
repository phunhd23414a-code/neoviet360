// neoviet360/utils/skeleton.js
const SkeletonLoader = {
  card: (n = 1) => {
    let html = '';
    for (let i = 0; i < n; i++) {
      html += `
        <div class="bg-ai-card border border-white/5 rounded-3xl p-6 animate-pulse">
          <div class="flex justify-between items-start mb-8">
            <div class="w-12 h-12 bg-white/5 rounded-2xl"></div>
            <div class="w-24 h-6 bg-white/5 rounded-lg"></div>
          </div>
          <div class="space-y-4">
            <div class="w-32 h-4 bg-white/5 rounded-md"></div>
            <div class="w-48 h-10 bg-white/5 rounded-xl"></div>
          </div>
          <div class="mt-8 flex gap-3">
            <div class="flex-1 h-12 bg-white/5 rounded-xl"></div>
            <div class="flex-1 h-12 bg-white/5 rounded-xl"></div>
          </div>
        </div>
      `;
    }
    return html;
  },

  transactionRow: (n = 5) => {
    let html = '';
    for (let i = 0; i < n; i++) {
      html += `
        <div class="flex items-center justify-between p-4 bg-white/5 rounded-2xl animate-pulse mb-3">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-white/10 rounded-xl"></div>
            <div class="space-y-2">
              <div class="w-32 h-4 bg-white/10 rounded-md"></div>
              <div class="w-20 h-3 bg-white/5 rounded-md"></div>
            </div>
          </div>
          <div class="text-right space-y-2">
            <div class="w-24 h-4 bg-white/10 rounded-md ml-auto"></div>
            <div class="w-16 h-3 bg-white/5 rounded-md ml-auto"></div>
          </div>
        </div>
      `;
    }
    return html;
  },

  text: (lines = 3) => {
    let html = '<div class="space-y-3 animate-pulse">';
    for (let i = 0; i < lines; i++) {
      const width = i === lines - 1 ? 'w-2/3' : 'w-full';
      html += `<div class="${width} h-4 bg-white/5 rounded-md"></div>`;
    }
    html += '</div>';
    return html;
  }
};
window.SkeletonLoader = SkeletonLoader;