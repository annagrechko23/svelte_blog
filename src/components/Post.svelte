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
  export let likes;
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
  }

  const toggleStatus = () => {
    let newStatus = !checked;
    console.log(newStatus)
    dispatch("toggle", {
      id,
      newStatus,
      likes
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
  const createComments = () => {
    createComment = !createComment
  }
  const showCommentsBlock = () => {
    showComments = !showComments
  }
    const fullTextShow = () => {
      fullText = !fullText
  }
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
  <div class="card" style="width: 360px; padding: 20px;">
    <span class="post-date">{new Date(created).toLocaleString()}</span>
    <h2>{header}</h2>
    {#if urlImage}
    <div class="post-image">
      <img src={urlImage} alt="" />
    </div>
    {/if}
    <div class={fullText ? 'active' : ''}>{description}</div>
    <div>
      {#if description.length > 70}
          <div>
            {#if !fullText}
              <span>show more</span>
            {:else}
              <span>show less</span>
            {/if}
          </div>
        {/if}
      <div>
        <div
          class="action-button"
          on:click={toggleStatus}
          on:click={checked}
          toggle
          aria-label="Add to favorites"
          title="Add to favorites">
          <div class="material-icons" on>favorite</div>
          <div class="material-icons">favorite_border</div>
          <span class="comment-number"> {likes}</span>
        </div>
        <div
          class="action-button"
          on:click={showCommentsBlock}
          toggle
          aria-label="Add to favorites"
          title="Add to favorites">
          <div class="material-icons" on>comment</div>
          <div class="material-icons">comment_border</div>
          <span class="comment-number">{commentsBlock.length}</span>
        </div>
      </div>
    {#if showComments}
      <ul class="comments-wrap">
        {#if commentsBlock.length > 0}
          <h3>Comments</h3>
        {:else}
        <h3>No Comments. Write One.</h3>
        {/if}
        {#each commentsBlock as comment}
          <li>
            <div class="comment-name">
            <p>
            <Icon class="material-icons">face</Icon>
              {comment.name}</p>
              <p>{new Date(comment.date).toLocaleString()}</p>
            </div>
            <div>{comment.comment}</div>
          </li>
        {/each}
      </ul>
      {#if createComment}
        <div class="create-comment-wrap">
        <input type="text" value={commentName} required placeholder="Name">
        <textarea > </textarea>
          {#if error}
            <div class="error-message">please fill fields</div>
          {/if}
          <div on:click={addComment}>
            <span>add comment</span>
          </div>
        </div>
      {/if}
      
      <div
        style="margin-top: 20px;"
        on:click={createComments}>
        <span>write a comment</span>
      </div>
    {/if}

  </div>
</li>
