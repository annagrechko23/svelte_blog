<script>
  import { slide } from "svelte/transition";
  import { elasticInOut } from "svelte/easing";
  import Button, { Label } from "@smui/button";
  import Card, {
    Content,
    PrimaryAction,
    Media,
    MediaContent,
    Actions,
    ActionButtons,
    ActionIcons
  } from "@smui/card";
  import IconButton, { Icon } from "@smui/icon-button";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
export let id;
  export let header;
  export let description;
  export let created;
  export let checked;
  export let addToFavourite;

  let fullText = false;

  function toggleStatus() {
    let newStatus = !checked;
    dispatch("toggle", {
      id,
      newStatus
    });
  }
</script>

<style type="text/scss">
  li {
    margin-bottom: 20px;
  }
  .post-date {
    font-weight: bold;
    font-size: 12px;
    text-align: left;
  }
</style>

<li>
  <Card style="width: 360px; padding: 20px;">
    <span class="post-date">{new Date(created).toLocaleString()}</span>
    <h2>{header}</h2>
    <Content class={fullText ? 'active' : ''}>{description}</Content>
    <Actions>
      <ActionButtons>
        {#if description.length > 70}
          <Button on:click={() => (fullText = !fullText)}>
            <Label>show more</Label>
          </Button>
        {/if}
      </ActionButtons>
      <ActionIcons>
        <IconButton
          on:click={toggleStatus}
          bind:pressed={checked}
          toggle
          aria-label="Add to favorites"
          title="Add to favorites">
          <Icon class="material-icons" on>favorite</Icon>
          <Icon class="material-icons">favorite_border</Icon>
        </IconButton>
      </ActionIcons>
    </Actions>
  </Card>
</li>
