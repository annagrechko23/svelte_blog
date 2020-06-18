<script>
  import { onMount } from 'svelte'
  import Icon from 'fa-svelte'
  import '@material/mwc-icon-button-toggle'
  import '@material/mwc-button'
  import '@material/mwc-icon'
  import '@material/mwc-icon-button'
  import { createEventDispatcher } from 'svelte'
  import { storage } from '../firebase'
  import { put, getDownloadURL } from 'rxfire/storage'

  export let id
  export let header
  export let description
  export let created
  export let checked
  export let image
  export let comments
  export let likes

  let urlImage
  let postDescription
  let commentsBlock = []
  let fullText = false
  let showComments = false
  let createComment = false
  let commentName = ''
  let comment = ''
  let error = false
  const dispatch = createEventDispatcher()
  onMount(() => {
    if (image) {
      const ref = storage.ref(image.path)
      getDownloadURL(ref).subscribe((url) => (urlImage = url))
    }
    if (comments) {
      commentsBlock = Object.values(comments)
    }
    postDescription = description
  })
  const toggleStatus = () => {
    console.log('the component has mounted')

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
    font-weight: bold;
    font-size: 12px;
    text-align: left;
  }
  .comment-date {
    font-weight: bold;
    font-size: 12px;
    text-align: left;
  }
  .action-button {
    display: flex;
    align-items: center;
    color: red;
    cursor: pointer;
    margin-right: 12px;
  }
  .action-btn {
    color: #ff3e00;
    border: 1px solid #ff3e00;
    border-radius: 5px;
    padding: 10px;
    display: inline-block;
    margin: 20px 0;
    cursor: pointer;
    transition: all 0.5s ease;
    text-transform: uppercase;
  }
  .action-btn:hover {
    color: #fff;
    background-color: #ff3e00;
  }
  .card {
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
      0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 20px;
  }
  input,
  textarea {
    margin-bottom: 20px;
    display: flex;
    border-radius: 5px;
    padding: 12px 16px 14px;
    border: none;
    z-index: 1;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
      0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  }
  mwc-button {
    --mdc-theme-primary: #ff3e00;
    --mdc-theme-on-primary: white;
    margin-top: 12px;
  }
</style>

<svelte:options tag="my-thing" />

<li style="margin-bottom: 20px;">
  <div class="card">
    <span class="post-date">{new Date(created).toLocaleString()}</span>
    <h2>{header}</h2>
    <i class="fa fa-address-book" aria-hidden="true" />
    <div class="post-image">
      <img src={urlImage} alt="" />
    </div>
    <div class={fullText ? 'active description' : 'description'}>
      {description}
    </div>
    <div>
      {#if postDescription && postDescription.length > 70}
        

          {#if !fullText}
            <mwc-button
              on:click={() => (fullText = !fullText)}
              label="show more"
              raised />
          {:else}
            <mwc-button
              on:click={() => (fullText = !fullText)}
              label="show less"
              raised />
          {/if}
      {/if}
      <div
        class="actions-wrap"
        style=" display: flex; justify-content: flex-end;">
        <div class="action-button">
          <mwc-icon-button-toggle
            on={checked}
            onIcon="favorite"
            style="color:red"
            on:click={toggleStatus}
            offIcon="favorite_border" />
          <span class="comment-number">{likes}</span>
        </div>
        <div class="action-button">
          <mwc-icon-button
            style="color:red"
            on:click={() => (showComments = !showComments)}
            icon="comment" />

          {#if comments}
            <span class="comment-number">{Object.keys(comments).length}</span>
          {/if}

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
              <p class="comment-date">
                {new Date(comment.date).toLocaleString()}
              </p>

              <div class="comment-name">
                <mwc-icon>face</mwc-icon>
                <p>{comment.name}</p>
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
            <textarea bind:value={comment} placeholder="Comment" />
            {#if error}
              <div class="error-message">please fill fields</div>
            {/if}
            <mwc-button on:click={addComment(id)} label="add comment" raised />
          </div>
        {/if}
        <mwc-button
          on:click={addComment(id)}
          label="write a comment"
          on:click={() => (createComment = !createComment)}
          raised />
      {/if}
    </div>
  </div>
</li>
