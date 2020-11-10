"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = exports.mapping2 = void 0;
const uint16 = (v1, v2) => v1 + (v2 << 8);
const int16 = (v1, v2) => v1 + (v2 << 8);
const uint32 = (v1, v2, v3, v4) => uint16(v1, v2) + (uint16(v3, v4) << 16);
exports.mapping2 = {
    16: {
        name: 'away_indicator',
        transform: (val) => val === 0x07
    },
    49: {
        name: 'operating_mode',
        transform: (val) => (val === 1 ? 'limited_manual' : (val === 0xff ? 'auto' : 'unlimited_manual')),
    },
    56: {
        name: 'operating_mode2',
        transform: (val) => (val === 1 ? 'unlimited_manual' : 'auto'),
    },
    65: {
        name: 'fan_speed',
        transform: (val) => [0, 1, 2, 3][val],
    },
    66: {
        name: 'bypass_mode',
        transform: (val) => ['auto', 'activated', 'deactivated'][val]
    },
    67: {
        name: 'temp_profile',
        transform: (val) => ['normal', 'cold', 'warm'][val]
    },
    81: {
        name: 'next_fan_change',
        transform: uint32
    },
    117: {
        name: 'exhaust_fan_duty',
        transform: (val) => val // percentage
    },
    118: {
        name: 'supply_fan_duty',
        transform: (val) => val // percentage
    },
    119: {
        name: 'exhaust_fan_flow',
        transform: uint16
    },
    120: {
        name: 'supply_fan_flow',
        transform: uint16
    },
    121: {
        name: 'exhaust_fan_speed',
        transform: uint16
    },
    122: {
        name: 'supply_fan_speed',
        transform: uint16
    },
    128: {
        name: 'power_consumption_current',
        transform: uint16,
    },
    129: {
        name: 'power_consumption_ytd',
        transform: uint16,
    },
    130: {
        name: 'power_consumption_since_start',
        transform: uint16,
    },
    144: {
        name: 'ph_power_consumption_ytd',
        transform: uint16,
    },
    145: {
        name: 'ph_power_consumption_since_start',
        transform: uint16,
    },
    // clone?
    146: {
        name: 'ph_power_consumption_current_ventilation',
        transform: uint16,
    },
    192: {
        name: 'remaining_days_filter_replacement',
        transform: uint16,
    },
    209: {
        name: 'rmot',
        transform: (a, b) => int16(a, b) / 10,
    },
    212: {
        name: 'target_temp',
        transform: (a, b) => int16(a, b) / 10,
    },
    // AVoided heating section
    213: {
        name: 'ah_actual',
        transform: (a, b) => int16(a, b) / 100,
    },
    214: {
        name: 'ah_ytd',
        transform: uint16,
    },
    215: {
        name: 'ah_total',
        transform: uint16,
    },
    // Avoided cooling
    216: {
        name: 'ac_actual',
        transform: (a, b) => int16(a, b) / 100,
    },
    217: {
        name: 'ac_ytd',
        transform: uint16,
    },
    218: {
        name: 'ac_total',
        transform: uint16,
    },
    221: {
        name: 'post_heater_temp_after',
        transform: (a, b) => int16(a, b) / 10,
    },
    227: {
        name: 'bypass_state',
        transform: (v) => v === 64,
    },
    274: {
        name: 'extract_air_temp',
        transform: (a, b) => int16(a, b) / 10,
    },
    275: {
        name: 'exhaust_air_temp',
        transform: (a, b) => int16(a, b) / 10,
    },
    276: {
        name: 'outdoor_air_temp',
        transform: (a, b) => int16(a, b) / 10,
    },
    278: {
        name: 'post_heater_temp_before',
        transform: (a, b) => int16(a, b) / 10,
    },
    290: {
        name: 'extract_air_humidity',
        transform: int16,
    },
    291: {
        name: 'exhaust_air_humidity',
        transform: int16,
    },
    292: {
        name: 'outdoor_air_humidity',
        transform: int16,
    },
    294: {
        name: 'supply_air_humidity',
        transform: int16,
    },
};
exports.commands = {
    'ventilation_level_0': [0x84, 0x15, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00],
    'ventilation_level_1': [0x84, 0x15, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01],
    'ventilation_level_2': [0x84, 0x15, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02],
    'ventilation_level_3': [0x84, 0x15, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x03],
    'boost_10_min': [0x84, 0x15, 0x01, 0x06, 0x00, 0x00, 0x00, 0x00, 0x58, 0x02, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00],
    'boost_20_min': [0x84, 0x15, 0x01, 0x06, 0x00, 0x00, 0x00, 0x00, 0xB0, 0x04, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00],
    'boost_30_min': [0x84, 0x15, 0x01, 0x06, 0x00, 0x00, 0x00, 0x00, 0x08, 0x07, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00],
    'boost_60_min': [0x84, 0x15, 0x01, 0x06, 0x00, 0x00, 0x00, 0x00, 0x10, 0x0E, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00],
    'boost_end': [0x85, 0x15, 0x01, 0x06],
    'auto': [0x85, 0x15, 0x08, 0x01],
    'manual': [0x84, 0x15, 0x08, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01],
    'bypass_activate_1h': [0x84, 0x15, 0x02, 0x01, 0x00, 0x00, 0x00, 0x00, 0x10, 0x0e, 0x00, 0x00, 0x01],
    'bypass_deactivate_1h': [0x84, 0x15, 0x02, 0x01, 0x00, 0x00, 0x00, 0x00, 0x10, 0x0e, 0x00, 0x00, 0x02],
    'bypass_auto': [0x84, 0x15, 0x02, 0x01],
    'ventilation_supply_only': [0x84, 0x15, 0x06, 0x01, 0x00, 0x00, 0x00, 0x00, 0x10, 0x0e, 0x00, 0x00, 0x01],
    'ventilation_extract_only': [0x84, 0x15, 0x06, 0x01, 0x00, 0x00, 0x00, 0x00, 0x10, 0x0e, 0x00, 0x00, 0x00],
    'ventilation_balance': [0x84, 0x15, 0x06, 0x01],
    'temp_profile_normal': [0x84, 0x15, 0x03, 0x01, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0x00],
    'temp_profile_cool': [0x84, 0x15, 0x03, 0x01, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0x01],
    'temp_profile_warm': [0x84, 0x15, 0x03, 0x01, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0x02],
};
