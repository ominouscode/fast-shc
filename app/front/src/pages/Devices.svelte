<script>
    import { onMount } from "svelte";
    import { fly } from 'svelte/transition';
    import { deviceStore, currentModal } from "../stores";
    import { loadDevices, addDevice, updateDevice, removeDevice } from "../services/api/deviceApi";

    import Icon from "../components/gui/Icon.svelte";
    import IconButton from "../components/gui/buttons/IconButton.svelte";
    import DeviceModal from "../components/modals/DeviceModal.svelte";

    onMount(function() {
        loadDevices()
    })
    
    let targetDevice = {}

    const newDevice = () => {
        targetDevice = {name: "", category: "air", active: false, socket: -1}
        $currentModal = "deviceModal"
    }

    const editDevice = (device) => {
        targetDevice = device
        $currentModal = "deviceModal"
    }

    const saveDevice = (device) => {
        device = device.detail
        // update existing device
        if(device.id) updateDevice(device)
        // create new device
        else addDevice(device)
        console.log(device)
        $currentModal = "";
    }

    const deleteDevice = () => {
        removeDevice(targetDevice)
        $currentModal = "";
    }
</script>


<div class="wrapper" in:fly={{y:-25}}>
    <div class="header">
        <span class="title">Devices</span>
    </div>
    <div class="container">
        <table>
            <tr>
              <td>Device</td>
              <td>Name</td>
              <td>Active</td>
              <td>Socket</td>
              <td><div class="action"><IconButton on:click={newDevice} id="plus" size="lg" /></div></td>
            </tr>
            {#each $deviceStore as device}
            <tr>
                <td><div class="icon"><Icon id={device.category} /></div></td>
                <td>{device.name}</td>
                <td>{device.active}</td>
                <td>{#if device.socket >= 1}Plug {device.socket} {:else} Unplugged{/if}</td>
                <td><IconButton on:click={editDevice(device)} id="elipsis" size="lg" /></td>
            </tr>
            {/each}
          </table>
    </div>
</div>

{#if $currentModal == "deviceModal"}
<DeviceModal device={targetDevice} on:save={saveDevice} on:delete={deleteDevice} />
{/if}


<style>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    tr td {
        padding: 1em 1.25em;
        font-size: 15px;
        border-bottom: 1px solid rgba(var(--color-base-secondary), 1);
    }

    tr:first-child td {
        font-size: 16px;
        color: rgba(var(--color-text-primary), 0.9);
    }

    tr:last-child td {
        border-bottom: none;
    }

    tr:hover td {
        color: rgba(var(--color-text-primary), 0.9);
    }

    tr:hover .icon {
        fill: rgba(var(--color-text-primary), 0.7);
    }

    td:last-child {
        width: 1em;
    }

    .wrapper {
        width: 100%;
    }

    .header {
        display: flex;
        align-items: flex-end;
        padding: 0 0.5em 0.5em 0.5em;
    }

    .title {
        padding-bottom: 0.25em;
        font-size: 20px;
        color: rgba(var(--color-text-primary), 1);
    }

    .action {
        padding-top: 6px;
    }

    .container {
        background-color: rgba(var(--color-base-primary), 1);
        border-radius: 2px;
        box-shadow: 0px 0px 6px 4px rgba(0,0,0, 0.1);
    }

    .icon {
        margin-left: 0.25em;
        padding: 0.25em;
        height: 2.5em;
        width: 2.5em;
        fill: rgba(var(--color-text-secondary), 0.7);
    }
</style>