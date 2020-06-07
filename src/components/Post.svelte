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
  import Textfield from "@smui/textfield";

  import IconButton, { Icon } from "@smui/icon-button";
  import { createEventDispatcher } from "svelte";
  import { storage } from "../firebase";
  import { put, getDownloadURL } from "rxfire/storage";
  const dispatch = createEventDispatcher();
  export let id;
  export let header;
  export let description;
  export let created;
  export let checked;
  export let image;
  export let comments;
  let urlImage;
  let commentsBlock = [];
  let fullText = false;
  let showComments = false;
  let createComment = false;

  let commentName = "";
  let comment = "";
  let error = false;

  if (image) {
    const ref = storage.ref(image.path);
    getDownloadURL(ref).subscribe(url => (urlImage = url));
  }
  if (comments) {
    commentsBlock = Object.values(comments);
    console.log(commentsBlock)
  }

  const toggleStatus = () => {
    let newStatus = !checked;
    dispatch("toggle", {
      id,
      newStatus
    });
  };
  const addComment = () => {
    dispatch("addComment", {
      commentsBlock,
      id,
      commentName,
      comment
    });
    createComment = false;
   commentName = "";
   comment = "";
   error = false;
  };
</script>

<style type="text/scss" lang="scss">
  li {
    margin-bottom: 20px;
  }
  .post-date {
    font-weight: bold;
    font-size: 12px;
    text-align: left;
  }
  .post-image {
    width: auto;
    height: 150px;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .post-image img{
    width: 100%;
    height: auto;
  }
  .comment-number {
    font-size: 12px;
  }
  .comments-wrap {
    list-style-type: none;
    padding: 0;
    text-align: left;
  }
  .comments-wrap li {
    border: 1px solid #eee;
    padding: 0 10px 10px;
    border-radius: 5px;
  }
  h3 {
    font-size: 18px;
  }
  
  .comment-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .comment-name p{
    display: flex;
    align-items: center;
  }
</style>

<li>
  <Card style="width: 360px; padding: 20px;">
    <span class="post-date">{new Date(created).toLocaleString()}</span>
    <h2>{header}</h2>
    {#if urlImage}
    <div class="post-image">
      <img src={urlImage} alt="" />
    </div>
    {/if}
    <Content class={fullText ? 'active' : ''}>{description}</Content>
    <Actions>
      <ActionButtons>
        {#if description.length > 70}
          <Button on:click={() => (fullText = !fullText)}>
            {#if !fullText}
              <Label>show more</Label>
            {:else}
              <Label>show less</Label>
            {/if}
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
        <IconButton
          class="comment-button"
          on:click={() => (showComments = !showComments)}
          toggle
          aria-label="Add to favorites"
          title="Add to favorites">
          <Icon class="material-icons" on>comment</Icon>
          <Icon class="material-icons">comment_border</Icon>
          <span class="comment-number">{commentsBlock.length}</span>
        </IconButton>
      </ActionIcons>
    </Actions>
    {#if showComments}
      <ul class="comments-wrap">
        {#if commentsBlock.length > 0}
          <h3>Comments</h3>
        {:else}
        <h3>No Comments. Left One.</h3>
        {/if}
        {#each commentsBlock as comment}
          <li>
            <div class="comment-name">
            <p ><Icon class="material-icons">face</Icon>
              {comment.name}</p>
              <p>{new Date(comment.date).toLocaleString()}</p>
            </div>
            <div>{comment.comment}</div>
          </li>
        {/each}
      </ul>
      {#if createComment}
        <div class="create-comment-wrap">
          <Textfield bind:value={commentName} input$required label="Name" />
          <Textfield textarea bind:value={comment} label="Comment" />
          {#if error}
            <div class="error-message">please fill fields</div>
          {/if}
          <Button on:click={addComment}>
            <Label>add comment</Label>
          </Button>
        </div>
      {/if}
      <Button
        style="margin-top: 20px;"
        on:click={() => (createComment = !createComment)}>
        <Label>write a comment</Label>
      </Button>
    {/if}

  </Card>
</li>
