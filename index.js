'use strict'

const express = require('express')
const moment = require('moment')
const path = require('path')

class StatusPage {
  constructor () {
    this.logs = []
    this.server = express()
  }

  /**
   * Fire up the http server
   * @return {Promise}
   */
  async start () {
    const port = this.config.port || 80

    this.server.set('view engine', 'pug')
    this.server.set('views', path.join(__dirname, 'views'))
    this.server.get('/', (req, res) => this.getPage(res))

    await this.server.listen(port, () => console.info(`👂  Hue Log Status Page - Listening on port ${port}`))
  }

  /**
   * Prepare data for pug templates and render
   * @param  {Object} res Express response object
   */
  getPage (res) {
    const data = {
      lastLog: this.lastLog,
      logs: this.restOfLogs
    }

    res.render('index', data)
  }

  /**
   * Handle log events
   * @param  {String}  [logLevel] Level of log
   * @param  {String}  [status]   Status changed to
   * @param  {String}  message    Log message
   */
  async log (logLevel, status, message) {
    this.logs.push({logLevel, status, message, timestamp: moment()})
  }

  /**
   * Add a formattedTimestamp attribute to each log object
   * @return {Array.Object}
   */
  get formattedLogs () {
    return this.logs.map(log => {
      log.formattedTimestamp = moment(log.timestamp).fromNow()
      return log
    })
  }

  /**
   * The most recent log item
   * @return {Object}
   */
  get lastLog () {
    return this.formattedLogs[this.formattedLogs.length - 1]
  }

  /**
   * 2nd - 11th most recent log items
   * @return {Array.Object}
   */
  get restOfLogs () {
    const array = this.formattedLogs
    array.splice(-1)
    return array.slice(Math.max(this.formattedLogs.length - 11, 1)).reverse()
  }
}

module.exports = StatusPage
