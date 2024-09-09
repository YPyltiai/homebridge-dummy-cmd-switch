# Dummy Switch to Run Command Line Commands

A Homebridge plugin that allows you to create momentary switches executing custom command line commands.

## Features
- Executes a command line command when switch is triggered.
- Stateless: switch will automatically revert back to its original "off" state, mimicking a button behavior.
- Easy configuration via Homebridge UI.

## Installation
```bash
sudo npm install -g homebridge-dummy-cmd-switch
```
## Example Configuration

Can be configured via Homebridge UI or `config.json`:

```
{
  "accessories": [
    {
      "accessory": "DummyCmdSwitch",
      "name": "Server Reboot Switch",
      "commandOn": "sleep 5 && pkill -15 homebridge"
    }
  ]
}
```
