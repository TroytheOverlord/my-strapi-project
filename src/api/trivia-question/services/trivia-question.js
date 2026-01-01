'use strict';

/**
 * trivia-question service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::trivia-question.trivia-question');
