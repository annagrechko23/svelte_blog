<script>
  import TodoItem from "./TodoItem.svelte";

  let list = [
    { id: "1", name: "Buy milk" },
    { id: "2", name: "Buy bread" },
    { id: "3", name: "Buy somth" }
  ];
  let input = "";
  const removeItem = (event) => {
    console.log(event)
    list.splice(event.detail.id, 1);
  };

  const addItem = () => {
    list = [
      ...list,
      {
        name: input,
        id: list.length + 1
      }
    ];
    input = "";
  };
</script>

<style>
  .todo-wrap {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
  .list {
    max-width: 50%;
    margin: 0 auto;
    list-style-type: none;
  }
  .add-input {
    border: 1px solid #e7e7e7;
    box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
    border-radius: 5px 0 0 5px;
    height: 50px;
    padding: 5px 15px;
  }
  .add-item {
    display: flex;
    justify-content: center;
  }
  .add-icon {
    width: 40px;
    height: 50px;
    background: green;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    border: none;
  }
</style>

<div class="todo-wrap">
  <h1>Svelte TODO</h1>
  <form class="add-item" on:submit|preventDefault={addItem}>
    <input
      bind:value={input}
      type="text"
      class="add-input"
      placeholder="type" />
    <button class="add-icon">
      <i class="fas fa-plus" />
    </button>
  </form>
  <ul class:list={list.length > 0}>
    {#each list as item, i}
      <TodoItem title={item.name} index={i} on:message={removeItem} />
    {/each}
  </ul>
</div>
