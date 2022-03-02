<script>
    import FlatButton from "../components/gui/buttons/FlatButton.svelte";
    import { token } from "../stores";
    import { login } from "../services/api/authApi";

    let username, password

    const test = async () => {
        login(username, password)
    }
</script>

{$token}
<form on:submit|preventDefault={test}>
    <input bind:value={username} placeholder="username" type="text">
    <input bind:value={password} placeholder="password" type="password">
</form>

<FlatButton on:click={test}>Lets test it</FlatButton>

<style>

</style>