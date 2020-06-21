<script>
  import { onMount, tick, afterUpdate } from 'svelte'
  import '@material/mwc-icon-button-toggle'
  import '@material/mwc-button'
  import '@material/mwc-icon'
  import '@material/mwc-icon-button'
  import { createEventDispatcher } from 'svelte/internal'
  import { get_current_component } from 'svelte/internal'
  import { storage } from '../firebase'
  import { put, getDownloadURL } from 'rxfire/storage'
  export let id = ''
  export let header = ''
  export let description = ''
  export let created = ''
  export let checked = ''
  export let image = ''
  export let comments = ''
  export let likes = ''

  let urlImage
  let postDescription
  let commentsBlock = []
  let fullText = false
  let showComments = false
  let createComment = false
  let commentName = ''
  let comment = ''
  let error = false
  const svelteDispatch = createEventDispatcher()
  const component = get_current_component()

  afterUpdate(() => {
    commentsBlock = Object.values(comments)
    const ref = storage.ref(image.path)
    getDownloadURL(ref).subscribe((url) => (urlImage = url))
  })
  onMount(async () => {
    await tick()

    setTimeout(() => {
      if (image) {
        const ref = storage.ref(image.path)
        getDownloadURL(ref).subscribe((url) => (urlImage = url))
      }
      if (comments) {
        commentsBlock = Object.values(comments)
      }
      postDescription = description
    }, 100)
  })
  const toggleStatus = () => {
    let newStatus = !checked
    component.dispatchEvent &&
      component.dispatchEvent(
        new CustomEvent('toggle', { detail: { id, newStatus, likes } }),
      )
  }
  const removePost = () => {
    let newStatus = !checked
    component.dispatchEvent &&
      component.dispatchEvent(new CustomEvent('removePost', { detail: { id } }))
  }
  const addComment = () => {
    component.dispatchEvent &&
      component.dispatchEvent(
        new CustomEvent('addComment', {
          detail: { commentsBlock, id, commentName, comment },
        }),
      )
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
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
      0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
    padding: 10px;
    border-radius: 5px;
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
    border: 1px rgba(0, 0, 0, 0.2) solid;
    z-index: 1;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
      0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  }
  mwc-button {
    --mdc-theme-primary: #ff3e00;
    --mdc-theme-on-primary: white;
    margin-top: 12px;
    font-size: 12px;
  }
  .close-form {
    text-align: right;
    margin-bottom: 10px;
    font-size: 21px;
    cursor: pointer;
  }
  .delete-post {
    text-align: right;
    cursor: pointer;
  }
</style>

<svelte:options tag="my-thing" />

<li style="margin-bottom: 20px;">
  <div class="card">
    <!-- <div class="delete-post" on:click={removePost}>
     &times;
      </div> -->
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
            style="color:red"
            on:click={toggleStatus}>
            <svg
              slot="onIcon"
              xmlns="http://www.w3.org/2000/svg"
              class="custom-svg"
              fill="#ff3e00"
              width="24"
              height="24"
              viewBox="0 0 24 24">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3
                7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3
                22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <svg
              slot="offIcon"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24">
              <path
                d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42
                3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12
                21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5
                3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5
                7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2
                0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
            </svg>
          </mwc-icon-button-toggle>
          <span class="comment-number">{likes}</span>
        </div>
        <div class="action-button">
          <mwc-icon-button
            style="color:red"
            on:click={() => (showComments = !showComments)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="custom-svg"
              fill="#ff3e00"
              width="24"
              height="24"
              viewBox="0 0 24 24">
              <path
                d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2
                2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
          </mwc-icon-button>

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
                <mwc-icon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24">
                    <path
                      d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25
                      1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69
                      0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56
                      1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48
                      10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41
                      0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98
                      5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09
                      2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z" />
                  </svg>
                </mwc-icon>
                <p>{comment.name}</p>
              </div>
              <div>{comment.comment}</div>
            </li>
          {/each}
        </ul>
        {#if createComment}
          <div class="create-comment-wrap">
            <div
              class="close-form"
              on:click={() => (createComment = !createComment)}>
              &times;
            </div>
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
          label="write a comment"
          on:click={() => (createComment = !createComment)}
          raised />
      {/if}
    </div>
  </div>
</li>
