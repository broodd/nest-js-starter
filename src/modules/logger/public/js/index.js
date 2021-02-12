const cells = [
  {
    name: 'ID',
    className: 'cell-id',
    logName: 'id',
    search: true,
    type: 'number',
  },
  {
    name: 'Date (locale)',
    className: 'cell-date',
    logName: 'createdAt',
    search: false,
    type: null,
  },
  {
    name: 'IP address',
    className: 'cell-ip-address',
    logName: 'ipAddr',
    search: true,
    type: 'text',
  },
  {
    name: 'Method',
    className: 'cell-method',
    logName: 'method',
    search: true,
    type: 'text',
  },
  {
    name: 'URL',
    className: 'cell-url',
    logName: 'url',
    search: true,
    type: 'text',
  },
  {
    name: 'User ID',
    className: 'cell-user-id',
    logName: 'userId',
    search: true,
    type: 'number',
  },
  {
    name: 'Username',
    className: 'cell-username',
    logName: 'username',
    search: true,
    type: 'text',
  },
  {
    name: 'Response length',
    className: 'cell-res-length',
    logName: 'resLength',
    search: false,
    type: null,
  },
  {
    name: 'Status',
    className: 'cell-status',
    logName: 'resStatus',
    search: true,
    type: 'number',
  },
  {
    name: 'Status message',
    className: 'cell-status-message',
    logName: 'resStatusMessage',
    search: false,
    type: null,
  },
  {
    name: 'Response time, ms',
    className: 'cell-res-time',
    logName: 'resTime',
    search: false,
    type: null,
  },
  {
    name: 'Request type',
    className: 'cell-req-type',
    logName: 'reqType',
    search: true,
    type: 'text',
  },
  {
    name: 'Request length',
    className: 'cell-req-length',
    logName: 'reqLength',
    search: false,
    type: null,
  },
  {
    name: 'Request body',
    className: 'cell-req-body',
    logName: 'reqBody',
    search: false,
    type: null,
  },
  {
    name: 'Auth token',
    className: 'cell-auth-token',
    logName: 'authToken',
    search: false,
    type: null,
  },
  {
    name: 'Errors',
    className: 'cell-errors',
    logName: 'errors',
    search: false,
    type: null,
  },
  {
    name: 'Server error',
    className: 'cell-server-error',
    logName: 'serverError',
    search: false,
    type: null,
  },
];

