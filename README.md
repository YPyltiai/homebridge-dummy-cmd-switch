# Dummy Switch to Run Command Line Commands

![npm version](https://badge.fury.io/js/homebridge-dummy-cmd-switch.svg)
![npm downloads](https://img.shields.io/npm/dm/homebridge-dummy-cmd-switch.svg)

A Homebridge plugin that allows you to create momentary switches executing custom command line commands with configurable delays.

## Features

- Executes a command line command when the switch is triggered.
- Stateless: the switch automatically reverts to its original "off" state, mimicking button behavior.
- Configurable delays before command execution and switch reset.
- Easy configuration via Homebridge UI.

## Installation

```bash
sudo npm install -g homebridge-dummy-cmd-switch
```

## Configuration

The plugin can be configured via the Homebridge UI or by editing the `config.json` file directly.

### Example Configuration

Switch can be used to reboot Homebridge as one of the use cases:

```json
{
  "accessories": [
    {
      "accessory": "DummyCmdSwitch",
      "name": "Server Reboot Switch",
      "commandOn": "pkill -15 homebridge",
      "delayOn": 1000,
      "delayOff": 4000
    }
  ]
}
```

### Configuration Parameters

- `accessory` (string): Must be set to `"DummyCmdSwitch"`.
- `name` (string): The name of the switch accessory.
- `commandOn` (string): The shell command to execute when the switch is turned on.
- `delayOn` (number, optional): Delay in milliseconds before executing the `commandOn` after the switch is turned on. Default is `1000` ms.
- `delayOff` (number, optional): Delay in milliseconds before resetting the switch to off after executing the `commandOn`. Default is `1000` ms.

## Usage

When the switch is turned on:

1. The plugin waits for the specified `delayOn` period.
2. Executes the `commandOn` shell command.
3. Waits for the specified `delayOff` period.
4. Resets the switch to the "off" state.

This sequence allows for precise control over the timing of command execution and switch reset.

## Contribution

Contributions are welcome! Please fork the repository and submit a pull request with your improvements or bug fixes.
