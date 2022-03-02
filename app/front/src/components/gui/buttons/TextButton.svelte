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
        background-color: transparent;
        cursor: pointer;
    }

    button:hover {
        border: 1px solid rgba(var(--color-brand-primary), 1);
    }

    span {
        color: rgba(var(--color-text-primary), 1);
        font-weight: 500;
        text-transform: uppercase;
    }
</style>