/* eslint-disable no-unused-expressions */

const chai = require('chai')
chai.use(require('sinon-chai'))
const expect = chai.expect
const sinon = require('sinon')
const StatusPage = require('../')

let instance
let getStub
let setStub
let listenStub
let mockConfig
let consoleStub

describe('Status Page Server setup', function () {
  beforeEach(() => {
    mockConfig = {
      port: 3000
    }

    instance = new StatusPage()

    getStub = sinon.stub(instance.server, 'get')
    setStub = sinon.stub(instance.server, 'set')
    listenStub = sinon.stub(instance.server, 'listen')
    consoleStub = sinon.stub(console, 'info')
  })

  afterEach(() => {
    getStub.restore()
    setStub.restore()
    listenStub.restore()
    consoleStub.restore()
  })

  it('Should set view engine and root route', async () => {
    instance.config = mockConfig
    await instance.start()
    expect(setStub).to.be.calledWith('view engine', 'pug')
    expect(getStub).to.be.calledWith('/')
  })

  it('/ route calls getPage', async () => {
    instance.config = mockConfig
    const getPageStub = sinon.stub(instance, 'getPage')
    getStub.restore()
    getStub = sinon.stub(instance.server, 'get').yields('foo', 'bar')
    await instance.start()
    expect(getPageStub).to.be.calledOnce
    expect(getPageStub).to.be.calledWith('bar')
    getPageStub.restore()
  })

  it('Message is logged to console when listen is called', async () => {
    instance.config = mockConfig
    listenStub.restore()
    listenStub = sinon.stub(instance.server, 'listen').yields()
    await instance.start()
    expect(listenStub).to.be.calledWith(3000)
    expect(consoleStub).to.be.calledWith('👂  Hue Log Status Page - Listening on port 3000')
  })

  it('Port defaults to 80', async () => {
    instance.config = {}
    listenStub.restore()
    listenStub = sinon.stub(instance.server, 'listen').yields()
    await instance.start()
    expect(listenStub).to.be.calledWith(80)
    expect(consoleStub).to.be.calledWith('👂  Hue Log Status Page - Listening on port 80')
  })

  it('getPage resturns pug template', async () => {
    instance.config = mockConfig
    const renderStub = sinon.stub()
    instance.getPage({ render: renderStub })
    expect(renderStub).to.be.calledWith('index')
  })
})

describe('Log manipulation', function () {
  it('Log method pushes to log array', () => {
    instance = new StatusPage()
    expect(instance.logs).to.be.an('array')
    expect(instance.logs.length).to.equal(0)
    instance.log('info', 'alert', 'some message')
    expect(instance.logs.length).to.equal(1)
  })

  it('Log method adds a timestamp to log object', () => {
    instance = new StatusPage()
    instance.log('info', 'alert', 'some message')
    expect(instance.logs[0].timestamp).to.be.an('object')
  })

  it('formattedLogs adds a "time since" label to log object', () => {
    instance = new StatusPage()
    instance.log('info', 'alert', 'some message')
    expect(instance.formattedLogs[0].formattedTimestamp).to.be.a('string')
    expect(instance.formattedLogs[0].formattedTimestamp).to.contain('ago')
  })

  it('lastLogs gets most recent log object', () => {
    instance = new StatusPage()
    instance.log('info', 'alert', 'some message')
    instance.log('info', 'alert', 'last message')
    expect(instance.lastLog.message).to.equal('last message')
  })

  it('restOfLogs gets 2nd - 11th most recent log objects ()', () => {
    instance = new StatusPage()
    for (let i = 1; i <= 30; i++) {
      instance.log('info', 'alert', 'message ' + i)
    }
    expect(instance.restOfLogs.length).to.equal(10)
    expect(instance.restOfLogs[0].message).to.equal('message 29')
  })
})
