<script lang="ts">
    import {localStore} from "../store";
</script>

<div class="Container">
    {#each Object.keys($localStore) as entry}
        <div class="entry">
            <p class="Title"> {entry} </p>
            {#if $localStore[entry]}
                <input class="Replacement" bind:value={$localStore[entry]}/>
            {/if}
        </div>
    {/each}
</div>    

<style>
    .entry {
        grid-column: 1;
        width: 80%;
        margin-left: auto;
        margin-right: auto;
    }

    .Container {
        width: 100%;
        display: grid
    }

    .Title {
        margin-top: 2rem;
        margin-bottom: 0px;
        width: 100%;
    }

    .Replacement {
        width: 100%;
        margin-top: 0.5rem;
    }

</style>