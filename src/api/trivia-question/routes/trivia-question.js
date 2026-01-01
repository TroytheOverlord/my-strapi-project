module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/trivia-questions',
      handler: 'trivia-question.find',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/trivia-questions/:id',
      handler: 'trivia-question.findOne',
      config: {
        auth: false,
      },
    },
  ],
};
