"use strict";

const { exec } = require("child_process");
var Service, Characteristic, HomebridgeAPI;
const { DummyCmdSwitchVersion } = require('./package.json');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  HomebridgeAPI = homebridge;
  homebridge.registerAccessory("homebridge-dummy-cmd-switch", "DummyCmdSwitch", DummyCmdSwitch);
}

function DummyCmdSwitch(log, config)  {
    this.log = log;
    this.name = config.name;
    this.commandOn = config.commandOn;
    this.timer = null;

    this.service = new Service.Switch(this.name);
}

DummyCmdSwitch.prototype.getServices = function() {
    this.informationService = new Service.AccessoryInformation();
    this.informationService
        .setCharacteristic(Characteristic.Manufacturer, 'Homebridge')
        .setCharacteristic(Characteristic.Model, 'Dummy CMD Switch')
        .setCharacteristic(Characteristic.FirmwareRevision, DummyCmdSwitchVersion)
        .setCharacteristic(Characteristic.SerialNumber, 'DummyCmd-' + this.name.replace(/\s/g, '-'));

    this.service.getCharacteristic(Characteristic.On)
      .on('set', this.setOnCharacteristicHandler.bind(this));

    return [this.informationService, this.service];
}

DummyCmdSwitch.prototype.setOnCharacteristicHandler = function(on, callback) {
  var delay = 0;
  if (on) {
    this.log('Executing command:', this.commandOn);

    exec(this.commandOn, (error) => {
      if (error) {
        this.log('Error executing command:', error);
        return callback(error);
      }
    })

    clearTimeout(this.timer);
    this.timer = setTimeout(function() {
      this.service.setCharacteristic(Characteristic.On, false);
    }.bind(this), delay);
  }

  callback();
}
