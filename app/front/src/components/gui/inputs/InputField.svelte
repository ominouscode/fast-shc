<script>
    export let title;
    export let value;
</script>


<span>{title}</span>
<input bind:value={value} on:change type="text">


<style>
    input {
        margin: 0.5em 0 1em 0;
        padding: 0.5em 0.75em;
        color: rgba(var(--color-text-primary), 0.7);
        outline: 1px solid transparent;
        background-color: rgba(var(--color-base-secondary), 1);
        border-radius: 3px;
        border: none;
    }

    input:focus {
        color: rgba(var(--color-brand-primary), 1);
        outline: 1px solid rgba(var(--color-brand-primary), 1);
    }

    span {
        padding-left: 0.25em;
        font-size: 15px;
        color: rgba(var(--color-text-primary), 0.8);
    }
</style>