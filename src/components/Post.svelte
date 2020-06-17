<script>
  import favourite from './../../public/assets/favourite.svg';
  import commentIcon from './../../public/assets/comment.svg';
  import Icon from 'fa-svelte';
  import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
  import { createEventDispatcher } from 'svelte';
  import { storage } from '../firebase';
  import { put, getDownloadURL } from 'rxfire/storage';

  export let id = 'empty';
  export let header = 'empty';
  export let description = 'empty';
  export let created = 'empty';
  export let checked = 'empty';
  export let image = '';
  export let comments = [];
  export let likes = 'empty';

  let urlImage;
  let commentsBlock = [];
  let fullText = false;
  let showComments = false;
  let createComment = false;
  let commentName = '';
  let comment = '';
  let error = false;
  const dispatch = createEventDispatcher();

  if (image) {
    const ref = storage.ref(image.path)
    getDownloadURL(ref).subscribe((url) => (urlImage = url))
  }
  if (comments) {
    commentsBlock = Object.values(comments)
  }
  const toggleStatus = () => {
    let newStatus = !checked
    dispatch('toggle', {
      id,
      newStatus,
      likes,
    })
  }
  const addComment = () => {
    dispatch('addComment', {
      commentsBlock,
      id,
      commentName,
      comment,
    })
    createComment = false
    commentName = ''
    comment = ''
    error = false
  }
</script>

<style>
  li {
    margin-bottom: 20px;
  }
  .description {
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    padding: 0 !important;
  }
  .post-date {
    font-weight: bold;
    font-size: 12px;
    text-align: left;
  }
  .description.active {
    display: initial;
    -webkit-box-orient: initial;
  }
  .create-comment-wrap {
    display: flex;
    flex-direction: column;
  }

  .post-image {
    width: auto;
    height: 150px;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .post-image img {
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
  .comment-name p {
    display: flex;
    align-items: center;
  }

  .action-button {
    cursor: pointer;
  }
</style>

<svelte:options tag="my-thing" />

<li style="margin-bottom: 20px;">
  <div
    class="card"
    style="border-radius: 4px; background-color: #fff; box-shadow: 0 2px 1px
    -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0
    rgba(0, 0, 0, 0.12); display: flex; flex-direction: column; box-sizing:
    border-box; padding: 20px;">
    <span class="post-date">{new Date(created).toLocaleString()}</span>
    <h2>{header}</h2>
    <i class="fa fa-address-book" aria-hidden="true" />

    {#if image}
      <div class="post-image">
        <img src={urlImage} alt="" />
      </div>
    {/if}
    <div class={fullText ? 'active description' : 'description'}>
      {description}
    </div>
    <div>
      {#if description.length > 70}
        <div on:click={() => (fullText = !fullText)} class="action-btn">
          {#if !fullText}show more{:else}show less{/if}
        </div>
      {/if}
      <div
        class="actions-wrap"
        style=" display: flex; justify-content: flex-end;">
        <div
          class="action-button"
          on:click={toggleStatus(id, checked, likes)}
          style="color: #ff3e00; cursor: pointer;">
          {@html favourite}
          <span class="comment-number">{likes}</span>
        </div>
        <div
          class="action-button"
          style="color: #ff3e00; cursor: pointer;"
          on:click={() => (showComments = !showComments)}>
          {@html commentIcon}
          {#if comments}
            <span class="comment-number">{Object.keys(comments).length}</span>
          {/if}
        </div>
        <Icon icon={faCircle}></Icon>
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
                <i class="material-icons">face</i>
                {comment.name}
                <p>{new Date(comment.date).toLocaleString()}</p>
              </div>
              <div>{comment.comment}</div>
            </li>
          {/each}
        </ul>
        {#if createComment}
          <div class="create-comment-wrap">
            <input
              type="text"
              required
              bind:value={commentName}
              placeholder="Name" />
            <textarea bind:value={comment} />
            {#if error}
              <div class="error-message">please fill fields</div>
            {/if}
            <div on:click={addComment(id)} class="action-btn">add comment</div>
          </div>
        {/if}

        <div
          class="action-btn"
          style="margin-top: 20px;"
          on:click={() => (createComment = !createComment)}>
          <span>write a comment</span>
        </div>
      {/if}

    </div>
  </div>
</li>
