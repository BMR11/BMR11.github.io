package com.bmrbleperipheral

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class PeripheralManagerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val bluetoothManager: BluetoothManager = reactContext.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
    private val bluetoothAdapter: BluetoothAdapter = bluetoothManager.adapter
    private val advertiser = bluetoothAdapter.bluetoothLeAdvertiser

    override fun getName(): String = "PeripheralManager"

    @ReactMethod
    fun startAdvertise(deviceName: String, promise: Promise) {
        if (!bluetoothAdapter.isEnabled) {
            promise.reject("bluetooth_disabled", "Bluetooth is not enabled")
            return
        }
        val settings = AdvertiseSettings.Builder()
            .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
            .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
            .setConnectable(true)
            .build()
        val data = AdvertiseData.Builder()
            .setIncludeDeviceName(true)
            .build()
        advertiser.startAdvertising(settings, data, advertiseCallback(promise))
    }

    @ReactMethod
    fun stopAdvertise(promise: Promise) {
        advertiser.stopAdvertising(advertiseCallback(null))
        promise.resolve(null)
    }

    private fun advertiseCallback(promise: Promise?): AdvertiseCallback {
        return object : AdvertiseCallback() {
            override fun onStartSuccess(settingsInEffect: AdvertiseSettings) {
                promise?.resolve(null)
            }

            override fun onStartFailure(errorCode: Int) {
                promise?.reject("advertise_failed", "Advertising failed with code $errorCode")
            }
        }
    }
}
