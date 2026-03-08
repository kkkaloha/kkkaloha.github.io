(function () {
  'use strict';

  var STORAGE_KEY = 'ax'; // 简短 key，不暴露含义
  var EXPECTED_HASH = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'; // SHA-256 哈希，非明文

  function isAdmin() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setAdmin(value) {
    try {
      if (value) {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
  }

  function bufferToHex(buffer) {
    var arr = new Uint8Array(buffer);
    var hex = '';
    for (var i = 0; i < arr.length; i++) {
      var h = arr[i].toString(16);
      hex += h.length === 1 ? '0' + h : h;
    }
    return hex;
  }

  function sha256Hex(str) {
    return crypto.subtle
      .digest('SHA-256', new TextEncoder().encode(str))
      .then(bufferToHex);
  }

  function verify(input) {
    return sha256Hex(input).then(function (hash) {
      return hash.toLowerCase() === EXPECTED_HASH.toLowerCase();
    });
  }

  function showModal() {
    var modal = document.getElementById('adminModal');
    if (modal) {
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('admin-modal-visible');
      document.getElementById('adminFormError').textContent = '';
      document.getElementById('adminPassword').value = '';
      document.getElementById('adminPassword').focus();
    }
  }

  function hideModal() {
    var modal = document.getElementById('adminModal');
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');
      modal.classList.remove('admin-modal-visible');
    }
  }

  function updateUI() {
    var loginBtn = document.getElementById('adminLoginBtn');
    var logoutBtn = document.getElementById('adminLogoutBtn');
    if (loginBtn && logoutBtn) {
      if (isAdmin()) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = '';
      } else {
        loginBtn.style.display = '';
        logoutBtn.style.display = 'none';
      }
    }
    document.body.classList.toggle('is-admin', isAdmin());
  }

  function bind() {
    var loginBtn = document.getElementById('adminLoginBtn');
    var logoutBtn = document.getElementById('adminLogoutBtn');
    var modal = document.getElementById('adminModal');
    var backdrop = document.getElementById('adminModalBackdrop');
    var form = document.getElementById('adminLoginForm');
    var cancelBtn = document.getElementById('adminModalCancel');
    var passwordInput = document.getElementById('adminPassword');
    var errorEl = document.getElementById('adminFormError');

    if (loginBtn) {
      loginBtn.addEventListener('click', showModal);
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        setAdmin(false);
        updateUI();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', hideModal);
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', hideModal);
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var raw = (passwordInput && passwordInput.value) || '';
        if (!raw.trim()) {
          if (errorEl) errorEl.textContent = '请输入口令';
          return;
        }
        if (errorEl) errorEl.textContent = '';
        verify(raw).then(function (ok) {
          if (ok) {
            setAdmin(true);
            hideModal();
            updateUI();
          } else {
            if (errorEl) errorEl.textContent = '口令错误';
          }
        });
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.classList.contains('admin-modal-visible')) {
        hideModal();
      }
    });
  }

  updateUI();
  bind();
})();
