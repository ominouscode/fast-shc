<script>
    import Icon from '../Icon.svelte';

    export let id;
    export let size = "md";
</script>

<button on:click class:xs={size == "xs"} class:sm={size == "sm"} class:md={size == "md"} class:lg={size == "lg"}>
<Icon {id} />
</button>

<style>
    button {
        padding: 0;
        background-color: transparent;
        fill: rgba(var(--color-text-primary), 0.6);
        border: none;
        cursor: pointer;
    }

    button:hover {
        fill: rgba(var(--color-brand-primary), 1);
    }

    .xs {
        height: 3px;
        width: 3px;
    }

    .sm {
        width: 13px;
        height: 13px;
    }

    .md {
        width: 18px;
        height: 18px;
    }

    .lg {
        width: 23px;
        height: 23px;
        fill: rgba(var(--color-brand-primary), 0.9);
    }

    .lg:hover {
        fill: rgba(var(--color-brand-primary), 1);
    }
</style>