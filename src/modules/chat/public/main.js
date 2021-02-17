const url = `http://localhost:3000/`;

new Vue({
  el: '#app',
  data: {
    accessToken: '',
    title: 'Nest.js Chat',
    text: '',
    modal: false,
    messages: [],
    socket: null,
    activeChat: '',
    chats: [],
    chatName: '',
    users: [],
    checkedUsers: [],
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.accessToken = localStorage.getItem('accessToken');

      if (!this.accessToken) {
        return;
      }

      this.loadChats();

      this.socket = io(`${url}chat`, {
        query: { token: this.accessToken },
      });
      this.socket.on('msgToClient', message => {
        this.receivedMessage(message);
      });

      this.socket.on('joinedRoom', room => {
        this.loadMessages(room);
      });

      // this.socket.on('leftRoom', room => {
      // });
    },
    async loadChats() {
      const respose = await fetch(url + 'chats', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + this.accessToken,
          'Content-Type': 'application/json',
        },
        qs: {},
      });

      if (!respose.ok) {
        this.accessToken = '';
        return;
      }

      const chats = await respose.json();

      this.chats = chats.rows;
      if (this.chats.length) {
        this.activeChat = this.chats[0].id;
        this.loadMessages(this.activeChat);
        this.socket.emit('joinRoom', this.activeChat);
      }
    },
    async loadMessages(chatId) {
      this.messages = [];

      const respose = await fetch(`${url}chats/${chatId}/messages`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + this.accessToken,
          'Content-Type': 'application/json',
        },
        qs: {},
      });

      if (!respose.ok) {
        this.accessToken = '';
        return;
      }

      const messages = await respose.json();

      this.messages = messages.rows;
    },
    onChange(chatId) {
      this.socket.emit('leaveRoom', this.activeChat);
      this.activeChat = chatId;
      this.socket.emit('joinRoom', this.activeChat);
    },
    sendMessage() {
      if (this.validateInput()) {
        const message = {
          text: this.text,
          chatId: this.activeChat,
        };
        this.socket.emit('msgToServer', message);
        this.text = '';
      }
    },
    receivedMessage(message) {
      this.messages.push(message);
    },
    validateInput() {
      return this.text.length > 0;
    },
    async googleLogin() {
      try {
        const GoogleAuth = new firebase.auth.GoogleAuthProvider();
        await firebase.auth().signInWithPopup(GoogleAuth);
        const firebaseIdToken = await firebase
          .auth()
          .currentUser.getIdToken(true);

        const respose = await fetch(url + 'auth/firebase', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + this.accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firebaseIdToken,
          }),
        });
        const tokens = await respose.json();

        this.accessToken = tokens.accessToken;
        localStorage.setItem('accessToken', tokens.accessToken);

        this.init();
      } catch (err) {
        console.log(err);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },

    async showModal() {
      this.chatName = '';
      this.users = [];
      this.checkedUsers = [];
      this.modal = true;

      const respose = await fetch(url + 'users', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + this.accessToken,
          'Content-Type': 'application/json',
        },
      });
      const users = await respose.json();

      this.users = users.rows;
    },
    inviteUser(userId) {
      const index = this.checkedUsers.indexOf(userId);

      if (index === -1) {
        this.checkedUsers.push(userId);
      } else {
        this.checkedUsers.splice(this.checkedUsers.indexOf(userId), 1);
      }
    },
    async createChat() {
      await fetch(url + 'chats', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + this.accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.chatName,
          userIds: this.checkedUsers,
        }),
      });

      this.loadChats();

      this.chatName = '';
      this.users = [];
      this.checkedUsers = [];
      this.modal = false;
    },
  },
});
