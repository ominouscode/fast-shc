import time
try:
    import adafruit_dht
except ImportError as error:
    print("Could not import adafruit libraries!")


def read(pin, sensor_type):
    if sensor_type == "DHT11": dhtDevice = adafruit_dht.DHT11(pin)
    if sensor_type == "DHT22": dhtDevice = adafruit_dht.DHT22(pin)

    for _ in range(10):
        try:
            temperature = dhtDevice.temperature
            humidity = dhtDevice.humidity
            #dhtDevide.exit() ?
            return {"temperature": temperature, "humidity": humidity}
        except RuntimeError as error:
            print(error.args[0])
            time.sleep(0.5)
            continue
        except Exception as error:
            dhtDevice.exit()
            return  {"error": error}