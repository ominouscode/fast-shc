from gpio.sensors import am2302

async def read_sensor_data(pin, sensor_type):
    if sensor_type == "DHT11" or sensor_type == "DHT22": return await am2302.read(pin, sensor_type)
    return "unknown sensor"
