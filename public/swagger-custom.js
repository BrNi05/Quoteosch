(function waitForSwagger() {
  const header = document.querySelector('.swagger-ui .topbar');
  const container = document.querySelector('.swagger-ui');

  if (header) {
    let btnContainer = document.querySelector('.swagger-button-container');
    if (!btnContainer) {
      btnContainer = document.createElement('div');
      btnContainer.className = 'swagger-button-container';
      header.appendChild(btnContainer);
    }

    const buttons = [
      { text: 'How to use', link: 'https://github.com/BrNi05/Quoteosch/blob/main/README.md' },
      { text: 'How not to use', link: 'https://github.com/BrNi05/Quoteosch/blob/main/README.md#terms-of-use' },
      { text: 'Issues', link: 'https://github.com/BrNi05/Quoteosch/issues' }
    ];

    buttons.forEach(btnData => {
      if (!btnContainer.querySelector(`button[data-text="${btnData.text}"]`)) {
        const btn = document.createElement('button');
        btn.innerText = btnData.text;
        btn.onclick = () => window.open(btnData.link, '_blank');
        btn.className = 'swagger-button';
        btn.setAttribute('data-text', btnData.text);
        btnContainer.appendChild(btn);
      }
    });
  }

  if (container) {
    if (!document.querySelector('.swagger-footer')) {
      const footer = document.createElement('div');
      footer.className = 'swagger-footer';
      footer.innerHTML = `
        <p>Quoteosch API initially was a joke, but it evolved into a sophisticated project. It's meant for fun and not to offend anyone.</p>
      `;
      container.appendChild(footer);
    }
  }

  if (!header || !container) {
    setTimeout(waitForSwagger, 300);
  }
})();
