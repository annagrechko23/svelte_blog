<script>
  export let title;
  export let index;
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  const removeItem = index => {
      console.log(index.index)
    dispatch("message"),
      {
        id: index.index
      };
  };
</script>

<style>
  .item-wrap {
    padding: 15px 30px;
    margin-bottom: 10px;
    border-radius: 10px;
    border: 1px solid #e7e7e7;
    box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
    display: flex;
    justify-content: space-between;
  }
  .icon {
    color: green;
  }
</style>

<li class="item-wrap">
  {title} {index}
  <span class="icon" on:click={removeItem({ index })}>
    <i class="fas fa-check" />
  </span>
</li>
