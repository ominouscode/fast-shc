<script>
    export let title;
    export let value;
    export let options = [];
</script>

<span>{title}</span>
<select bind:value={value}>
    {#each options as option}
        <option value={option}>{option}</option>
    {/each}
</select>

<style>
    select {
        margin: 0.5em 0 1em 0;
        padding: 0.5em 0.75em;
        color: rgba(var(--color-text-primary), 0.7);
        outline: 1px solid transparent;
        background-color: rgba(var(--color-base-secondary), 1);
        border-radius: 3px;
        border: none;
        appearance: none;
    }
    
    select:focus {
        color: rgba(var(--color-brand-primary), 1);
        outline: 1px solid rgba(var(--color-brand-primary), 1);
    }

    option {
        margin: 0.5em 0 1em 0;
        padding: 0.5em 0.75em;
        color: rgba(var(--color-text-primary), 0.7);
        background-color: rgba(var(--color-base-secondary), 1);
        border: 1px solid red;
    }

    span {
        padding-left: 0.25em;
        font-size: 15px;
        color: rgba(var(--color-text-primary), 0.8);
    }
</style>