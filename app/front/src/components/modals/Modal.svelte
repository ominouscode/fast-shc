<script>
    import FlatButton from '../gui/buttons/FlatButton.svelte';
    import TextButton from '../gui/buttons/TextButton.svelte';
    import IconButton from '../gui/buttons/IconButton.svelte';
    import {currentModal} from '../../stores.js';
    import { createEventDispatcher } from 'svelte';

    export let title = ""
    export let deleteEnabled = false

    const dispatch = createEventDispatcher();
</script>

<div class="modal">
    <div class="modal-window">
        <div class="modal-header">
          <div class="title">{title}</div>
          <IconButton id="close" size="md" on:click="{() => $currentModal = ""}" />
        </div>
        <div class="modal-content">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <TextButton on:click="{() => $currentModal = ""}">Cancel</TextButton>
          <FlatButton on:click>Save</FlatButton>
          {#if deleteEnabled}
          <FlatButton on:click="{() => {dispatch('delete')}}">Delete</FlatButton>
          {/if}
        </div>
    </div>
</div>

<style>
  .modal {
    display: absolute;
    position: fixed;
    z-index: 3;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(var(--color-bg), 0.4);
  }

  .modal-window {
    width: 50%;
    margin: 20vh auto;
    background-color: rgba(var(--color-base-primary), 1);
    box-shadow: 0px 0px 6px 4px rgba(0,0,0, 0.15);
    border-radius: 0.5em;
  }

  .modal-header {
    padding: 8px 8px 5px 8px;
    display: flex;
    justify-content: space-between;
  }

  .title {
    padding: 15px;
    color: rgba(var(--color-text-primary), 1);
  }

  .modal-content {
    padding: 15px 25px;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid rgba(var(--color-base-secondary), 1);
  }

  .modal-footer {
    padding: 20px 25px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1em;
  }
</style>