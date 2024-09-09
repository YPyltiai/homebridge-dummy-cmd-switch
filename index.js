"use strict";

const { exec } = require("child_process");
var Service, Characteristic, HomebridgeAPI;
const { DummyCmdSwitchVersion } = require('./package.json');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  HomebridgeAPI = homebridge;
  homebridge.registerAccessory("homebridge-dummy-cmd-switch", "DummyCmdSwitch", DummyCmdSwitch);
};

function DummyCmdSwitch(log, config) {
  this.log = log;
  this.name = config.name;
  this.commandOn = config.commandOn;
  this.delayOn = config.delayOn || 1000; // Configurable delay for turning on
  this.delayOff = config.delayOff || 1000; // Configurable delay for turning off

  if (typeof this.commandOn !== 'string' || !this.commandOn.trim()) {
    throw new Error('Invalid or missing commandOn configuration');
  }

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
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

DummyCmdSwitch.prototype.setOnCharacteristicHandler = async function(on, callback) {
  try {
    if (on) {
      this.log('Executing command:', this.commandOn);

      // Delay before execution
      await sleep(this.delayOn);

      // Execute the command
      await executeCommand(this.commandOn);

      // Reset the switch after execution
      await sleep(this.delayOff);
      this.service.setCharacteristic(Characteristic.On, false);

      this.log('Command executed successfully');
    }

    callback(); // Always call the callback
  } catch (error) {
    this.log('Error during command execution:', error);
    callback(error);
  }
};
