<script>

</script>

<button on:click>
    <span>
        <slot></slot>
    </span>
</button>

<style>
    button {
        padding: 0.4em 1.25em;
        border: 1px solid transparent;
        border-radius: 2px;
        background-color: rgba(var(--color-brand-primary), 0.9);
        cursor: pointer;
    }

    button:hover {
        background-color: rgba(var(--color-brand-primary), 1);
    }

    span {
        color: rgba(var(--color-text-primary), 1);
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
    }
</style>