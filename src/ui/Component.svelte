<script lang="ts">
    import Global from "./GlobalTags.svelte";
    import Local from "./LocalTags.svelte";

    export let activeTabValue = 1;

    let windowWidth:number = 1;

    const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);

</script>

<div class="Mode">
  {#if windowWidth >= 700}
      <p class="Power">POWER USER MODE</p>
  {:else}
      <p></p>
  {/if}
</div>
<div class="nav-header" bind:clientWidth={windowWidth}>
    <div class="nav-buttons-container navBar">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="clickable-icon nav-action-button" aria-label="Note Tags" on:click = {handleClick(1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sticky-note"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/></svg>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="clickable-icon nav-action-button" aria-label="Global Tags" on:click = {handleClick(2)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
        </div>

    </div>
</div>

{#if activeTabValue == 1}
<div class="box">
    <Local/>
</div>
{/if}

{#if activeTabValue == 2}
<div class="box">
    <Global/>
</div>
{/if}


  
<style>
    .Mode {
        text-align: right;
        padding-right: 50px;
        width: 100%;
        position: absolute;
    }

    .Power{
        color: var(--text-muted);
    }
</style>