<script lang="ts">
    import {globalStore} from "../store";

    function keyChange(entry:string, newValue:Event) {
        const target = newValue.target as HTMLInputElement;
        if (target && 'value' in target) {
            $globalStore[target.value] = $globalStore[entry];
            delete $globalStore[entry];
        }
    }

</script>
    
<div class="Container">
    {#each Object.keys($globalStore) as entry}
        <div class="entry">
            <input class="Title" value={entry} on:change={newValue => keyChange(entry, newValue)}/>
            {#if $globalStore[entry]}
                <input class="Replacement" bind:value={$globalStore[entry]}/>
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
        width: 100%;
    }

    .Replacement {
        margin-top: 0.5rem;
        width: 100%
    }

</style>