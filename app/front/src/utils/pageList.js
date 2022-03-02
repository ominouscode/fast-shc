import Devices from '../pages/Devices.svelte';
import Sensors from '../pages/Sensors.svelte';
import Video from '../pages/Video.svelte';

import Test from '../pages/Test.svelte';

export const pageList = [
    {id: "home", label: "Home", icon: "home", component: Video},
    {id: "devices", label: "Devices", icon: "device", component: Devices},
    {id: "sensors", label: "Sensors", icon: "sensor", component: Sensors},
    {id: "test", label: "Test", icon: "sensor", component: Test}
];