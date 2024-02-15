<script lang="ts">
    export let globalTags:Record<string, string | null>;
</script>
    
<div class="Container">
    {#each Object.keys(globalTags) as entry}
        <div class="entry">
            <input class="Title" value={entry}/>
            <input class="Replacement" value={globalTags[entry] || ""}/>
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
        width: 100%;
    }

    .Replacement {
        margin-top: 0.5rem;
        width: 100%
    }

</style>