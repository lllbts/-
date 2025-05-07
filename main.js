document.addEventListener('DOMContentLoaded', () => {
  const addBtn    = document.getElementById('add-btn');
  const modal     = document.getElementById('upload-modal');
  const closeBtn  = document.getElementById('modal-close');
  const imgBtn    = document.getElementById('img-btn');
  const textBtn   = document.getElementById('text-btn');
  const fileInput = document.getElementById('file-input');
  const modalBody = document.getElementById('modal-body');

  addBtn.onclick   = () => modal.classList.remove('hidden');
  closeBtn.onclick = () => {
    modal.classList.add('hidden');
    resetModal();
  };

  imgBtn.onclick = () => fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    fetch('/api/upload_image/', {
      method: 'POST',
      headers: { 'X-CSRFToken': getCookie('csrftoken') },
      body: form,
    }).then(res => res.json())
      .then(() => window.location.reload())
      .catch(console.error);
  };

  textBtn.onclick = () => {
    modalBody.innerHTML = '';
    const textarea = document.createElement('textarea');
    textarea.placeholder = '写下你的碎念……';
    textarea.className = 'w-full h-32 border border-gray-600 rounded p-2 bg-gray-900';
    const sendBtn = document.createElement('button');
    sendBtn.innerText = '发布';
    sendBtn.className = 'mt-2 px-4 py-1 bg-indigo-600 text-white rounded';
    modalBody.append(textarea, sendBtn);

    sendBtn.onclick = () => {
      const text = textarea.value.trim();
      if (!text) return alert('内容不能为空');
      fetch('/api/post_text/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ body: text }),
      })
      .then(res => res.json())
      .then(() => window.location.reload())
      .catch(console.error);
    };
  };

  function resetModal() {
    modalBody.innerHTML = `
      <button id="img-btn" class="w-full py-2 border border-gray-600 rounded hover:bg-gray-700">上传图片</button>
      <button id="text-btn" class="w-full py-2 border border-gray-600 rounded hover:bg-gray-700">发布文字</button>`;
    document.getElementById('img-btn').onclick  = imgBtn.onclick;
    document.getElementById('text-btn').onclick = textBtn.onclick;
  }

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      document.cookie.split(';').forEach(c => {
        const [k, v] = c.trim().split('=');
        if (k === name) cookieValue = decodeURIComponent(v);
      });
    }
    return cookieValue;
  }
});