<script>
  import { startWith } from 'rxjs/operators'
  import './Post.svelte'
  import { collectionData, firestore } from './../firebase'
  import firebase, { app } from '../firebase'
  import { put, getDownloadURL } from 'rxfire/storage'
  import { storage } from '../firebase'
  import { onMount, onDestroy } from 'svelte'
  import '@material/mwc-button'

  export let title = 'Svelte Clock'

  let header = ''
  let description = ''
  let createTemplate = false
  let error = false
  let url = ''
  let file = ''
  let allPosts = false
  let posts = []
  const postsData = firestore.collection('articles').orderBy('created')
  collectionData(postsData, 'id').subscribe((users) => {
    posts = users
  })

  function verifyUser() {}

  onMount(() => {
    window.verifyUser = verifyUser
  })

  onDestroy(() => {
    window.verifyUser = null
  })
  const addPost = () => {
    if (header && description) {
      firestore.collection('articles').add({
        header,
        description,
        created: Date.now(),
        checked: false,
        image: firestore.doc('/images/' + file.name),
        likes: 0,
      })
      var storageRef = storage.ref('images/' + file.name)
      var task = storageRef.put(file)
      task.on('state_changed', function progress(snapshot) {
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      })
      header = ''
      description = ''
      createTemplate = false
      error = false
    } else {
      error = true
    }
  }
  const countLikes = (event) => {
    console.log(event)
    const { id, newStatus, likes } = event.detail
    const num = newStatus ? likes + 1 : likes - 1
    firestore
      .collection('articles')
      .doc(id)
      .update({ likes: num, checked: newStatus })
  }
  const addComment = (event) => {
    const { id, commentName, comment, commentsBlock } = event.detail

    const generateNumber =
      commentsBlock.length === 0 ? 1 : commentsBlock.length + 1
    const newComments = {
      ...commentsBlock,
      [generateNumber]: {
        name: commentName,
        comment,
        date: Date.now(),
      },
    }
    firestore.collection('articles').doc(id).update({
      comments: newComments,
    })
  }
  const onFileChange = (event) => {
    var fileData = event.target.files[0]
    file = fileData
  }
</script>

<style>
  h1,
  div {
    font-family: 'Helvetica Neue', sans-serif;
  }
  .posts {
    list-style-type: none;
    padding: 0;
  }

  .blog-wrap {
    max-width: 360px;
    text-align: center;
    background-color: #fff;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 4px;
    /* position: absolute;
    top: 50%;
    right: 10%; */
    margin: 0 auto;
  }
  .blog-header {
    font-size: 24px;
    color: #fff;
    background-color: #ff3e00;
    text-align: center;
    margin: 0;
    padding: 10px;
    border-radius: 4px;
    text-transform: uppercase;
  }
  .create-post-wrap {
    display: flex;
    flex-direction: column;
  }
  li {
    margin-bottom: 20px;
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
  .error-message {
    color: red;
    margin: 20px 0;
    text-align: left;
    text-transform: capitalize;
  }
  .show-all-btn {
    text-align: left;
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

<svelte:options tag={'blog-window'} />

<div class="blog-wrap">
  <h1 class="blog-header">Blog</h1>
  <h1>{title}</h1>
  <ul class="posts">
    {#each allPosts ? posts : posts.slice(0, 3) as post}
      <my-thing {...post} on:toggle={countLikes} on:addComment={addComment} />
    {/each}
  </ul>
  {#if createTemplate}
    <div>
      <div class="create-post-wrap">
        <input bind:value={header} required placeholder="Title" />
        <textarea bind:value={description} placeholder="Description" />
        <input type="file" on:change={onFileChange} bind:value={url} />
        {#if error}
          <div class="error-message">please fill fields</div>
        {/if}
        <div
          class="g-recaptcha"
          data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
          data-callback="verifyUser" />
        <div on:click={addPost} class="action-btn">add post</div>
      </div>
    </div>
  {/if}
  <div class="show-all-btn">
      {#if posts.length > 3}
        {#if !allPosts}
          <mwc-button
            on:click={() => (allPosts = !allPosts)}
            label="show all posts"
            raised />
        {:else}
          <mwc-button
            on:click={() => (allPosts = !allPosts)}
            label="show less posts"
            raised />
        {/if}
      {/if}
  </div>
  <mwc-button
    on:click={() => (createTemplate = !createTemplate)}
    label="create new post"
    raised />
</div>
