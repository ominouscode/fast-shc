<script>
    import {fly} from 'svelte/transition';
</script>

<div in:fly={{y:-25}}>
    <img src="img/photo.jpeg" alt="Video">
</div>

<style>
    img {
        max-width: 100%;
        max-height: 100%;
    }
</style>