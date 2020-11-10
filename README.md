# Comfoair Q 350 MQTT bridge

This node script let you use a RaspBerry PI + usb tin to interact with the Comfoair Q 350 unit.

It does expose all known informations through MQTT and let you control the air flow via MQTT as well.

It does allow you to integrate the unit on Home Assistant as depicted below:
![Comfoair Q 350 Home Assistant](docs/homeassistant.png?raw=true "Comfoair Q 350 Home Assistant")

You can find the configuration YAML files in the `docs` folder.

## How to run this

Provided you've the necessary hardware, you need to create the `.env` file based on the `.env-sample` file with the proper environment variables.

Prerequisites:

* `node.js` > 10
* `pm2` installed (`npm i pm2 -g`)

Steps:

* clone this repository
* run `npm i` or `yarn`
* use `pm2 start pm2.config.js`

If you want to enable this project to run at startup then issue `pm2 startup`

## MQTT commands
The following commands are available. just issue whatever payload you want to `${prefix}/commands/${key}`

where `${key}` is: 
  * ventilation_level_0
  * ventilation_level_1
  * ventilation_level_2
  * ventilation_level_3
  * boost_10_min
  * boost_20_min
  * boost_30_min
  * boost_60_min
  * boost_end
  * auto
  * manual
  * bypass_activate_1h
  * bypass_deactivate_1h
  * bypass_auto
  * ventilation_supply_only
  * ventilation_extract_only
  * ventilation_balance
  * temp_profile_normal
  * temp_profile_cool
  * temp_profile_warm

Along with these above you can also use the `ventilation_level` key with the string `0` or `1`, `2`, `3` to set the desired fan speed level.
There is also `set_mode` which accepts `auto` or `manual` as payload.






## Credits

A lot of this repo was inspired by the reverse engineering [here](https://github.com/marco-hoyer/zcan/issues/1).
If you'd like to know more how the unit communicates, head over

 * [here](https://github.com/michaelarnauts/comfoconnect/blob/master/PROTOCOL-RMI.md)
 * [and here](https://github.com/michaelarnauts/comfoconnect/blob/master/PROTOCOL-PDO.md)
