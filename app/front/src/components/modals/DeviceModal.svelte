<script>
    import Modal from './Modal.svelte';
    import InputField from '../gui/inputs/InputField.svelte';
    import Select from '../gui/inputs/Select.svelte';
    import { createEventDispatcher } from 'svelte';

    export let device;
    export let title = device.id ? "Device settings" : "Add a new device";

    $: deleteEnabled = device.id && device.socket === -1 ? true : false
    const dispatch = createEventDispatcher();
</script>

<Modal {title} on:click="{() => {dispatch('save', device)}}" on:delete="{() => {dispatch('delete')}}" {deleteEnabled}>
    <InputField bind:value="{device.name}" title="Name" />
    <Select bind:value="{device.category}" options="{["light", "fan", "air"]}" title="Type" />
    <Select bind:value="{device.socket}" options="{[-1, 2, 3, 4, 5]}" title="Socket" />
</Modal>

<style>

</style>