window.onload = async () => {
  const getLogs = async (options = {}) => {
    const startTime = Date.now();
    try {
      let query =
        Object.getOwnPropertyNames(options)
          .map((key) => `${key}=${options[key]}`)
          .join('&') || '';
      query = query ? `?${query}` : '';
      const res = await fetch(`${document.location.origin}/logs/json${query}`);
      const logs = await res.json();

      const table = document.createElement('div');
      table.id = 'table';

      const searchBody = document.createElement('div');
      searchBody.className = 'table-body';
      const searchBodyRow = document.createElement('div');
      searchBodyRow.className = 'table-row unselectable';

      for (const { className, logName, search, type } of cells) {
        const cell = document.createElement('div');
        cell.className = `table-cell cell-search ${className}`;
        if (search) {
          const input = document.createElement('input');
          input.dataset.name = logName;
          input.placeholder = 'Search';
          input.type = type;
          cell.appendChild(input);
        }
        searchBodyRow.appendChild(cell);
      }

      searchBody.appendChild(searchBodyRow);
      table.appendChild(searchBody);

      const header = document.createElement('div');
      header.className = 'table-header';

      const headerRow = document.createElement('div');
      headerRow.className = 'table-row unselectable';

      for (const { name, className } of cells) {
        const cell = document.createElement('div');
        cell.className = `table-cell ${className}`;
        cell.textContent = name;
        headerRow.appendChild(cell);
      }

      header.appendChild(headerRow);
      table.appendChild(header);

      const body = document.createElement('div');
      body.className = 'table-body';

      for (const log of logs) {
        const row = document.createElement('div');
        row.className = 'table-row';

        for (const { className, logName } of cells) {
          const cell = document.createElement('div');
          cell.className = `table-cell ${className}`;
          cell.dataset.log = logName;

          if (logName === 'id') {
            const span = document.createElement('span');
            span.textContent = log.id;
            cell.appendChild(span);

            const btnCopy = document.createElement('button');
            btnCopy.className = 'btn-copy-text';
            btnCopy.title = 'Скопировать JSON';
            btnCopy.dataset.id = log.id;
            const iCopy = document.createElement('i');
            iCopy.className = 'far fa-copy';
            btnCopy.appendChild(iCopy);
            cell.appendChild(btnCopy);

            const btnLink = document.createElement('button');
            btnLink.className = 'btn-copy-link';
            btnLink.title = 'Скопировать ссылку';
            btnLink.dataset.id = log.id;
            const iLink = document.createElement('i');
            iLink.className = 'fas fa-link';
            btnLink.appendChild(iLink);
            cell.appendChild(btnLink);

            const btnOpen = document.createElement('button');
            btnOpen.className = 'btn-open-link';
            btnOpen.title = 'Открыть в новой вкладке';
            btnOpen.dataset.id = log.id;
            const iOpen = document.createElement('i');
            iOpen.className = 'fas fa-external-link-square-alt';
            btnOpen.appendChild(iOpen);
            cell.appendChild(btnOpen);

            row.dataset.id = log.id;
          } else if (logName === 'createdAt') {
            const date = new Date(log[logName]);
            cell.innerHTML = `${date.getDate()}-${date.getMonth() + 1
              }-${date.getFullYear()} <mark>${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}</mark>`;
          } else if (logName === 'errors') {
            const errors = log.errors ? log.errors.join('\n') : '';
            cell.innerHTML = `<pre>${errors}</pre>`;
          } else if (logName === 'reqLength') {
            cell.textContent = log.reqLength !== 0 ? log.reqLength : '';
          } else if (logName === 'reqBody') {
            const reqBody = log.reqBody ? JSON.stringify(JSON.parse(log.reqBody), null, 2) : '';
            cell.innerHTML = `<pre>${reqBody}</pre>`;
          } else if (logName === 'serverError') {
            const serverError = log.serverError
              ? JSON.stringify(JSON.parse(log.serverError), null, 2).replace(/\\n/g, '\n')
              : '';
            cell.innerHTML = `<pre>${serverError}</pre>`;
            if (serverError) console.log(serverError);
          } else {
            cell.textContent = log[logName];
          }

          row.appendChild(cell);
        }

        body.appendChild(row);
      }

      table.appendChild(body);
      document.querySelector('#table').outerHTML = table.outerHTML;

      Object.getOwnPropertyNames(options).forEach((key) => {
        const input = document.querySelector(`input[data-name='${key}']`);
        if (input) {
          input.value = options[key];
        }
      });
    } catch (e) {
      console.error(e);
    }

    document.querySelectorAll('.btn-copy-text').forEach((el) =>
      el.addEventListener('click', function () {
        const row = document.querySelector(`.table-row[data-id='${el.dataset.id}']`);
        const log = {};
        row
          .querySelectorAll('.table-cell')
          .forEach((cell) =>
            !cell.innerText
              ? null
              : cell.dataset.log === 'reqBody'
                ? (log[cell.dataset.log] = JSON.parse(cell.innerText))
                : cell.dataset.log === 'errors'
                  ? (log[cell.dataset.log] = cell.innerText.split('\n'))
                  : (log[cell.dataset.log] = cell.innerText.replace(/\n/g, '\n')),
          );
        copyText(JSON.stringify(log, null, 2));
      }),
    );

    document.querySelectorAll('.btn-copy-link').forEach((el) =>
      el.addEventListener('click', function () {
        copyText(`${document.location.origin}/logs/${el.dataset.id}`);
      }),
    );

    document.querySelectorAll('.btn-open-link').forEach((el) =>
      el.addEventListener('click', function () {
        const tab = window.open(`${document.location.origin}/logs/${el.dataset.id}`, '_blank');
        tab.focus();
      }),
    );

    document.querySelectorAll('.table-row').forEach((el) =>
      el.addEventListener('click', function () {
        const selectRows = document.querySelector('#selectRows');
        if (this.classList.contains('unselectable') || !selectRows.checked) {
          return;
        }

        if (this.classList.contains('row-clicked')) {
          this.classList.remove('row-clicked');
        } else {
          this.classList.add('row-clicked');
        }
      }),
    );

    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    document.querySelector('#updateTime').textContent = `Updated on ${time} (${(
      (Date.now() - startTime) /
      1000
    ).toFixed(3)}s)`;
  };

  const copyText = (text) => {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(input);
  };

  await getLogs();

  document.querySelector('#getLogs').addEventListener('submit', async function (event) {
    event.preventDefault();
    const { offset, limit } = Object.fromEntries(new FormData(this));
    const options = {
      offset,
      limit,
    };

    document
      .querySelectorAll('.cell-search input')
      .forEach((el) => (el.value ? (options[el.dataset.name] = el.value) : null));
    await getLogs(options);
  });

  document.querySelector('#clearBtn').addEventListener('click', async function (event) {
    event.preventDefault();
    document.querySelector('input[name=limit').value = 100;
    document.querySelector('input[name=offset').value = 0;
    document.querySelectorAll('.cell-search input').forEach((el) => (el.value = ''));
    document.querySelectorAll('.table-row.row-clicked').forEach((el) => el.classList.remove('row-clicked'));
  });
};
