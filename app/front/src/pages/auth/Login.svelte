<script>
    import InputField from "../../components/gui/inputs/InputField.svelte";
    import { login } from "../../services/api/authApi";

    let username, password
    let error = ""

    const submit = async () => {
        error = await login(username, password)
    }

    const resetError = () => { error = "" }
</script>


<div class="login">
    <div class="logo">
        Controller
    </div>
    <form on:submit|preventDefault={submit}>
        <InputField bind:value={username} title="Username" on:change={resetError} />
        <InputField bind:value={password} title="Password" on:change={resetError} />
        <span>{error}</span>
        <input type="submit" value="Login">
    </form>
</div>


<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 0.25em;
        padding: 2em;
        margin: 1.25em 1em;
        width: 400px;
        background-color: rgba(var(--color-base-primary), 1);
        border-radius: 2px;
        box-shadow: 0px 0px 6px 4px rgba(0,0,0, 0.1);
    }
    input[type=submit] {
        padding: 0.35em;
    }
    span {
        margin: 0.5em auto;
        text-align: center;
        color: rgba(var(--color-brand-primary), 1);
    }
    .login {
        height: 100vh;
        display: flex;
        flex-direction: column;
		justify-content: center;
        align-items: center;
    }
    .logo {
        color: rgba(var(--color-text-primary), 1);
        font-size: 19px;
        font-weight: 900;
        text-transform: uppercase;
    }
</style>