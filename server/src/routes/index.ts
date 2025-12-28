// Route aggregator
import { Hono } from 'hono';
import market from './market';
import news from './news';
import sentiment from './sentiment';
import crypto from './crypto';
import health from './health';
import admin from './admin';
import ai from './ai';
import users from './users';
import auth from './auth';

const api = new Hono();

// Mount all routes
api.route('/market', market);
api.route('/news', news);
api.route('/sentiment', sentiment);
api.route('/crypto', crypto);
api.route('/health', health);
api.route('/admin', admin);
api.route('/ai', ai);
api.route('/users', users);
api.route('/auth', auth);

export default api;
